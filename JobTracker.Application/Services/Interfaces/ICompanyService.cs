using JobTracker.Application.DTOs;
using JobTracker.Application.Interfaces;

namespace JobTracker.Application.Services.Interfaces
{
    public interface ICompanyService : IService<CompanyDTO>
    {
        Task<IEnumerable<CompanyDTO>> GetByUserIdAsync(int userId);
    }
}
