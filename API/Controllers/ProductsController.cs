using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
{
    private readonly IGenericRepository<Product> repo = repo;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetAllProducts([FromQuery] string? brand, [FromQuery] string? type, [FromQuery] string? sort)
    {
        var spec = new ProductSpecification(brand, type, sort);
        var products = await repo.GetEntitiesWithSpec(spec);


        return Ok(products);

    }
    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        if (!await repo.EntityExists(id))
        {
            return NotFound("Product Not Found");
        }
        return Ok(await repo.GetByIdAsync(id));
    }
    [HttpPost]
    public async Task<ActionResult> AddProduct(Product product)
    {
        await repo.Create(product);
        if (await repo.SaveChangesAsync())
        {
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        return BadRequest("Problem adding product");
    }

    [HttpPut]

    [Route("{id}")]
    public async Task<ActionResult> UpdateProduct(int id, [FromBody] Product product)
    {
        if (!await repo.EntityExists(id))
        {
            return NotFound("Product Not Found");
        }

        repo.Update(product);
        if (await repo.SaveChangesAsync())
        {
            return NoContent();
        }
        return BadRequest("Problem updating product");
    }

    [HttpDelete]

    [Route("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);
       if
        (product == null)
        {
            return NotFound("Product Not Found");
        }
        repo.Delete(product);
        if (await repo.SaveChangesAsync())
        {
            return NoContent();
        }
        return BadRequest("Problem deleting product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        // TODO 
        return Ok();
    }
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        // TODO 
        return Ok();
    }

}
