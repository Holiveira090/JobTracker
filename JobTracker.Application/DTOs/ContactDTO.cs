using System.ComponentModel.DataAnnotations;

namespace JobTracker.Application.DTOs
{
    public class ContactDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public int UserId { get; set; }

        public int? CompanyId { get; set; }

        [Required(ErrorMessage = "O nome do contato é obrigatório.")]
        [MaxLength(100, ErrorMessage = "O nome do contato não pode exceder 100 caracteres.")]
        public string? Name { get; set; }

        public string? LinkedinUrl { get; set; }

        [Required(ErrorMessage = "As notas do contato são obrigatórias.")]
        [MaxLength(500, ErrorMessage = "As notas não podem exceder 500 caracteres.")]
        public string? Notes { get; set; }
    }
}