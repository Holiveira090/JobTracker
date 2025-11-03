using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;

namespace JobTracker.Application.Services
{
    public class CompanyService : Service<Company, CompanyDTO>, ICompanyService
    {
        public CompanyService(ICompanyRepository repository, IMapper mapper) : base(repository, mapper)
        {
        }
    }
}
