using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data.SeedData;

public class StoreContextSeed
{


    public static async Task SeedData(StoreContext context)
    {
        if (context.Products.Any())
            return;
        var json = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");

        var products = JsonSerializer.Deserialize<List<Product>>(json);
        if (products != null)
        {
            await context.Products.AddRangeAsync(products);

            await context.SaveChangesAsync();

        }
    }

}
