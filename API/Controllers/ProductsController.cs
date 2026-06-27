using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(StoreContext storeContext) : ControllerBase
{
    private readonly StoreContext storeContext = storeContext;

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        return Ok(await storeContext.Products.ToListAsync());
    }
    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await storeContext.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }
    [HttpPost]
    public async Task<IActionResult> AddProduct(Product product)
    {
        await storeContext.Products.AddAsync(product);
        await storeContext.SaveChangesAsync();
        return Created();
    }

    [HttpPut]

    [Route("{id}")]
     public async Task<ActionResult> UpdateProduct(int id,Product product)
    {
       if(product.Id != id || !storeContext.Products.Any(x=>x.Id == id))
        {
            return BadRequest("Product Not Found");
        }
        
        storeContext.Products.Update(product);
        await storeContext.SaveChangesAsync();
        return Ok(product);
    }

    [HttpDelete]

    [Route("{id}")]
     public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = storeContext.Products.Find(id);
      if(product == null)
        {
            return BadRequest("Product Not Found");
        }
        storeContext.Remove(product);
        await storeContext.SaveChangesAsync();
        return NoContent();
    }

}
