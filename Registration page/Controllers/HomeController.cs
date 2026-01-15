using Microsoft.AspNetCore.Mvc;
using Registration_page.Models;
using Registration_page.Services; // Import the Service namespace

namespace Registration_page.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        // 1. Declare the Service
        private readonly IRegisterService _registerService;

        // 2. Inject the Service in the Constructor
        public HomeController(ILogger<HomeController> logger, IRegisterService registerService)
        {
            _logger = logger;
            _registerService = registerService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register([FromBody] UserRegistrationModel model)
        {
            if (model == null)
            {
                return Json(new { success = false, message = "No data received" });
            }

            // 3. Call the Service (The Chef) to do the work
            string errorMsg;
            bool isSuccess = _registerService.RegisterUser(model, out errorMsg);

            if (isSuccess)
            {
                return Json(new { success = true, message = "Account created successfully!" });
            }
            else
            {
                return Json(new { success = false, message = "Error: " + errorMsg });
            }
        }
    }
}