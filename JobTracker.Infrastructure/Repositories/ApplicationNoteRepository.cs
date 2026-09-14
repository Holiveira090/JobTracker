using JobTracker.Domain.Models;
using JobTracker.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Infrastructure.Repositories
{
    public class ApplicationNoteRepository : Repository<ApplicationNote>, IApplicationNoteRepository
    {
        public ApplicationNoteRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ApplicationNote>> GetNotesByJobApplicationIdAsync(int jobApplicationId)
        {
            return await _dbSet
                .Where(note => note.JobApplicationId == jobApplicationId)
                .ToListAsync();
        }
    }
}
