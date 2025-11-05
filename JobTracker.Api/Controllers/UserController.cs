using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDTO>> Register([FromBody] UserRegisterDTO dto)
        {
            var user = await _userService.RegisterAsync(dto);

            if (user == null)
                return BadRequest("Não foi possível registrar o usuário.");

            var response = new UserResponseDTO
            {
                Id = user.Id,
                Email = user.Email
            };

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] UserLoginDTO dto)
        {
            var token = await _userService.LoginAsync(dto);

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Email ou senha inválidos.");

            return Ok(new { Token = token });
        }
    }
}
