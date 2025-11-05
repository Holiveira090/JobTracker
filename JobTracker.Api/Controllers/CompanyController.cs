using JobTracker.API.Controllers;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _service;

        public CompanyController(ICompanyService service)
        {
            _service = service;
        }
        private int GetAuthenticatedUserId()
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(sub)) throw new Exception("User id missing in token");
            return int.Parse(sub);
        }

        [HttpGet("ByUser")]
        public async Task<IActionResult> GetCompanyByUser()
        {
            var userId = GetAuthenticatedUserId();
            var list = await _service.GetByUserIdAsync(userId);
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetAuthenticatedUserId();
            var company = await _service.GetByIdAsync(id);
            if (company == null) return NotFound();
            if (company.UserId != userId) return Forbid();
            return Ok(company);
        }

        [HttpPost]
        public async Task<ActionResult<CompanyDTO>> Create([FromBody] CompanyDTO dto)
        {
            var userId = GetAuthenticatedUserId();
            dto.UserId = userId;

            var added = await _service.AddAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = added.Id }, added);
        }


        [HttpPut("{id:int}")]
        public async Task<ActionResult<CompanyDTO>> Update(int id, [FromBody] CompanyDTO dto)
        {
            var userId = GetAuthenticatedUserId();

            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();
            if (existing.UserId != userId) return Forbid();

            dto.Id = id;
            dto.UserId = userId;

            var updated = await _service.UpdateAsync(dto);
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetAuthenticatedUserId();
            var company = await _service.GetByIdAsync(id);
            if (company == null) return NotFound();
            if (company.UserId != userId) return Forbid();

            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
