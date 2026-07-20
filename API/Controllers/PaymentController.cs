using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController(IPaymentService paymentService,IGenericRepository<DeliveryMethod> deliveryMethodRepo) : ControllerBase
{
    [HttpPost("{cartId}")]
    [Authorize]
    public async Task<ActionResult<ShoppingCart>> CreateOrUpdatePaymentIntent(string cartId)
    {
        var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);
        if (cart == null) return BadRequest("Problem creating payment intent");
        return Ok(cart);
    }
    [HttpGet("delivery-methods")]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods (string cartId)
    {
      return Ok(await deliveryMethodRepo.GetAllAsync());
    }
}
