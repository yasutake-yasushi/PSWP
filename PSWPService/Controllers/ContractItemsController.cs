using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Models;

namespace PSWPService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractItemsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ContractItemsController(AppDbContext db) => _db = db;

    // GET api/contractitems
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.ContractItems.OrderBy(c => c.Category).ThenBy(c => c.ItemName).ToListAsync());

    // GET api/contractitems/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _db.ContractItems.FindAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    // POST api/contractitems
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ContractItem item)
    {
        item.Id = Guid.NewGuid();
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _db.ContractItems.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT api/contractitems/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ContractItem updated)
    {
        var item = await _db.ContractItems.FindAsync(id);
        if (item is null) return NotFound();

        item.Category = updated.Category;
        item.ItemName = updated.ItemName;
        item.DataType = updated.DataType;
        item.Values = updated.Values;
        item.DefaultValue = updated.DefaultValue;
        item.Description = updated.Description;
        item.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(item);
    }

    // DELETE api/contractitems/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var item = await _db.ContractItems.FindAsync(id);
        if (item is null) return NotFound();
        _db.ContractItems.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
