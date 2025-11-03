using JobTracker.Domain.Models;
using JobTracker.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Infrastructure.Repositories
{
    public class ContactRepository : Repository<Contact>, IContactRepository
    {
        public ContactRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Contact>> GetByCompanyIdAsync(int? companyId = null)
        {
            if (companyId is null)
            {
                return await GetAllAsync();
            }
            return await _dbSet
                .Where(contact => contact.CompanyId == companyId)
                .ToListAsync();
        }
    }
}