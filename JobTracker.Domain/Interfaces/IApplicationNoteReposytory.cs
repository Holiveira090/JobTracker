using JobTracker.Domain.Models;

namespace JobTracker.Domain.Interfaces
{
    public interface IApplicationNoteRepository : IRepository<ApplicationNote>
    {
        Task<IEnumerable<ApplicationNote>> GetNotesByJobApplicationIdAsync(int jobApplicationId);
    }
}