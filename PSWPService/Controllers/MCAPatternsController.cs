using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Models;

namespace PSWPService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MCAPatternsController : ControllerBase
{
    private readonly AppDbContext _db;
    public MCAPatternsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.MCAPatterns.OrderBy(p => p.McaPatternId).ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _db.MCAPatterns.FindAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MCAPattern item)
    {
        item.Id = Guid.NewGuid();
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _db.MCAPatterns.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] MCAPattern updated)
    {
        var item = await _db.MCAPatterns.FindAsync(id);
        if (item is null) return NotFound();
        item.McaPatternId = updated.McaPatternId;
        item.McaId = updated.McaId;
        item.ContractItems = updated.ContractItems;
        item.TradeItems = updated.TradeItems;
        item.SpecialNotes = updated.SpecialNotes;
        item.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var item = await _db.MCAPatterns.FindAsync(id);
        if (item is null) return NotFound();
        _db.MCAPatterns.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
