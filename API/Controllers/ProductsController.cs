using API.Dtos;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<Pagination<Product>>> GetAllProducts([FromQuery] ProductSpecParam specParam)
    {
        var spec = new ProductSpecification(specParam);
        var count = await repo.CountAsync(spec);
        var products = await repo.GetEntitiesWithSpec(spec);
        var pagination = new Pagination<Product>(specParam.PageIndex, specParam.PageSize, count, products);
        return Ok(pagination);
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
    public async Task<ActionResult> AddProduct(CreateProductDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            PictureUrl = productDto.PictureUrl,
            Brand = productDto.Brand,
            Type = productDto.Type,
            QuantityInStock = productDto.QuantityInStock
        };
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
        var spec = new BrandListSpecification();
        var brands = await repo.GetEntitiesWithSpec(spec);
        return Ok(brands);
    }
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        
        var spec = new TypeListSpecification();
        var types = await repo.GetEntitiesWithSpec(spec);
        return Ok(types);
    }

}
