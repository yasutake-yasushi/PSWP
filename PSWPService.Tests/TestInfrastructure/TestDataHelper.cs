using Microsoft.Extensions.DependencyInjection;
using PSWPService.Data;
using PSWPService.Models;

namespace PSWPService.Tests.TestInfrastructure;

public static class TestDataHelper
{
    public static async Task ResetAllAsync(CustomWebApplicationFactory factory)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        db.MCAPatterns.RemoveRange(db.MCAPatterns);
        db.MCAs.RemoveRange(db.MCAs);
        db.ContractItems.RemoveRange(db.ContractItems);
        db.MailSettings.RemoveRange(db.MailSettings);
        db.Strategies.RemoveRange(db.Strategies);
        db.SystemSettings.RemoveRange(db.SystemSettings);
        await db.SaveChangesAsync();
    }

    public static async Task<ContractItem> SeedContractItemAsync(CustomWebApplicationFactory factory, string itemName = "PaymentTerm")
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var entity = new ContractItem
        {
            Category = "Contract",
            ItemName = itemName,
            DataType = "String",
            Values = "Net30",
            DefaultValue = "Net30",
            Description = "Seed",
            UpdateUser = "seed",
            UpdateTime = DateTime.UtcNow,
        };

        db.ContractItems.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public static async Task<MCA> SeedMcaAsync(CustomWebApplicationFactory factory, string mcaId = "MCA001")
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var entity = new MCA
        {
            McaId = mcaId,
            Cpty = "BANKA",
            AgreementDate = new DateOnly(2026, 1, 10),
            ExecutionDate = new DateOnly(2026, 1, 20),
            ContractItems = "[\"PaymentTerm\"]",
            UpdateUser = "seed",
            UpdateTime = DateTime.UtcNow,
        };

        db.MCAs.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public static async Task<MCAPattern> SeedMcaPatternAsync(CustomWebApplicationFactory factory, string patternId = "P001")
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var entity = new MCAPattern
        {
            McaPatternId = patternId,
            McaId = "MCA001",
            ContractItems = "[]",
            TradeItems = "[]",
            SpecialNotes = "seed",
            UpdateUser = "seed",
            UpdateTime = DateTime.UtcNow,
        };

        db.MCAPatterns.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public static async Task<MailSetting> SeedMailSettingAsync(CustomWebApplicationFactory factory, string templateId = "TPL001")
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var entity = new MailSetting
        {
            EventType = "OTCCross",
            TemplateId = templateId,
            Description = "seed",
            Addresses = "[]",
            Message = "hello",
            UpdateUser = "seed",
            UpdateTime = DateTime.UtcNow,
        };

        db.MailSettings.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public static async Task<Strategy> SeedStrategyAsync(CustomWebApplicationFactory factory, string portId = "P001")
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var entity = new Strategy
        {
            StrategyType = "Lending",
            PortId = portId,
            UpdateUser = "seed",
            UpdateTime = DateTime.UtcNow,
        };

        db.Strategies.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public static async Task<SystemSetting> SeedSystemSettingAsync(CustomWebApplicationFactory factory)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var entity = new SystemSetting
        {
            Id = 1,
            MipsFilePath = "C:/seed/mips.csv",
            StrikeFilePath = "C:/seed/strike.csv",
            UpdateUser = "seed",
            UpdateTime = DateTime.UtcNow,
        };

        db.SystemSettings.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }
}
