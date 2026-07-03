using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StomST.Dtos;
using StomST.Interfaces;
using System.Security.Claims;

namespace StomST.Controllers.Api
{
    [ApiController]
    [Route("api/auth")]
    public class AuthApiController : ControllerBase
    {
        private readonly IAccountInterface _repository;

        public AuthApiController(IAccountInterface repository)
        {
            _repository = repository;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Логин и пароль обязательны" });
            }

            int employeeId = _repository.GetEmployeeId(request.Username, request.Password);
            if (employeeId == 0)
            {
                return Unauthorized(new { message = "Неверное имя пользователя или пароль" });
            }

            int dentistryId = _repository.GetDentistryId(employeeId);
            List<string> roles = _repository.GetRoles(employeeId);

            var claims = new List<Claim>
            {
                new(ClaimsIdentity.DefaultNameClaimType, request.Username),
                new("EmployeeId", employeeId.ToString()),
                new("DentistryId", dentistryId.ToString())
            };
            claims.AddRange(roles.Select(role => new Claim(ClaimsIdentity.DefaultRoleClaimType, role)));

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var properties = new AuthenticationProperties
            {
                IsPersistent = request.Remember,
                ExpiresUtc = request.Remember ? DateTimeOffset.UtcNow.AddDays(7) : DateTimeOffset.UtcNow.AddMinutes(30)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity),
                properties);

            return Ok(ToCurrentUserDto(User.Identity?.Name ?? request.Username, employeeId, dentistryId, roles));
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return NoContent();
        }

        [HttpGet("me")]
        [HttpGet("/api/me")]
        [Authorize]
        public ActionResult<CurrentUserDto> Me()
        {
            string userName = User.Identity?.Name ?? string.Empty;
            int employeeId = ParseClaim("EmployeeId");
            int dentistryId = ParseClaim("DentistryId");
            List<string> roles = User.FindAll(ClaimsIdentity.DefaultRoleClaimType)
                .Select(claim => claim.Value)
                .ToList();

            return Ok(ToCurrentUserDto(userName, employeeId, dentistryId, roles));
        }

        private int ParseClaim(string claimType)
        {
            return int.TryParse(User.FindFirst(claimType)?.Value, out int value) ? value : 0;
        }

        private static CurrentUserDto ToCurrentUserDto(
            string userName,
            int employeeId,
            int dentistryId,
            IReadOnlyList<string> roles)
        {
            return new CurrentUserDto(userName, employeeId, dentistryId, roles);
        }
    }
}
