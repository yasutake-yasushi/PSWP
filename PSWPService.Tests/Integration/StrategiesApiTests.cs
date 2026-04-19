using System.Net;
using System.Net.Http.Json;
using PSWPService.Models;
using PSWPService.Tests.TestInfrastructure;

namespace PSWPService.Tests.Integration;

public class StrategiesApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public StrategiesApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_ReturnsItems()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        await TestDataHelper.SeedStrategyAsync(_factory, "P1");
        await TestDataHelper.SeedStrategyAsync(_factory, "P2");

        var response = await _client.GetAsync("/api/strategies");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var response = await _client.GetAsync("/api/strategies/99999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var input = new Strategy { StrategyType = "Borrowing", PortId = "P-NEW" };

        var response = await _client.PostAsJsonAsync("/api/strategies", input);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Update_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedStrategyAsync(_factory, "P-OLD");
        var input = new Strategy { StrategyType = "Funding", PortId = "P-NEW" };

        var response = await _client.PutAsJsonAsync($"/api/strategies/{seeded.Id}", input);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var input = new Strategy { StrategyType = "Funding", PortId = "P-NEW" };

        var response = await _client.PutAsJsonAsync("/api/strategies/99999", input);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_Works_And_MissingReturnsNotFound()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedStrategyAsync(_factory);

        var deleteResponse = await _client.DeleteAsync($"/api/strategies/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var missingResponse = await _client.DeleteAsync($"/api/strategies/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NotFound, missingResponse.StatusCode);
    }
}
