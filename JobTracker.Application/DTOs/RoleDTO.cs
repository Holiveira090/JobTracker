using System.ComponentModel.DataAnnotations;

namespace JobTracker.Application.DTOs
{
    public class RoleDTO
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Please provide the Role Name.")]
        public string? Name { get; set; }

        public ICollection<int>? UserId { get; set; }
    }
}
