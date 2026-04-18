using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Models;

namespace PSWPService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StrategiesController : ControllerBase
{
    private readonly AppDbContext _db;

    public StrategiesController(AppDbContext db) => _db = db;

    // GET api/strategies
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Strategies.OrderBy(s => s.StrategyType).ThenBy(s => s.PortId).ToListAsync());

    // GET api/strategies/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _db.Strategies.FindAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    // POST api/strategies
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Strategy item)
    {
        item.Id = Guid.NewGuid();
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _db.Strategies.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT api/strategies/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Strategy updated)
    {
        var item = await _db.Strategies.FindAsync(id);
        if (item is null) return NotFound();

        item.StrategyType = updated.StrategyType;
        item.PortId       = updated.PortId;
        item.UpdatedAt    = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(item);
    }

    // DELETE api/strategies/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var item = await _db.Strategies.FindAsync(id);
        if (item is null) return NotFound();
        _db.Strategies.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
