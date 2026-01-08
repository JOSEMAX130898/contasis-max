using Application;
using Infrastructure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Leer la ruta desde appsettings.json
var logFilePath = builder.Configuration["Log:path"] ?? "Logs/app-log-.txt";

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(logFilePath, rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceQueryServices(builder.Configuration);

// 🔹 Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔹 Habilitar CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Endpoint raíz para verificar que está levantada
app.MapGet("/", () => Results.Text("Estadisticas API v1", "text/plain"));

app.Run();
