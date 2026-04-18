using Microsoft.EntityFrameworkCore;
using PSWPService.Models;

namespace PSWPService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<ContractItem> ContractItems => Set<ContractItem>();
    public DbSet<Mca> Mcas => Set<Mca>();
    public DbSet<McaPattern> McaPatterns => Set<McaPattern>();
    public DbSet<MailSetting> MailSettings => Set<MailSetting>();
    public DbSet<Strategy> Strategies => Set<Strategy>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // シードデータ
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "管理者", Email = "admin@example.com", Role = "admin", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
