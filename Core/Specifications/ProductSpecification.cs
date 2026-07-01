using Core.Entities;

namespace Core.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification(ProductSpecParam specParam) :base(x=>
    (string.IsNullOrEmpty(specParam.Search) || x.Name.ToLower().Contains(specParam.Search)) &&
     (!specParam.Brands.Any() ||specParam.Brands.Contains(x.Brand)) &&
     (!specParam.Types.Any() ||specParam.Types.Contains(x.Type))) 
    {

        ApplyPaging((specParam.PageIndex -1) * specParam.PageSize, specParam.PageSize);
       switch (specParam.Sort)
        {
            case "priceAsc":
                AddOrderBy(x => x.Price);
                break;
            case "priceDesc":
                AddOrderByDesc(x => x.Price);
                break;
            default:
                AddOrderBy(x => x.Name);
                break;
        }
    }
}
