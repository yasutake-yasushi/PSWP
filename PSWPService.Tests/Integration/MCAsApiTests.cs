using System.Net;
using System.Net.Http.Json;
using PSWPService.Models;
using PSWPService.Tests.TestInfrastructure;

namespace PSWPService.Tests.Integration;

public class MCAsApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public MCAsApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_ReturnsItems()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        await TestDataHelper.SeedMcaAsync(_factory, "MCA-A");
        await TestDataHelper.SeedMcaAsync(_factory, "MCA-B");

        var response = await _client.GetAsync("/api/mcas");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var items = await response.Content.ReadFromJsonAsync<List<MCA>>();
        Assert.NotNull(items);
        Assert.True(items!.Count >= 2);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var response = await _client.GetAsync("/api/mcas/99999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var input = new MCA
        {
            McaId = "MCA-NEW",
            Cpty = "BANKB",
            AgreementDate = new DateOnly(2026, 2, 1),
            ExecutionDate = new DateOnly(2026, 2, 10),
            ContractItems = "[\"PaymentTerm\"]",
        };

        var response = await _client.PostAsJsonAsync("/api/mcas", input);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Update_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedMcaAsync(_factory, "MCA-OLD");

        var input = new MCA
        {
            McaId = "MCA-NEW",
            Cpty = "BANKC",
            AgreementDate = new DateOnly(2026, 3, 1),
            ExecutionDate = new DateOnly(2026, 3, 15),
            ContractItems = "[\"Notional\"]",
        };

        var response = await _client.PutAsJsonAsync($"/api/mcas/{seeded.Id}", input);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var updated = await response.Content.ReadFromJsonAsync<MCA>();
        Assert.NotNull(updated);
        Assert.Equal("MCA-NEW", updated!.McaId);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var input = new MCA { McaId = "X", Cpty = "Y", ContractItems = "[]" };

        var response = await _client.PutAsJsonAsync("/api/mcas/99999", input);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_Works_And_MissingReturnsNotFound()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedMcaAsync(_factory);

        var deleteResponse = await _client.DeleteAsync($"/api/mcas/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var missingResponse = await _client.DeleteAsync($"/api/mcas/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NotFound, missingResponse.StatusCode);
    }
}
