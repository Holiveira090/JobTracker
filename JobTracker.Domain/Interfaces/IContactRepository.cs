using JobTracker.Domain.Models;

namespace JobTracker.Domain.Interfaces
{
    public interface IContactRepository : IRepository<Contact>
    {
        Task<IEnumerable<Contact>> GetByCompanyIdAsync(int? companyId = null);
    }
}
