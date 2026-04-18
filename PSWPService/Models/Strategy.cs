using System.ComponentModel.DataAnnotations;

namespace PSWPService.Models;

public class Strategy
{
    public int Id { get; set; }

    /// <summary>Lending / Borrowing / Funding / Self Funding</summary>
    [MaxLength(16)]
    public string StrategyType { get; set; } = string.Empty;

    [MaxLength(8)]
    public string PortId { get; set; } = string.Empty;

    [MaxLength(32)]
    public string UpdateUser { get; set; } = string.Empty;
    public DateTime UpdateTime { get; set; } = DateTime.UtcNow;
}
