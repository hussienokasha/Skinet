using System.Linq.Expressions;

namespace Core.Interfaces;

public interface ISpecification<T>
{
   public Expression<Func<T,bool>>? Criteria {get;}

     public Expression<Func<T, object>>? OrderBy { get;   }
     public Expression<Func<T, object>>? OrderByDesc { get; }


 
}
