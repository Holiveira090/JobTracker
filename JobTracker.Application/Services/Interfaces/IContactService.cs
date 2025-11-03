using JobTracker.Application.DTOs;
using JobTracker.Application.Interfaces;

namespace JobTracker.Application.Services.Interfaces
{
    public interface IContactService : IService<ContactDTO>
    {
        Task<IEnumerable<ContactDTO>> GetByCompanyIdAsync(int? companyId);
    }
}
