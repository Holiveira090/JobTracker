using JobTracker.Application.DTOs;
using JobTracker.Application.Interfaces;
using JobTracker.Domain.Models.Enums;

namespace JobTracker.Application.Services.Interfaces
{
    public interface IJobApplicationService : IService<JobApplicationDTO>
    {
        Task<IEnumerable<JobApplicationDTO>> GetByStatusAsync(ApplicationStatus status);
    }
}
