using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using PSWPService.Data;
using PSWPService.Models;
using PSWPService.Tests.TestInfrastructure;

namespace PSWPService.Tests.Integration;

public class ContractItemsApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public ContractItemsApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_ReturnsItems()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        await TestDataHelper.SeedContractItemAsync(_factory, "A");
        await TestDataHelper.SeedContractItemAsync(_factory, "B");

        var response = await _client.GetAsync("/api/contractitems");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var items = await response.Content.ReadFromJsonAsync<List<ContractItem>>();
        Assert.NotNull(items);
        Assert.True(items!.Count >= 2);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var response = await _client.GetAsync("/api/contractitems/99999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var createInput = new ContractItem
        {
            Category = "Contract",
            ItemName = "PaymentTerm",
            DataType = "String",
            Values = "Net30",
            DefaultValue = "Net30",
            Description = "Test item",
        };

        var createResponse = await _client.PostAsJsonAsync("/api/contractitems", createInput);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var created = await createResponse.Content.ReadFromJsonAsync<ContractItem>();
        Assert.NotNull(created);
        Assert.True(created!.Id > 0);
        Assert.False(string.IsNullOrWhiteSpace(created.UpdateUser));

    }

    [Fact]
    public async Task Update_Works()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedContractItemAsync(_factory, "OldName");

        var updateInput = new ContractItem
        {
            Category = "Contract",
            ItemName = "NewName",
            DataType = "String",
            Values = "Net45",
            DefaultValue = "Net45",
            Description = "Updated",
        };

        var response = await _client.PutAsJsonAsync($"/api/contractitems/{seeded.Id}", updateInput);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<ContractItem>();
        Assert.NotNull(updated);
        Assert.Equal("NewName", updated!.ItemName);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var updateInput = new ContractItem
        {
            Category = "Contract",
            ItemName = "Nope",
            DataType = "String",
        };

        var response = await _client.PutAsJsonAsync("/api/contractitems/99999", updateInput);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_Works_And_ReturnsNotFoundAfter()
    {
        await TestDataHelper.ResetAllAsync(_factory);
        var seeded = await TestDataHelper.SeedContractItemAsync(_factory);

        var deleteResponse = await _client.DeleteAsync($"/api/contractitems/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var getResponse = await _client.GetAsync($"/api/contractitems/{seeded.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenMissing()
    {
        await TestDataHelper.ResetAllAsync(_factory);

        var response = await _client.DeleteAsync("/api/contractitems/99999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
