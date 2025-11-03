using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;

namespace JobTracker.Infrastructure.Repositories
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context)
        {
        }
    }
}
