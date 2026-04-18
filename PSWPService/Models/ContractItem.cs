namespace PSWPService.Models;

public class ContractItem
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string DataType { get; set; } = string.Empty;
    public string? Values { get; set; }
    public string? DefaultValue { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
