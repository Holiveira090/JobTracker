using JobTracker.Application.DTOs;
using JobTracker.Application.Interfaces;

namespace JobTracker.Application.Services.Interfaces
{
    public interface IApplicationNoteService : IService<ApplicationNoteDTO>
    {
        Task<IEnumerable<ApplicationNoteDTO>> GetByJobApplicationIdAsync(int jobApplicationId);
    }
}
