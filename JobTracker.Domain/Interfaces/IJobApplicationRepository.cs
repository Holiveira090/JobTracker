using JobTracker.Domain.Models;
using JobTracker.Domain.Models.Enums;

namespace JobTracker.Domain.Interfaces
{
    public interface IJobApplicationRepository : IRepository<JobApplication>
    {
        Task<IEnumerable<JobApplication>> GetByStatusAsync(ApplicationStatus status);
    }
}