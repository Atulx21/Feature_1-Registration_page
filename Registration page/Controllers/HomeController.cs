using Microsoft.AspNetCore.Mvc;
using Registration_page.Data;
using Registration_page.Models;
using System.Diagnostics;

namespace Registration_page.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context; // 1. Add database context variable

        // 2. Inject the database context in the constructor
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        // 3. This action handles the form submission
        [HttpPost]
        public IActionResult Register(User user)
        {
            if (ModelState.IsValid)
            {
                _context.Users.Add(user);
                _context.SaveChanges();

                // Set a flag that lasts for one request (the redirect)
                TempData["SuccessMessage"] = "Registration successful! Welcome to Troywings Technologies.";

                // Clear the form (Redirecting effectively clears the inputs)
                return RedirectToAction("Index");
            }

            return View("Index", user);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}