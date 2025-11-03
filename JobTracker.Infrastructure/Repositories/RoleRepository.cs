using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;

namespace JobTracker.Infrastructure.Repositories
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext context) : base(context)
        {
        }
    }
}
