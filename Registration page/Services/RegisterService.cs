using MySql.Data.MySqlClient;
using Registration_page.Data;
using Registration_page.Models;
using System.Data;

namespace Registration_page.Services
{
    public class RegisterService : IRegisterService
    {
        // 1. REGISTER USER (Existing Logic)
        public bool RegisterUser(UserRegistrationModel model, out string errorMessage)
        {
            errorMessage = "";
            try
            {
                var dbCon = DBConnection.Instance();
                dbCon.Server = "localhost";
                dbCon.DatabaseName = "troywingsdb";
                dbCon.UserName = "root";
                dbCon.Password = "Pain@10z";

                if (dbCon.IsConnect())
                {
                    var cmd = new MySqlCommand("sp_RegisterUser", dbCon.Connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@p_FullName", model.FullName);
                    cmd.Parameters.AddWithValue("@p_FatherName", model.FatherName);
                    cmd.Parameters.AddWithValue("@p_DateOfBirth", model.DateOfBirth);
                    cmd.Parameters.AddWithValue("@p_Email", model.Email);
                    cmd.Parameters.AddWithValue("@p_Address", model.Address);
                    cmd.Parameters.AddWithValue("@p_Phone", model.Phone ?? (object)DBNull.Value);

                    cmd.ExecuteNonQuery();
                    dbCon.Close();
                    return true;
                }
                else
                {
                    errorMessage = "Database connection failed.";
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        // 2. GET ALL USERS (New Logic for the Table)
        public List<UserRegistrationModel> GetAllUsers()
        {
            List<UserRegistrationModel> userList = new List<UserRegistrationModel>();

            try
            {
                var dbCon = DBConnection.Instance();

                // Ensure credentials are set (Same as above)
                dbCon.Server = "localhost";
                dbCon.DatabaseName = "troywingsdb";
                dbCon.UserName = "root";
                dbCon.Password = "Pain@10z";

                if (dbCon.IsConnect())
                {
                    var cmd = new MySqlCommand("sp_GetAllUsers", dbCon.Connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Read the data line by line
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            userList.Add(new UserRegistrationModel
                            {
                                // We map the Database Columns to our C# Model
                                // Ensure "Id" matches your DB column name (Id or UserID)
                                Id = Convert.ToInt32(reader["Id"]),
                                FullName = reader["FullName"].ToString(),
                                FatherName = reader["FatherName"].ToString(),
                                DateOfBirth = Convert.ToDateTime(reader["DateOfBirth"]),
                                Email = reader["Email"].ToString(),
                                Address = reader["Address"].ToString(),
                                Phone = reader["PhoneNumber"].ToString() // Notice DB column is PhoneNumber
                            });
                        }
                    }
                    dbCon.Close();
                }
            }
            catch (Exception ex)
            {
                // In a real app, log this error
                Console.WriteLine("Error fetching users: " + ex.Message);
            }

            return userList;
        }

        public bool UpdateUser(UserRegistrationModel model, out string errorMessage)
        {
            errorMessage = "";
            try
            {
                var dbCon = DBConnection.Instance();
                // Credentials are already set in GetAllUsers/RegisterUser, or set them here again if needed.
                // Best practice: Ensure credentials are set before connecting.
                dbCon.Server = "localhost"; dbCon.DatabaseName = "troywingsdb"; dbCon.UserName = "root"; dbCon.Password = "Pain@10z";

                if (dbCon.IsConnect())
                {
                    var cmd = new MySqlCommand("sp_UpdateUser", dbCon.Connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Add Parameters
                    cmd.Parameters.AddWithValue("@p_Id", model.Id);
                    cmd.Parameters.AddWithValue("@p_FullName", model.FullName);
                    cmd.Parameters.AddWithValue("@p_Email", model.Email);
                    cmd.Parameters.AddWithValue("@p_Phone", model.Phone ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@p_FatherName", model.FatherName);
                    cmd.Parameters.AddWithValue("@p_Address", model.Address);

                    cmd.ExecuteNonQuery();
                    dbCon.Close();
                    return true;
                }
                else
                {
                    errorMessage = "Database connection failed.";
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }
    }
}