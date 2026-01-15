using System;

namespace Registration_page.Models
{
    public class UserRegistrationModel
    {
        // Added ID so we can identify which user to edit later
        public int Id { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

        // Matches the "PhoneNumber" column from DB
        public string Phone { get; set; }
    }
}