using Microsoft.AspNetCore.Mvc;
using Registration_page.Models;
using Registration_page.Services;

namespace Registration_page.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IRegisterService _registerService;

        public HomeController(ILogger<HomeController> logger, IRegisterService registerService)
        {
            _logger = logger;
            _registerService = registerService;
        }

        // 1. The Landing Page (Registration Form)
        public IActionResult Index()
        {
            return View();
        }

        // 2. The Registration API (AJAX calls this)
        [HttpPost]
        public IActionResult Register([FromBody] UserRegistrationModel model)
        {
            if (model == null) return Json(new { success = false, message = "No data received" });

            string errorMsg;
            bool isSuccess = _registerService.RegisterUser(model, out errorMsg);

            if (isSuccess)
                return Json(new { success = true, message = "Account created successfully!" });
            else
                return Json(new { success = false, message = "Error: " + errorMsg });
        }

        // 3. NEW: The User List Page (Table)
        [HttpGet]
        public IActionResult UserList()
        {
            // Call the service to get all data
            List<UserRegistrationModel> users = _registerService.GetAllUsers();

            // Pass the list to the View
            return View(users);
        }

        [HttpPost]
        public IActionResult UpdateUser([FromBody] UserRegistrationModel model)
        {
            if (model == null || model.Id == 0)
                return Json(new { success = false, message = "Invalid data." });

            string errorMsg;
            bool isSuccess = _registerService.UpdateUser(model, out errorMsg);

            if (isSuccess)
                return Json(new { success = true, message = "User updated successfully!" });
            else
                return Json(new { success = false, message = "Update failed: " + errorMsg });
        }
    }
}