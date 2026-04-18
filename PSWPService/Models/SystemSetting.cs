namespace PSWPService.Models;

/// <summary>アプリケーション全体のシングルトン設定</summary>
public class SystemSetting
{
    public int Id { get; set; } = 1; // 常に1行のみ
    public string MipsFilePath   { get; set; } = string.Empty;
    public string StrikeFilePath { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
