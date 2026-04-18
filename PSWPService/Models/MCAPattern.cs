using System.ComponentModel.DataAnnotations.Schema;

namespace PSWPService.Models;

[Table("McaPatterns")]
public class MCAPattern
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string McaPatternId { get; set; } = string.Empty;
    public string McaId { get; set; } = string.Empty;

    /// <summary>JSON array of {itemName, value} for Contract tab</summary>
    public string ContractItems { get; set; } = "[]";

    /// <summary>JSON array of {itemName, value} for Trade tab</summary>
    public string TradeItems { get; set; } = "[]";

    public string? SpecialNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
