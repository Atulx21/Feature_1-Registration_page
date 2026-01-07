using Microsoft.EntityFrameworkCore;
using Registration_page.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// --- START OF NEW CODE ---
// 1. Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register the Database Context with MySQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
// We manually set the version to 8.0.44 (matches your MySQL screenshot)
options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 44))));
// --- END OF NEW CODE ---

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();