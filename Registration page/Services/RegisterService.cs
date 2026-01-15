using MySql.Data.MySqlClient;
using Registration_page.Data;   // Imports your DBConnection helper
using Registration_page.Models; // Imports your UserRegistrationModel
using System.Data;

namespace Registration_page.Services
{
    // This class implements the Interface we created in Step 2
    public class RegisterService : IRegisterService
    {
        public bool RegisterUser(UserRegistrationModel model, out string errorMessage)
        {
            errorMessage = "";
            try
            {
                // 1. Get the Database Connection Instance
                var dbCon = DBConnection.Instance();

                // 2. Set the Credentials (REQUIRED for connection)
                // These lines provide the "Key" to open the database door
                dbCon.Server = "localhost";
                dbCon.DatabaseName = "troywingsdb";
                dbCon.UserName = "root";
                dbCon.Password = "Pain@10z"; // <--- Ensure this matches your MySQL password

                // 3. Connect and Execute
                if (dbCon.IsConnect())
                {
                    // Prepare the Command to call the Stored Procedure
                    var cmd = new MySqlCommand("sp_RegisterUser", dbCon.Connection);
                    cmd.CommandType = CommandType.StoredProcedure; // <--- Tells C# this is a Procedure, not a query

                    // Pass the parameters to the Procedure
                    // These names (@p_FullName) must match what we wrote in MySQL Workbench
                    cmd.Parameters.AddWithValue("@p_FullName", model.FullName);
                    cmd.Parameters.AddWithValue("@p_FatherName", model.FatherName);
                    cmd.Parameters.AddWithValue("@p_DateOfBirth", model.DateOfBirth);
                    cmd.Parameters.AddWithValue("@p_Email", model.Email);
                    cmd.Parameters.AddWithValue("@p_Address", model.Address);

                    // Handle null phone number (pass DBNull if phone is empty)
                    cmd.Parameters.AddWithValue("@p_Phone", model.Phone ?? (object)DBNull.Value);

                    // Execute the Procedure
                    cmd.ExecuteNonQuery();

                    // Close connection to free up resources
                    dbCon.Close();

                    return true; // Success!
                }
                else
                {
                    errorMessage = "Could not connect to the database. Please check your credentials.";
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = "Error in RegisterService: " + ex.Message;
                return false;
            }
        }
    }
}