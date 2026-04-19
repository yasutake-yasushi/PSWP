using System.Net;
using System.Net.Http.Json;
using PSWPService.Models;
using PSWPService.Tests.TestInfrastructure;

namespace PSWPService.Tests.Integration;

public class SystemSettingApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public SystemSettingApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Get_CreatesDefault_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var response = await _client.GetAsync("/api/systemsetting");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var item = await response.Content.ReadFromJsonAsync<SystemSetting>();
        Assert.NotNull(item);
        Assert.Equal(1, item!.Id);
    }

    [Fact]
    public async Task Get_ReturnsExisting_WhenSeeded()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        await TestDataHelper.SeedSystemSettingAsync(_factory);

        var response = await _client.GetAsync("/api/systemsetting");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Update_Creates_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var input = new SystemSetting { MipsFilePath = "C:/mips/new.csv", StrikeFilePath = "C:/strike/new.csv" };

        var response = await _client.PutAsJsonAsync("/api/systemsetting", input);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var updated = await response.Content.ReadFromJsonAsync<SystemSetting>();
        Assert.NotNull(updated);
        Assert.Equal("C:/mips/new.csv", updated!.MipsFilePath);
    }

    [Fact]
    public async Task Update_Works_WhenExisting()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        await TestDataHelper.SeedSystemSettingAsync(_factory);
        var input = new SystemSetting { MipsFilePath = "C:/mips/updated.csv", StrikeFilePath = "C:/strike/updated.csv" };

        var response = await _client.PutAsJsonAsync("/api/systemsetting", input);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var updated = await response.Content.ReadFromJsonAsync<SystemSetting>();
        Assert.NotNull(updated);
        Assert.Equal("C:/mips/updated.csv", updated!.MipsFilePath);
    }
}
