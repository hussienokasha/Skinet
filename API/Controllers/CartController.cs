using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController(ICartService cartService) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<ShoppingCart>> GetCartAync([FromQuery] string id)
    {
        var cart = await cartService.GetCartAsync(id);

        return Ok(cart ?? new ShoppingCart { Id = id });

    }
    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> SetCartAync([FromBody]ShoppingCart cart)

    {
        var created = await cartService.SetCartAsync(cart);

        return Ok(created);

    }
    [HttpDelete]
    public async Task<ActionResult<bool>> DeleteCartAync(string id)

    {
        var removed = await cartService.DeleteCartAsync(id);

        return removed? Ok() : BadRequest("Problem deleting cart");

    }
}
