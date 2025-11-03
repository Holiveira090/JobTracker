using System.ComponentModel.DataAnnotations;

namespace JobTracker.Application.DTOs
{
    public class CompanyDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Please provide the User Id.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Please provide the Company Name.")]
        [MaxLength(100, ErrorMessage = "The company name cannot exceed 100 characters.")]
        public string? Name { get; set; }

        [MaxLength(500, ErrorMessage = "The company values text cannot exceed 500 characters.")]
        public string? CompanyValues { get; set; }

        [Range(0, 99999, ErrorMessage = "The salary must be between 0 and 99999.")]
        public decimal? SalaryInfoGlassdoor { get; set; }

    }
}