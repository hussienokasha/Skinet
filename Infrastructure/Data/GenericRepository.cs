using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class GenericRepository<T>(StoreContext context) : IGenericRepository<T> where T : BaseEntity
{
    private readonly StoreContext context = context;

    public async Task Create(T entity)
    {
      await  context.Set<T>().AddAsync(entity);
    }

    public void Delete (T entity)
    {
        context.Set<T>().Remove(entity);
    }

    public async Task<bool> EntityExists(int id)
    {
        return await context.Set<T>().AnyAsync(x=>x.Id == id);
    } 

    public async Task<IReadOnlyList<T>> GetAllAsync()
    {
        return await context.Set<T>().ToListAsync();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await context.Set<T>().FindAsync(id);
    }

    public async Task<bool> SaveChangesAsync()
    {
      return  await context.SaveChangesAsync() > 0;
    }

    public void Update(T entity)
    {
 
        context.Set<T>().Update(entity);
        
    }

   
}
