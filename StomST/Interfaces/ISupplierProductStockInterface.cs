using StomST.Models;

namespace StomST.Interfaces
{
    public interface ISupplierProductStockInterface
    {
        List<SupplierProductStockModel> GetStocksByProduct(int productId);
    }
}
