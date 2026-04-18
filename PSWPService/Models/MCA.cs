using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PSWPService.Models;

[Table("MCA")]
public class MCA
{
    public int Id { get; set; }

    [MaxLength(32)]
    public string McaId { get; set; } = string.Empty;

    [MaxLength(16)]
    public string Cpty { get; set; } = string.Empty;

    public DateOnly? AgreementDate { get; set; }
    public DateOnly? ExecutionDate { get; set; }

    /// <summary>JSON 配列文字列で Contract Item の ItemName を保持 e.g. ["PaymentTerm","Notional"]</summary>
    public string ContractItems { get; set; } = "[]";

    [MaxLength(32)]
    public string UpdateUser { get; set; } = string.Empty;
    public DateTime UpdateTime { get; set; } = DateTime.UtcNow;
}
