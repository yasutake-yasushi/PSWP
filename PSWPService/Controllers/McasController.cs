using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Models;

namespace PSWPService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class McasController : ControllerBase
{
    private readonly AppDbContext _db;

    public McasController(AppDbContext db) => _db = db;

    // GET api/mcas
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Mcas.OrderBy(m => m.McaId).ToListAsync());

    // GET api/mcas/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _db.Mcas.FindAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    // POST api/mcas
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Mca item)
    {
        item.Id = Guid.NewGuid();
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _db.Mcas.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT api/mcas/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Mca updated)
    {
        var item = await _db.Mcas.FindAsync(id);
        if (item is null) return NotFound();

        item.McaId = updated.McaId;
        item.Cpty = updated.Cpty;
        item.AgreementDate = updated.AgreementDate;
        item.ExecutionDate = updated.ExecutionDate;
        item.ContractItems = updated.ContractItems;
        item.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(item);
    }

    // DELETE api/mcas/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var item = await _db.Mcas.FindAsync(id);
        if (item is null) return NotFound();
        _db.Mcas.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
