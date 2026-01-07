using System;
using System.ComponentModel.DataAnnotations;

namespace Registration_page.Models // Check your actual namespace
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
    }
}