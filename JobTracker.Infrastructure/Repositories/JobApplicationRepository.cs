using JobTracker.Domain.Models;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Infrastructure.Repositories
{
    public class JobApplicationRepository : Repository<JobApplication>, IJobApplicationRepository
    {
        public JobApplicationRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<JobApplication>> GetByStatusAsync(ApplicationStatus status)
        {
            return await _dbSet
                .Where(application => application.Status == status)
                .ToListAsync();
        }
    }
}
