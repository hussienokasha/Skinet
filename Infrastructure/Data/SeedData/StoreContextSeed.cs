using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data.SeedData;

public class StoreContextSeed
{

   public static async Task SeedData(StoreContext context)
{
    if (!context.Products.Any())
    {
        var productsJson =
            await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");

        var products =
            JsonSerializer.Deserialize<List<Product>>(productsJson);

        if (products != null)
        {
            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }

    if (!context.DeliveryMethods.Any())
    {
        var deliveryJson =
            await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");

        var deliveryMethods =
            JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryJson);

        if (deliveryMethods != null)
        {
            await context.DeliveryMethods.AddRangeAsync(deliveryMethods);
            await context.SaveChangesAsync();
        }
    }
}

}
