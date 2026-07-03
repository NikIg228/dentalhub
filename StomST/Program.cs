using Microsoft.AspNetCore.Authentication.Cookies;
using StomST.Interfaces;
using StomST.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextFrontend", policy =>
    {
        policy
            .WithOrigins("http://127.0.0.1:3000", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
// Add services to the container.
builder.Services.AddTransient<IAccountInterface, AccountRepository>();
builder.Services.AddTransient<ISupplierInterface, SupplierRepository>();
builder.Services.AddTransient<IProductInterface, ProductRepository>();
builder.Services.AddTransient<IAnnotationInterface, AnnotationRepository>();
builder.Services.AddTransient<ISupplierProductStockInterface, SupplierProductStockRepository>();
builder.Services.AddMvc();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => //CookieAuthenticationOptions
    {
        options.LoginPath = new Microsoft.AspNetCore.Http.PathString("/Account/Login");
        options.AccessDeniedPath = new Microsoft.AspNetCore.Http.PathString("/Account/Login");
    });
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("NextFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");
app.Run();
