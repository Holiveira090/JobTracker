using JobTracker.Domain.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace JobTracker.Application.DTOs
{
    public class JobApplicationDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Please provide the User Id.")]
        public int UserId { get; set; }

        public int? CompanyId { get; set; }

        [Required(ErrorMessage = "Please provide the Job Title.")]
        [MaxLength(100, ErrorMessage = "The job title cannot exceed 100 characters.")]
        public string? JobTitle { get; set; }

        [Required(ErrorMessage = "Please provide the Job Description.")]
        [MaxLength(2000, ErrorMessage = "The job description cannot exceed 2000 characters.")]
        public string? JobDescription { get; set; }

        [Required(ErrorMessage = "Please provide the Application Link.")]
        public string? ApplicationLink { get; set; }

        [Required(ErrorMessage = "Please provide the Application Status.")]
        public ApplicationStatus? Status { get; set; }

        [Required(ErrorMessage = "Please provide the CV Version used.")]
        public string? CvVersion { get; set; }

        public DateTime AppliedAt { get; private set; } = DateTime.UtcNow;
    }
}