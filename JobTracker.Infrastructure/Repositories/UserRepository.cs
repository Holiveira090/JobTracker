using JobTracker.Domain.Models;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByProviderIdAsync(string providerId, AuthProvider authProvider)
        {
            return await _dbSet
                .FirstOrDefaultAsync(u => u.ProviderId == providerId && u.AuthProvider == authProvider);
        }
    }
}
