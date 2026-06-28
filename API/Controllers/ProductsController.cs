using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductRepository repo) : ControllerBase
{
    private readonly IProductRepository repo = repo;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetAllProducts([FromQuery]string? brand, [FromQuery]string? type ,[FromQuery]string? sort)
    {
        return  Ok(await repo.GetProductsAsync(brand,type,sort));
    }
    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        if(!await repo.ProductExists(id))
        {
            return NotFound("Product Not Found");
        }
        return Ok(await repo.GetProductAsync(id));
    }
    [HttpPost]
    public async Task<ActionResult> AddProduct(Product product)
    {
        repo.AddProductAsync(product);
        if (!await repo.SaveChangesAsync())
        {
            return BadRequest("Problem adding product");
        }
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut]

    [Route("{id}")]
     public async Task<ActionResult> UpdateProduct(int id,[FromBody] Product product)
    {
       if(!await repo.ProductExists(id))
        {
            return NotFound("Product Not Found");
        }
        
        repo.UpdateProductAsync(product);
        if(!await repo.SaveChangesAsync())
        {
            return BadRequest("Problem updating product");
        }
        return NoContent();
    }

    [HttpDelete]

    [Route("{id}")]
     public async Task<ActionResult> DeleteProduct(int id)
    {
        if(!await repo.ProductExists(id))
        {
            return NotFound("Product Not Found");
        }
        
        
        repo.DeleteProductAsync(id);

        if (!await repo.SaveChangesAsync())
        {
            return BadRequest("Problem deleting product");
        }
        return NoContent();
    }

[HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        return Ok(await repo.GetBrandsAsync());
    }
[HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        return Ok(await repo.GetTypesAsync());
    }

}
