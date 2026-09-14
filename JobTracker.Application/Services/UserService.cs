using AutoMapper;
using JobTracker.Application.DTOs;
using JobTracker.Application.Services.Interfaces;
using JobTracker.Domain.Interfaces;
using JobTracker.Domain.Models.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public UserService(IUserRepository userRepository, IMapper mapper, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<User> RegisterAsync(UserRegisterDTO dto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email!);
        if (existingUser != null)
            throw new Exception("Email already in use.");

        var user = new User(
            email: dto.Email!,
            passwordHash: HashPassword(dto.Password!),
            authProvider: AuthProvider.Credentials,
            providerId: null
        );

        var addedUser = await _userRepository.AddAsync(user);
        return addedUser;
    }

    public async Task<string?> LoginAsync(UserLoginDTO dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email!);
        if (user == null) return null;

        if (!VerifyPassword(dto.Password!, user.PasswordHash!))
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!)
            }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    }
}
