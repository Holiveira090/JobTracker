using JobTracker.API.Controllers;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class RoleController : BaseController<RoleDTO>
    {
        private readonly IRoleService _service;

        public RoleController(IRoleService service) : base(service)
        {
            _service = service;
        }
    }
}