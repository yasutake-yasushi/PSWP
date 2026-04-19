using Microsoft.EntityFrameworkCore;
using PSWPService.Models;

namespace PSWPService.Helpers;

public static class DbSetExtensions
{
    public static async Task<TEntity?> FindEntityAsync<TEntity>(this DbSet<TEntity> set, int id)
        where TEntity : class, IEntity
        => await set.FindAsync(id);

    public static async Task<bool> RemoveByIdAsync<TEntity>(this DbSet<TEntity> set, int id)
        where TEntity : class, IEntity
    {
        var entity = await set.FindEntityAsync(id);
        if (entity is null)
        {
            return false;
        }

        set.Remove(entity);
        return true;
    }
}
