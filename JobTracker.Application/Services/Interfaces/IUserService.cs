using JobTracker.Application.DTOs;
using JobTracker.Domain.Models;
using JobTracker.Domain.Models.Enums;

namespace JobTracker.Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> RegisterAsync(UserRegisterDTO dto);
        Task<string?> LoginAsync(UserLoginDTO dto);
        //Task<User?> LoginWithProviderAsync(string providerId, AuthProvider authProvider);
        //Task<User?> GetByEmailAsync(string email);
        //Task<User?> GetByProviderIdAsync(string providerId, AuthProvider authProvider);
    }
}
