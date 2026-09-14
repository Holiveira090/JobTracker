using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Models;
using JobTracker.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ApplicationNoteController : ControllerBase
    {
        private readonly IApplicationNoteService _service;
        private readonly AppDbContext _context;

        public ApplicationNoteController(IApplicationNoteService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        private int GetAuthenticatedUserId()
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(sub)) throw new Exception("User id missing in token");
            return int.Parse(sub);
        }

        private bool VerifyJobApplicationOwnership(int jobApplicationId, int userId)
        {
            var application = _context.Set<JobApplication>().Find(jobApplicationId);
            return application != null && application.UserId == userId;
        }

        [HttpGet("applications/{id:int}/notes")]
        public async Task<ActionResult<IEnumerable<ApplicationNoteDTO>>> GetByJobApplicationId(int id)
        {
            var userId = GetAuthenticatedUserId();
            if (!VerifyJobApplicationOwnership(id, userId)) return Forbid();
            
            var list = await _service.GetByJobApplicationIdAsync(id);
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var note = await _service.GetByIdAsync(id);
            if (note == null) return NotFound();
            return Ok(note);
        }

        [HttpPost]
        public async Task<ActionResult<ApplicationNoteDTO>> Create([FromBody] ApplicationNoteDTO dto)
        {
            var added = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = added.Id }, added);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApplicationNoteDTO>> Update(int id, [FromBody] ApplicationNoteDTO dto)
        {
            dto.Id = id;
            var updated = await _service.UpdateAsync(dto);
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}