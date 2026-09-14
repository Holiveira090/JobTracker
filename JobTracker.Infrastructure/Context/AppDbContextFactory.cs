using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace JobTracker.Infrastructure.Context
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // Connection string diretamente aqui
            var connectionString = "Server=localhost;DataBase=JobTracker;Uid=root;Pwd=master";

            optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 29)));

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
