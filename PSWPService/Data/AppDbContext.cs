using Microsoft.EntityFrameworkCore;
using PSWPService.Models;

namespace PSWPService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ContractItem> ContractItems => Set<ContractItem>();
    public DbSet<MCA> MCAs => Set<MCA>();
    public DbSet<MCAPattern> MCAPatterns => Set<MCAPattern>();
    public DbSet<MailSetting> MailSettings => Set<MailSetting>();
    public DbSet<Strategy> Strategies => Set<Strategy>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();
}
