using System.ComponentModel.DataAnnotations;

namespace PSWPService.Models;

public class MailSetting
{
    public int Id { get; set; }

    /// <summary>OTCCross / StockList / PreConfirmation</summary>
    [MaxLength(32)]
    public string EventType { get; set; } = string.Empty;

    [MaxLength(32)]
    public string TemplateId { get; set; } = string.Empty;

    [MaxLength(256)]
    public string Description { get; set; } = string.Empty;

    /// <summary>JSON 配列 AddressRow[] e.g. [{"kind":"To","address":"a@b.com"}]</summary>
    [MaxLength(256)]
    public string Addresses { get; set; } = "[]";

    /// <summary>メールメッセージ本文のひな型</summary>
    public string Message { get; set; } = string.Empty;

    [MaxLength(32)]
    public string UpdateUser { get; set; } = string.Empty;
    public DateTime UpdateTime { get; set; } = DateTime.UtcNow;
}
