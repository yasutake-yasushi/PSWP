namespace PSWPService.Models;

public class MailSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>OTCCross / StockList / PreConfirmation</summary>
    public string EventType { get; set; } = string.Empty;

    public string TemplateId { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    /// <summary>JSON 配列 AddressRow[] e.g. [{"kind":"To","address":"a@b.com"}]</summary>
    public string Addresses { get; set; } = "[]";

    /// <summary>メールメッセージ本文のひな型</summary>
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
