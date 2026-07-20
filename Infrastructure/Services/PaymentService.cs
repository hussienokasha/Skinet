using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.V2;
using Product = Core.Entities.Product;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config,
IGenericRepository<Product> productRepo,
IGenericRepository<DeliveryMethod> deliveryMethodRepo,
ICartService cartService) : IPaymentService
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string id)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        var cart = await cartService.GetCartAsync(id);
        if (cart == null) return null;
        var shippingPrice = 0m;
        if (cart.DeliveryMethodId.HasValue)
        {

            var deliveryMethod = await deliveryMethodRepo.GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod == null) return null;
            shippingPrice = deliveryMethod.Price;

        }
        foreach (var item in cart.CartItems)
        {
            var product = await productRepo.GetByIdAsync(item.ProductId);
            if (product == null) return null;
            if (item.Price != product.Price)
            {

                item.Price = product.Price;
            }

        }


        var service = new PaymentIntentService();
        PaymentIntent? paymentIntent = null;
        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.CartItems.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100,
                Currency = "egp",
                PaymentMethodTypes = ["card"]
            };
            paymentIntent = await service.CreateAsync(options);
            cart.ClientSecret = paymentIntent.ClientSecret;
            cart.PaymentIntentId = paymentIntent.Id;

        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)cart.CartItems.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100,
                Currency = "egp"
            };
            paymentIntent = await service.UpdateAsync(cart.PaymentIntentId, options);

        }
        await cartService.SetCartAsync(cart);
        return cart;


    }
}