using Azure.Identity;
using Infrastructure;
using Services;
using Services.Contracts;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

//Confiuration Builder based on AppSettings File
var appSettingsFileSettings = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .Build();


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

// builder.Services.AddScoped<ModuleLoader>();
var SignalRConString = appSettingsFileSettings["SignalRConnectionString"];
builder.Services.AddSignalR().AddAzureSignalR(SignalRConString);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.UseRouting();
//Adding signalr middleware
app.UseEndpoints(endpoints =>
{
    // letting application know about diffrent hubs in our aplicaiton 
    // mapping hub to a route (one route per hub)
    endpoints.MapHub<TransactionHUB>("/api/updateAll");
});
app.Run();




