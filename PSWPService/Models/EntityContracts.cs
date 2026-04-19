namespace PSWPService.Models;

public interface IEntity
{
    int Id { get; set; }
}

public interface IAuditableEntity : IEntity
{
    string UpdateUser { get; set; }
    DateTime UpdateTime { get; set; }
}
