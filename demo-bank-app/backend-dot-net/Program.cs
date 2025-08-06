using Microsoft.EntityFrameworkCore;
using BankingMicroservice.Data;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Configure logging to include Entity Framework Core SQL queries
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build connection string from environment variables if they exist
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Check if Kubernetes environment variables are set
var mysqlHost = Environment.GetEnvironmentVariable("MYSQL_HOST");
var mysqlUser = Environment.GetEnvironmentVariable("MYSQL_USER");
var mysqlPwd = Environment.GetEnvironmentVariable("MYSQL_PWD");
var mysqlDb = Environment.GetEnvironmentVariable("MYSQL_DB");
var mysqlPort = Environment.GetEnvironmentVariable("MYSQL_PORT");

if (!string.IsNullOrEmpty(mysqlHost) && !string.IsNullOrEmpty(mysqlUser) && 
    !string.IsNullOrEmpty(mysqlPwd) && !string.IsNullOrEmpty(mysqlDb))
{
    var port = !string.IsNullOrEmpty(mysqlPort) ? mysqlPort : "3306";
    connectionString = $"Server={mysqlHost};Port={port};Database={mysqlDb};User={mysqlUser};Password={mysqlPwd};SslMode=Required;";
    Console.WriteLine($"using kubernetes environment variables for database connection to {mysqlHost}:{port}/{mysqlDb}");
}

// Add Entity Framework
builder.Services.AddDbContext<BankingContext>(options =>
{
    options.UseMySql(connectionString,
        ServerVersion.AutoDetect(connectionString));
    
    // Enable SQL query logging
    options.LogTo(Console.WriteLine, LogLevel.Information);
    options.EnableDetailedErrors();
});

var app = builder.Build();

// Ensure database is created and schema is set up at startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BankingContext>();
    try
    {
        // Ensure database exists
        context.Database.EnsureCreated();
        
        // Execute setup.sql script
        var setupSqlPath = Path.Combine(Directory.GetCurrentDirectory(), "setup.sql");
        if (File.Exists(setupSqlPath))
        {
            var setupSql = File.ReadAllText(setupSqlPath);
            context.Database.ExecuteSqlRaw(setupSql);
            Console.WriteLine("database setup completed successfully using setup.sql");
        }
        else
        {
            Console.WriteLine("warning: setup.sql file not found, using ensurecreated only");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"database setup failed: {ex.Message}");
        // Optionally, you could decide whether to continue or exit based on your requirements
        // For development, we'll continue, but in production you might want to exit
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure for deployment behind load balancer
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | 
                      Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto
});

// No HTTPS redirection - handled by load balancer
// app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
