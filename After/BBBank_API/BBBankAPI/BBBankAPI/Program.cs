using Infrastructure;
using Services;
using Services.Contracts;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Allow CORS request

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(name: MyAllowSpecificOrigins,
//                      builder =>
//                      {
//                          builder.WithOrigins("http://localhost:4200" , "https://bbanktest.z13.web.core.windows.net")
//                          .AllowAnyHeader()
//                                                  .AllowAnyMethod();
//                      });
//});

builder.Services.AddCors(options => options.AddPolicy(MyAllowSpecificOrigins,
        builder =>
        {
            builder.AllowAnyHeader()
                   .AllowAnyMethod()
                   .SetIsOriginAllowed((host) => true)
                   .AllowCredentials();
        }));


//Confiuration Builder based on AppSettings File
var appSettingsFileSettings = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .Build();

// builder.Services.AddScoped<ModuleLoader>();
var SignalRConString = appSettingsFileSettings["SignalRConnectionString"];
builder.Services.AddSignalR().AddAzureSignalR(SignalRConString);



// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddScoped<IAccountsService, AccountService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddSingleton<BBBankContext>();
var app = builder.Build();


app.UseRouting();

// Configure the HTTP request pipeline.
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

//Adding signalr middleware
app.UseEndpoints(endpoints =>
{
    // letting application know about diffrent hubs in our aplicaiton 
    // mapping hub to a route (one route per hub)
    endpoints.MapHub<TransactionHUB>("/api/updateAll");
});

app.Run();




