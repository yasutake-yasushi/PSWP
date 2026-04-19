using System.Net;
using System.Net.Http.Json;
using PSWPService.Models;
using PSWPService.Tests.TestInfrastructure;

namespace PSWPService.Tests.Integration;

public class MailSettingsApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public MailSettingsApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_ReturnsItems()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        await TestDataHelper.SeedMailSettingAsync(_factory, "T-A");
        await TestDataHelper.SeedMailSettingAsync(_factory, "T-B");

        var response = await _client.GetAsync("/api/mailsettings");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var response = await _client.GetAsync("/api/mailsettings/99999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var input = new MailSetting
        {
            EventType = "StockList",
            TemplateId = "T-NEW",
            Description = "new",
            Addresses = "[]",
            Message = "hello",
        };

        var response = await _client.PostAsJsonAsync("/api/mailsettings", input);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Update_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedMailSettingAsync(_factory, "T-OLD");
        var input = new MailSetting
        {
            EventType = "PreConfirmation",
            TemplateId = "T-NEW",
            Description = "updated",
            Addresses = "[]",
            Message = "updated",
        };

        var response = await _client.PutAsJsonAsync($"/api/mailsettings/{seeded.Id}", input);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var input = new MailSetting { EventType = "X", TemplateId = "Y", Description = "", Addresses = "[]", Message = "" };

        var response = await _client.PutAsJsonAsync("/api/mailsettings/99999", input);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_Works_And_MissingReturnsNotFound()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedMailSettingAsync(_factory);

        var deleteResponse = await _client.DeleteAsync($"/api/mailsettings/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var missingResponse = await _client.DeleteAsync($"/api/mailsettings/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NotFound, missingResponse.StatusCode);
    }
}
