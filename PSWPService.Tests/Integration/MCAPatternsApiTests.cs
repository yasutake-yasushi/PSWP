using System.Net;
using System.Net.Http.Json;
using PSWPService.Models;
using PSWPService.Tests.TestInfrastructure;

namespace PSWPService.Tests.Integration;

public class MCAPatternsApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public MCAPatternsApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_ReturnsItems()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        await TestDataHelper.SeedMcaPatternAsync(_factory, "P-A");
        await TestDataHelper.SeedMcaPatternAsync(_factory, "P-B");

        var response = await _client.GetAsync("/api/mcapatterns");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var response = await _client.GetAsync("/api/mcapatterns/99999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var input = new MCAPattern
        {
            McaPatternId = "P-NEW",
            McaId = "MCA001",
            ContractItems = "[]",
            TradeItems = "[]",
            SpecialNotes = "new",
        };

        var response = await _client.PostAsJsonAsync("/api/mcapatterns", input);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Update_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedMcaPatternAsync(_factory, "P-OLD");

        var input = new MCAPattern
        {
            McaPatternId = "P-NEW",
            McaId = "MCA002",
            ContractItems = "[{\"itemName\":\"A\",\"value\":\"1\"}]",
            TradeItems = "[]",
            SpecialNotes = "updated",
        };

        var response = await _client.PutAsJsonAsync($"/api/mcapatterns/{seeded.Id}", input);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var input = new MCAPattern { McaPatternId = "X", McaId = "Y", ContractItems = "[]", TradeItems = "[]" };

        var response = await _client.PutAsJsonAsync("/api/mcapatterns/99999", input);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_Works_And_MissingReturnsNotFound()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedMcaPatternAsync(_factory);

        var deleteResponse = await _client.DeleteAsync($"/api/mcapatterns/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var missingResponse = await _client.DeleteAsync($"/api/mcapatterns/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NotFound, missingResponse.StatusCode);
    }
}
