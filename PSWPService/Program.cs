using Microsoft.EntityFrameworkCore;
using PSWPService.Data;

var builder = WebApplication.CreateBuilder(args);

// DB プロバイダー切り替え: 環境変数 DB_PROVIDER=SqlServer で SQL Server を使用
// デフォルトは SQLite（開発・テスト環境向け）
var dbProvider = builder.Configuration["DbProvider"]
    ?? Environment.GetEnvironmentVariable("DB_PROVIDER")
    ?? "Sqlite";

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var connectionString = builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException("Connection string 'Default' is not configured.");

    if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
        opt.UseSqlServer(connectionString);
    else
        opt.UseSqlite(connectionString);
});

// CORS
var corsOrigins = builder.Configuration["CorsOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries)
    ?? ["http://localhost:3000", "http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program;
