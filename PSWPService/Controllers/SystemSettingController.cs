using Microsoft.AspNetCore.Mvc;
using PSWPService.Data;
using PSWPService.Helpers;
using PSWPService.Models;

namespace PSWPService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemSettingController : ControllerBase
{
    private readonly AppDbContext _db;

    public SystemSettingController(AppDbContext db) => _db = db;

    // GET api/systemsetting
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var item = await _db.SystemSettings.FindAsync(1);
        if (item is null)
        {
            // 初回アクセス時に空レコードを自動生成
            item = new SystemSetting { Id = 1 };
            item.UpdateUser = AuditHelper.ResolveUpdateUser(User);
            item.UpdateTime = DateTime.UtcNow;
            _db.SystemSettings.Add(item);
            await _db.SaveChangesAsync();
        }
        return Ok(item);
    }

    // PUT api/systemsetting
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] SystemSetting updated)
    {
        var item = await _db.SystemSettings.FindAsync(1);
        if (item is null)
        {
            item = new SystemSetting { Id = 1 };
            _db.SystemSettings.Add(item);
        }
        item.MipsFilePath   = updated.MipsFilePath;
        item.StrikeFilePath = updated.StrikeFilePath;
        item.UpdateUser     = AuditHelper.ResolveUpdateUser(User);
        item.UpdateTime     = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(item);
    }
}
