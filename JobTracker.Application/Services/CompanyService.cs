using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;
using System.Threading.Tasks;

namespace JobTracker.Application.Services
{
    public class CompanyService : Service<Company, CompanyDTO>, ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyService(ICompanyRepository companyRepository, IMapper mapper) : base(companyRepository, mapper)
        {
            _companyRepository = companyRepository;
        }

        public async Task<IEnumerable<CompanyDTO>> GetByUserIdAsync(int userId)
        {
            var companies = await _companyRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<CompanyDTO>>(companies);
        }

        public new async Task<CompanyDTO> AddAsync(CompanyDTO dto)
        {
            var company = _mapper.Map<Company>(dto);
            var added = await _companyRepository.AddAsync(company);
            return _mapper.Map<CompanyDTO>(added);
        }
    }
}