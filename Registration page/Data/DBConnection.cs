using MySql.Data.MySqlClient;
using System;

namespace Registration_page.Data
{
    public class DBConnection
    {
        private DBConnection() { }

        // Properties for connection details
        public string Server { get; set; }
        public string DatabaseName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        public MySqlConnection Connection { get; set; }

        private static DBConnection _instance = null;

        // The Singleton Instance method
        public static DBConnection Instance()
        {
            if (_instance == null)
                _instance = new DBConnection();
            return _instance;
        }

        // Checks connection and opens it if needed
        public bool IsConnect()
        {
            if (Connection == null)
            {
                if (String.IsNullOrEmpty(DatabaseName))
                    return false;

                // Create connection string
                string connstring = string.Format("Server={0}; database={1}; UID={2}; password={3}", Server, DatabaseName, UserName, Password);
                Connection = new MySqlConnection(connstring);
                Connection.Open();
            }
            else if (Connection.State == System.Data.ConnectionState.Closed)
            {
                Connection.Open();
            }

            return true;
        }

        // Closes the connection
        public void Close()
        {
            if (Connection != null)
            {
                Connection.Close();
                Connection = null;
            }
        }
    }
}