using StomST.Models;

namespace StomST.Interfaces
{
    public interface IProductInterface
    {
        List<ProductModel> GetProductList();
        // Детали по одному товару
        ProductModel GetProductDetails(int productId);
    }
}
