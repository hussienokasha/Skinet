using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services;

public class CartService(IConnectionMultiplexer redis) : ICartService
{
    private readonly IDatabase database = redis.GetDatabase();


    public async Task<bool> DeleteCartAsync(string id)
    {
        return await database.KeyDeleteAsync(id);
    }

    public async Task<ShoppingCart?> GetCartAsync(string key)
    {
        var cart = await database.StringGetAsync(key);
        return cart.IsNullOrEmpty ? null : JsonSerializer.Deserialize<ShoppingCart>((byte[])cart!);
    }

    public async Task<ShoppingCart?> SetCartAsync(ShoppingCart cart)
    {
  
        var created = await database.StringSetAsync(cart.Id, JsonSerializer.Serialize(cart), TimeSpan.FromDays(30));
        return !created ? null : await GetCartAsync(cart.Id);

    }
}
