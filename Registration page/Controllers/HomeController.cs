using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Registration_page.Models;

using MySql.Data.MySqlClient;
using Registration_page.Data;

namespace Registration_page.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        // =========================================================================
        // NEW CODE: Registration Logic
        // =========================================================================
        [HttpPost]
        public IActionResult Register([FromBody] UserRegistrationModel model)
        {
            // 1. Basic Validation
            if (model == null)
            {
                return Json(new { success = false, message = "No data received from the form." });
            }

            try
            {
                // 2. Get the Database Instance (Singleton Pattern)
                var dbCon = DBConnection.Instance();

                // 3. Set Database Credentials
                // MAKE SURE THESE MATCH YOUR MYSQL SETTINGS
                dbCon.Server = "localhost";
                dbCon.DatabaseName = "troywingsdb";
                dbCon.UserName = "root";
                dbCon.Password = "Pain@10z";  

                // 4. Open Connection
                if (dbCon.IsConnect())
                {
                    // 5. Prepare the SQL Query
                    // We use the same column names as the table we created in Step 1
                    string query = @"INSERT INTO Users 
                                   (FullName, FatherName, DateOfBirth, Email, Address, PhoneNumber) 
                                   VALUES 
                                   (@Name, @Father, @Dob, @Email, @Addr, @Phone)";

                    // 6. Create the Command
                    var cmd = new MySqlCommand(query, dbCon.Connection);

                    // 7. Add Parameters (Security best practice to prevent SQL Injection)
                    cmd.Parameters.AddWithValue("@Name", model.FullName);
                    cmd.Parameters.AddWithValue("@Father", model.FatherName);
                    cmd.Parameters.AddWithValue("@Dob", model.DateOfBirth);
                    cmd.Parameters.AddWithValue("@Email", model.Email);
                    cmd.Parameters.AddWithValue("@Addr", model.Address);
                    // Handle optional phone number (send DBNull if empty)
                    cmd.Parameters.AddWithValue("@Phone", string.IsNullOrEmpty(model.Phone) ? DBNull.Value : model.Phone);

                    // 8. Execute the Command
                    cmd.ExecuteNonQuery();

                    // 9. Close the connection
                    dbCon.Close();

                    return Json(new { success = true, message = "Account created successfully!" });
                }
                else
                {
                    return Json(new { success = false, message = "Could not connect to the database." });
                }
            }
            catch (Exception ex)
            {
                // This will send the error detail back to the browser console for debugging
                return Json(new { success = false, message = "Server Error: " + ex.Message });
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}