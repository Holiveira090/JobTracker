namespace JobTracker.Domain.Models
{
    public class Company
    {
        public int Id { get; private set; }
        public int UserId { get; private set; }
        public User? User { get; private set; }
        public string? Name { get; private set; }
        public string? CompanyValues { get; private set; }
        public decimal? SalaryInfoGlassdoor { get; private set; }
    }
}
