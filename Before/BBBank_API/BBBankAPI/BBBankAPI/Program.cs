using Infrastructure;
using Services;
using Services.Contracts;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Allow CORS request

builder.Services.AddCors(options => options.AddPolicy(MyAllowSpecificOrigins,
        builder =>
        {
            builder.AllowAnyHeader()
                   .AllowAnyMethod()
                   .SetIsOriginAllowed((host) => true)
                   .AllowCredentials();
        }));
// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddScoped<IAccountsService, AccountService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddSingleton<BBBankContext>();
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();




