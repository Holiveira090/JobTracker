namespace JobTracker.Domain.Models
{
    public class Contact
    {
        public int Id { get; private set; }
        public int UserId { get; private set; }
        public User? User { get; private set; }
        public int? CompanyId { get; private set; }
        public Company? Company { get; private set; }
        public string? Name { get; private set; }
        public string? LinkedinUrl { get; private set; }
        public string? Notes { get; private set; }
    }
}
