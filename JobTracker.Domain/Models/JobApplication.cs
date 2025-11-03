using JobTracker.Domain.Models.Enums;

namespace JobTracker.Domain.Models
{
    public class JobApplication
    {
        public int Id { get; private set; }
        public int UserId { get; private set; }
        public User? User { get; private set; }
        public int? CompanyId { get; private set; }
        public Company? Company { get; private set; }
        public string? JobTitle { get; private set; }
        public string? JobDescription { get; private set; }
        public string? ApplicationLink { get; private set; }
        public ApplicationStatus? Status { get; private set; }
        public string? CvVersion { get; private set; }
        public DateTime AppliedAt { get; private set; } = DateTime.UtcNow;
    }
}
