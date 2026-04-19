using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Helpers;
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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _db.MCAPatterns.FindEntityAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MCAPattern item)
    {
        item.ApplyAudit(User);
        _db.MCAPatterns.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] MCAPattern updated)
    {
        var item = await _db.MCAPatterns.FindEntityAsync(id);
        if (item is null) return NotFound();
        item.McaPatternId = updated.McaPatternId;
        item.McaId = updated.McaId;
        item.ContractItems = updated.ContractItems;
        item.TradeItems = updated.TradeItems;
        item.SpecialNotes = updated.SpecialNotes;
        item.ApplyAudit(User);
        await _db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _db.MCAPatterns.RemoveByIdAsync(id)) return NotFound();
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
