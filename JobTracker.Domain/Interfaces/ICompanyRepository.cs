using JobTracker.Domain.Models;

namespace JobTracker.Domain.Interfaces
{
    public interface ICompanyRepository : IRepository<Company>
    {
        Task<IEnumerable<Company>> GetByUserIdAsync(int userId);
    }
}
