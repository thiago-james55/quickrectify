using Microsoft.EntityFrameworkCore;
using QuickRectify.Config;
using QuickRectify.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DbContextConfig>(options =>
    options.UseMySql(DbContextConfig.ConnectionURL, ServerVersion.AutoDetect(DbContextConfig.ConnectionURL)));

builder.Services.AddScoped<RequestService, RequestService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

