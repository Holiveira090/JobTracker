using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;

namespace JobTracker.Application.Services
{
    public class ApplicationNoteService : Service<ApplicationNote, ApplicationNoteDTO>, IApplicationNoteService
    {
        private readonly IApplicationNoteRepository _noteRepository;

        public ApplicationNoteService(IApplicationNoteRepository noteRepository, IMapper mapper) : base(noteRepository, mapper)
        {
            _noteRepository = noteRepository;
        }

        public async Task<IEnumerable<ApplicationNoteDTO>> GetByJobApplicationIdAsync(int jobApplicationId)
        {
            var entities = await _noteRepository.GetNotesByJobApplicationIdAsync(jobApplicationId);
            return _mapper.Map<IEnumerable<ApplicationNoteDTO>>(entities);
        }
    }
}
