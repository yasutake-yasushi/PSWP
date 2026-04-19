using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PSWPService.Models;

[Table("MCAPatterns")]
public class MCAPattern : IAuditableEntity
{
    public int Id { get; set; }

    [MaxLength(32)]
    public string McaPatternId { get; set; } = string.Empty;

    [MaxLength(32)]
    public string McaId { get; set; } = string.Empty;

    /// <summary>JSON array of {itemName, value} for Contract tab</summary>
    public string ContractItems { get; set; } = "[]";

    /// <summary>JSON array of {itemName, value} for Trade tab</summary>
    public string TradeItems { get; set; } = "[]";

    public string? SpecialNotes { get; set; }

    [MaxLength(32)]
    public string UpdateUser { get; set; } = string.Empty;
    public DateTime UpdateTime { get; set; } = DateTime.UtcNow;
}
