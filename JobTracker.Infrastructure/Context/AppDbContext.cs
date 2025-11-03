using JobTracker.Domain.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<ApplicationNote> ApplicationNotes => Set<ApplicationNote>();
    public DbSet<Contact> Contacts => Set<Contact>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(u => u.Id);
            entity.Property(u => u.Id).ValueGeneratedOnAdd();

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.HasIndex(u => u.Email).IsUnique();

            entity.Property(u => u.PasswordHash).HasMaxLength(300);

            entity.Property(u => u.AuthProvider)
                  .IsRequired()
                  .HasConversion<string>();

            entity.Property(u => u.ProviderId).HasMaxLength(255);

            entity.Property(u => u.CreatedAt)
             .HasColumnType("timestamp")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("roles");

            entity.HasKey(r => r.Id);
            entity.Property(r => r.Id).ValueGeneratedOnAdd();

            entity.Property(r => r.Name)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.HasIndex(r => r.Name).IsUnique();

            entity.HasMany(r => r.Users)
                  .WithMany(u => u.Roles)
                  .UsingEntity<Dictionary<string, object>>(
                      "user_roles",
                      j => j.HasOne<User>().WithMany().HasForeignKey("user_id").OnDelete(DeleteBehavior.Cascade),
                      j => j.HasOne<Role>().WithMany().HasForeignKey("role_id").OnDelete(DeleteBehavior.Cascade),
                      j => j.HasKey("user_id", "role_id")
                  );
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("companies");

            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).ValueGeneratedOnAdd();

            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.CompanyValues).HasColumnType("text");
            entity.Property(c => c.SalaryInfoGlassdoor).HasColumnType("decimal(10,2)");

            entity.HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.ToTable("job_applications");

            entity.HasKey(j => j.Id);
            entity.Property(j => j.Id).ValueGeneratedOnAdd();

            entity.Property(j => j.JobTitle).HasMaxLength(50);
            entity.Property(j => j.JobDescription).HasColumnType("text");
            entity.Property(j => j.ApplicationLink).HasMaxLength(500);
            entity.Property(j => j.Status).IsRequired().HasConversion<string>();
            entity.Property(j => j.CvVersion).HasColumnType("text");
            entity.Property(j => j.AppliedAt).HasColumnType("timestamp").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(j => j.User)
                  .WithMany()
                  .HasForeignKey(j => j.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(j => j.Company)
                  .WithMany()
                  .HasForeignKey(j => j.CompanyId)
                  .OnDelete(DeleteBehavior.SetNull);
        });


        modelBuilder.Entity<ApplicationNote>(entity =>
        {
            entity.ToTable("application_notes");

            entity.HasKey(a => a.Id);
            entity.Property(a => a.Id).ValueGeneratedOnAdd();

            entity.Property(a => a.Type)
                  .IsRequired()
                  .HasConversion<string>();

            entity.Property(a => a.Content).HasColumnType("text");

            entity.HasOne(a => a.JobApplication)
                  .WithMany()
                  .HasForeignKey(a => a.JobApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.ToTable("contacts");

            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).ValueGeneratedOnAdd();

            entity.Property(c => c.Name)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(c => c.LinkedinUrl)
                  .HasMaxLength(300);

            entity.Property(c => c.Notes)
                  .HasColumnType("text");

            entity.HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Company)
                  .WithMany()
                  .HasForeignKey(c => c.CompanyId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

    }

}
