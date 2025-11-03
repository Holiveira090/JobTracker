using JobTracker.API.Controllers;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationNoteController : BaseController<ApplicationNoteDTO>
    {
        private readonly IApplicationNoteService _service;
        public ApplicationNoteController(IApplicationNoteService service) : base(service)
        {
            _service = service;
        }
        [HttpGet("applications/{id:int}/notes")]
        public async Task<ActionResult<IEnumerable<ApplicationNoteDTO>>> GetByJobApplicationId(int id)
        {
            var list = await _service.GetByJobApplicationIdAsync(id);
            return Ok(list);
        }

    }
}
