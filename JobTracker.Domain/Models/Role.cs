namespace JobTracker.Domain.Models
{
    public class Role
    {
        public int Id { get; private set; }
        public string? Name { get; private set; }
        public ICollection<User>? Users { get; private set; }
    }
}
