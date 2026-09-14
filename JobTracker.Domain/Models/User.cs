using JobTracker.Domain.Models;
using JobTracker.Domain.Models.Enums;

public class User
{
    public int Id { get; private set; }
    public string? Email { get; private set; }
    public string? PasswordHash { get; private set; }
    public AuthProvider AuthProvider { get; private set; }
    public string? ProviderId { get; private set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Role>? Roles { get; private set; }
    public User(string email, string passwordHash, AuthProvider authProvider, string? providerId)
    {
        Email = email;
        PasswordHash = passwordHash;
        AuthProvider = authProvider;
        ProviderId = providerId;
        CreatedAt = DateTime.UtcNow;
    }
    public User() { }
}
