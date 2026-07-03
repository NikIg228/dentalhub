using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using StomST.Interfaces;

namespace StomST.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAccountInterface _repository;
        public AccountController(IAccountInterface repository)
        {
            this._repository = repository;
        }
        public IActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password, bool remember)
        {
            if (ModelState.IsValid)
            {
                int employeeId = _repository.GetEmployeeId(username, password);

                if (employeeId == 0)
                {
                    ModelState.AddModelError("", "Неверное имя пользователя или пароль");
                    return View();
                }

                int dentistryId = _repository.GetDentistryId(employeeId);

                List<string> roles = _repository.GetRoles(employeeId);

                var claims = new List<Claim>
        {
            new Claim(ClaimsIdentity.DefaultNameClaimType, username),
            new Claim("EmployeeId", employeeId.ToString()), // добавляем ID сотрудника
            new Claim("DentistryId", dentistryId.ToString()) // добавляем ID стоматологии
        };

                claims.AddRange(roles.Select(role => new Claim(ClaimsIdentity.DefaultRoleClaimType, role)));

                // Создание клеймов
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // Настройка времени действия аутентификационного cookie
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = remember, // Если true, cookie будет постоянной (сохранена после закрытия браузера)
                    ExpiresUtc = remember ? DateTimeOffset.UtcNow.AddDays(7) : DateTimeOffset.UtcNow.AddMinutes(30) // Время жизни cookie
                };

                // Аутентификация пользователя
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);


                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }
    }
}
