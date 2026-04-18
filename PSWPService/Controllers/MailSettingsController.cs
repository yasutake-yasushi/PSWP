using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSWPService.Data;
using PSWPService.Models;

namespace PSWPService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MailSettingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public MailSettingsController(AppDbContext db) => _db = db;

    // GET api/mailsettings
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.MailSettings.OrderBy(m => m.EventType).ThenBy(m => m.TemplateId).ToListAsync());

    // GET api/mailsettings/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _db.MailSettings.FindAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    // POST api/mailsettings
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MailSetting item)
    {
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _db.MailSettings.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT api/mailsettings/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] MailSetting updated)
    {
        var item = await _db.MailSettings.FindAsync(id);
        if (item is null) return NotFound();

        item.EventType   = updated.EventType;
        item.TemplateId  = updated.TemplateId;
        item.Description = updated.Description;
        item.Addresses   = updated.Addresses;
        item.Message     = updated.Message;
        item.UpdatedAt   = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(item);
    }

    // DELETE api/mailsettings/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.MailSettings.FindAsync(id);
        if (item is null) return NotFound();
        _db.MailSettings.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
