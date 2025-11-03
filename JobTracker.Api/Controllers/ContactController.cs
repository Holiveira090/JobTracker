using JobTracker.API.Controllers;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Api.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ContactController : BaseController<ContactDTO>
    {
        private readonly IContactService _service;

        public ContactController(IContactService service) : base(service)
        {
            _service = service;
        }

        [HttpGet("Company/{id:int}")]
        public async Task<ActionResult<IEnumerable<ContactDTO>>> GetByCompanyId(int? id)
        {
            var list = await _service.GetByCompanyIdAsync(id);
            return Ok(list);
        }
    }
}
