using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Helpers;
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
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _db.ContractItems.FindEntityAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    // POST api/contractitems
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ContractItem item)
    {
        item.ApplyAudit(User);
        _db.ContractItems.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT api/contractitems/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ContractItem updated)
    {
        var item = await _db.ContractItems.FindEntityAsync(id);
        if (item is null) return NotFound();

        item.Category = updated.Category;
        item.ItemName = updated.ItemName;
        item.DataType = updated.DataType;
        item.Values = updated.Values;
        item.DefaultValue = updated.DefaultValue;
        item.Description = updated.Description;
        item.ApplyAudit(User);

        await _db.SaveChangesAsync();
        return Ok(item);
    }

    // DELETE api/contractitems/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _db.ContractItems.RemoveByIdAsync(id)) return NotFound();
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
