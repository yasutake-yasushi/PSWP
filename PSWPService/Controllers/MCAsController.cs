using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Helpers;
using PSWPService.Models;

namespace PSWPService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MCAsController : ControllerBase
{
    private readonly AppDbContext _db;

    public MCAsController(AppDbContext db) => _db = db;

    // GET api/mcas
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.MCAs.OrderBy(m => m.McaId).ToListAsync());

    // GET api/mcas/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _db.MCAs.FindAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    // POST api/mcas
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MCA item)
    {
        item.UpdateUser = AuditHelper.ResolveUpdateUser(User);
        item.UpdateTime = DateTime.UtcNow;
        _db.MCAs.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT api/mcas/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] MCA updated)
    {
        var item = await _db.MCAs.FindAsync(id);
        if (item is null) return NotFound();

        item.McaId = updated.McaId;
        item.Cpty = updated.Cpty;
        item.AgreementDate = updated.AgreementDate;
        item.ExecutionDate = updated.ExecutionDate;
        item.ContractItems = updated.ContractItems;
        item.UpdateUser = AuditHelper.ResolveUpdateUser(User);
        item.UpdateTime = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(item);
    }

    // DELETE api/mcas/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.MCAs.FindAsync(id);
        if (item is null) return NotFound();
        _db.MCAs.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
