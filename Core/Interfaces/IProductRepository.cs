using Core.Entities;

namespace Core.Interfaces;

public interface IProductRepository
{
    Task<IReadOnlyList<Product>> GetProductsAsync(string? brand,string? type ,string? sort);
    Task<Product> GetProductAsync(int id);
    Task AddProductAsync(Product product);
    void UpdateProductAsync(Product product);
    Task DeleteProductAsync(int id);
     Task<bool> SaveChangesAsync();

     Task<bool> ProductExists(int id);

     Task <IReadOnlyList<string>> GetBrandsAsync();
     Task <IReadOnlyList<string>> GetTypesAsync();


}
