using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Infrastructure.Repositories
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<Company>> GetByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }
    }
}
