using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models;

namespace JobTracker.Application.Services
{
    public class RoleService : Service<Role, RoleDTO>, IRoleService
    {
        public RoleService(IRoleRepository repository, IMapper mapper) : base(repository, mapper)
        {
        }
    }
}
