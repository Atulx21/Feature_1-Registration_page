using Registration_page.Models;

namespace Registration_page.Services
{
    // This is the "Interface" (The Contract)
    public interface IRegisterService
    {
        // We define the function name here, but no code inside it.
        bool RegisterUser(UserRegistrationModel model, out string errorMessage);
    }
}