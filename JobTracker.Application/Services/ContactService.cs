using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;

namespace JobTracker.Application.Services
{
    public class ContactService : Service<Contact, ContactDTO>, IContactService
    {
        public readonly IContactRepository _contactRepository;
        public ContactService(IContactRepository contactRepository, IMapper mapper) : base(contactRepository, mapper)
        {
            _contactRepository = contactRepository;
        }

        public async Task<IEnumerable<ContactDTO>> GetByCompanyIdAsync(int? companyId)
        {
            var entities = await _contactRepository.GetByCompanyIdAsync(companyId);
            return _mapper.Map<IEnumerable<ContactDTO>>(entities);
        }
    }
}