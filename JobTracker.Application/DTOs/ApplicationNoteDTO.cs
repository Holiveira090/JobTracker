using JobTracker.Domain.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace JobTracker.Application.DTOs
{
    public class ApplicationNoteDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Please provide the Job Application Id.")]
        public int JobApplicationId { get; set; }

        [Required(ErrorMessage = "Please provide the Note Type.")]
        public NoteType Type { get; set; }

        [Required(ErrorMessage = "Please provide the Note Content.")]
        [MaxLength(2000, ErrorMessage = "The note content cannot exceed 2000 characters.")]
        public string Content { get; set; } = string.Empty;
    }
}
