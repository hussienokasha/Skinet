using Core.Entities;

namespace Core.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
  Task<IReadOnlyList<T>> GetAllAsync();
  Task<T?> GetByIdAsync(int id);
  Task Create(T entity);
  void Update(T entity);
  void Delete(T entity);

  Task<bool> SaveChangesAsync();
  Task<bool> EntityExists(int id);

  Task<T?> GetEntityWithSpec(ISpecification<T> spec);
  Task<IReadOnlyList<T>> GetEntitiesWithSpec(ISpecification<T> spec);
  Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T,TResult> spec);
  Task<IReadOnlyList<TResult>> GetEntitiesWithSpec<TResult>(ISpecification<T,TResult> spec);

  Task<int> CountAsync(ISpecification<T> spec);

}
