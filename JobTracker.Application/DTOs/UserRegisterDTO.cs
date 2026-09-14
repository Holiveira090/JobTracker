using System.ComponentModel.DataAnnotations;

namespace JobTracker.Application.DTOs
{
    public class UserRegisterDTO
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; } = null!;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string? Password { get; set; } = null!;
    }
}
