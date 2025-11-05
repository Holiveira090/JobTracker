using JobTracker.API.Controllers;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class JobApplicationController : BaseController<JobApplicationDTO>
    {
        private readonly IJobApplicationService _service;
        public JobApplicationController(IJobApplicationService service) : base(service)
        {
            _service = service;
        }

        [HttpGet("StatusFilter/{id:int}")]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetByStatus(ApplicationStatus status)
        {
            var list = await _service.GetByStatusAsync(status);
            return Ok(list);
        }
    }
}
