using System.Security.Claims;
using PSWPService.Models;

namespace PSWPService.Helpers;

public static class AuditHelper
{
    public static string ResolveUpdateUser(ClaimsPrincipal? user)
    {
        var userName = user?.Identity?.Name;
        if (!string.IsNullOrWhiteSpace(userName))
            return userName.Length <= 32 ? userName : userName[..32];

        var claimName = user?.FindFirst(ClaimTypes.Name)?.Value
            ?? user?.FindFirst(ClaimTypes.Upn)?.Value
            ?? user?.FindFirst("preferred_username")?.Value
            ?? user?.FindFirst("name")?.Value;

        if (!string.IsNullOrWhiteSpace(claimName))
            return claimName.Length <= 32 ? claimName : claimName[..32];

        return "anonymous";
    }

    public static void ApplyAudit(this IAuditableEntity entity, ClaimsPrincipal? user)
    {
        entity.UpdateUser = ResolveUpdateUser(user);
        entity.UpdateTime = DateTime.UtcNow;
    }
}