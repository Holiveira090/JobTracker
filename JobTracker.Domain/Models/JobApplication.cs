using JobTracker.Domain.Models.Enums;

namespace JobTracker.Domain.Models
{
    public class JobApplication
    {
        public int Id { get; protected set; }
        public int UserId { get; protected set; }
        public User? User { get; protected set; }
        public int? CompanyId { get; protected set; }
        public Company? Company { get; protected set; }
        public string? JobTitle { get; set; }
        public string? JobDescription { get; set; }
        public string? ApplicationLink { get; set; }
        public ApplicationStatus? Status { get; set; }
        public string? CvVersion { get; set; }
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    }
}
