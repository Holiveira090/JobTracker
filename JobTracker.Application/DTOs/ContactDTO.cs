using System.ComponentModel.DataAnnotations;

namespace JobTracker.Application.DTOs
{
    public class ContactDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Please provide the User Id.")]
        public int UserId { get; set; }

        public int? CompanyId { get; set; }

        [Required(ErrorMessage = "Please provide the Contact Name.")]
        [MaxLength(100, ErrorMessage = "The contact name cannot exceed 100 characters.")]
        public string? Name { get; set; }

        public string? LinkedinUrl { get; set; }

        [Required(ErrorMessage = "Please provide the Contact Notes.")]
        [MaxLength(500, ErrorMessage = "The notes cannot exceed 500 characters.")]
        public string? Notes { get; set; }
    }
}