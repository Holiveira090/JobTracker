using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;
using JobTracker.Domain.Models.Enums;

namespace JobTracker.Application.Services
{
    public class JobApplicationService : Service<JobApplication, JobApplicationDTO>, IJobApplicationService
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        public JobApplicationService(IJobApplicationRepository jobApplicationRepository, IMapper mapper) : base(jobApplicationRepository, mapper)
        {
            _jobApplicationRepository = jobApplicationRepository;
        } 
        public async Task<IEnumerable<JobApplicationDTO>> GetByStatusAsync(ApplicationStatus status)
        {
            var entities = await _jobApplicationRepository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<JobApplicationDTO>>(entities);
        }
    }
}
