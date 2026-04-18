using System.ComponentModel.DataAnnotations;

namespace PSWPService.Models;

public class ContractItem
{
    public int Id { get; set; }
    [MaxLength(16)]
    public string Category { get; set; } = string.Empty;
    [MaxLength(32)]
    public string ItemName { get; set; } = string.Empty;
    [MaxLength(16)]
    public string DataType { get; set; } = string.Empty;
    public string? Values { get; set; }
    [MaxLength(32)]
    public string? DefaultValue { get; set; }
    public string? Description { get; set; }
    [MaxLength(32)]
    public string UpdateUser { get; set; } = string.Empty;
    public DateTime UpdateTime { get; set; } = DateTime.UtcNow;
}
