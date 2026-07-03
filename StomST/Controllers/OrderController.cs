using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace StomST.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        public IActionResult Archive()
        {
            return View();
        }
        public IActionResult Discount()
        {
            return View();
        }
    }
}
