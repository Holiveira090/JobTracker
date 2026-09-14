using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace JobTracker.Application.DTOs
{
    public class CompanyDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "O nome da empresa é obrigatório.")]
        [MaxLength(100, ErrorMessage = "O nome da empresa não pode exceder 100 caracteres.")]
        public string? Name { get; set; }

        [MaxLength(500, ErrorMessage = "O texto de valores da empresa não pode exceder 500 caracteres.")]
        public string? CompanyValues { get; set; }

        [AllowNull]
        [Range(0, 99999, ErrorMessage = "O salário deve estar entre 0 e 99999.")]
        public decimal? SalaryInfoGlassdoor { get; set; }

    }
}