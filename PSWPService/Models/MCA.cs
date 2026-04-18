using System.ComponentModel.DataAnnotations.Schema;

namespace PSWPService.Models;

[Table("MCA")]
public class MCA
{
    public int Id { get; set; }
    public string McaId { get; set; } = string.Empty;
    public string Cpty { get; set; } = string.Empty;
    public DateOnly? AgreementDate { get; set; }
    public DateOnly? ExecutionDate { get; set; }

    /// <summary>JSON 配列文字列で Contract Item の ItemName を保持 e.g. ["PaymentTerm","Notional"]</summary>
    public string ContractItems { get; set; } = "[]";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
