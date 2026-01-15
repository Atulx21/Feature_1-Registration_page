using Registration_page.Models;

namespace Registration_page.Services
{
    public interface IRegisterService
    {
        // 1. Existing Registration function
        bool RegisterUser(UserRegistrationModel model, out string errorMessage);

        // 2. NEW: Function to get the list of all users
        List<UserRegistrationModel> GetAllUsers();

        // Add this inside IRegisterService interface
        bool UpdateUser(UserRegistrationModel model, out string errorMessage);
    }
}