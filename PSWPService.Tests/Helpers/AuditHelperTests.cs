using System.Security.Claims;
using PSWPService.Helpers;

namespace PSWPService.Tests.Helpers;

public class AuditHelperTests
{
    [Fact]
    public void ResolveUpdateUser_ReturnsAnonymous_WhenIdentityIsMissing()
    {
        Assert.Equal("anonymous", AuditHelper.ResolveUpdateUser(null));
    }

    [Fact]
    public void ResolveUpdateUser_TrimsNameTo32Chars()
    {
        var longName = new string('A', 40);
        var identity = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, longName) }, "Test");
        var principal = new ClaimsPrincipal(identity);

        var result = AuditHelper.ResolveUpdateUser(principal);

        Assert.Equal(32, result.Length);
        Assert.Equal(new string('A', 32), result);
    }
}
