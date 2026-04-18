namespace PSWPService.Models;

public class Strategy
{
    public int Id { get; set; }

    /// <summary>Lending / Borrowing / Funding / Self Funding</summary>
    public string StrategyType { get; set; } = string.Empty;

    public string PortId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
