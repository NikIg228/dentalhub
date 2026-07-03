using StomST.Interfaces;
using StomST.Models;
using System.Data.SqlClient;
using System.Data;

namespace StomST.Repositories
{
    public class SupplierProductStockRepository : ISupplierProductStockInterface
    {
        private readonly string _connectionString;
        public SupplierProductStockRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MainConnection");
        }
        public List<SupplierProductStockModel> GetStocksByProduct(int productId)
        {
            var list = new List<SupplierProductStockModel>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("dbo.GetSupplierProductStocks", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@ProductId", productId);
            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                list.Add(new SupplierProductStockModel
                {
                    SupplierId = reader.GetInt32(reader.GetOrdinal("SupplierId")),
                    SupplierName = reader.GetString(reader.GetOrdinal("SupplierName")),
                    City = reader.GetString(reader.GetOrdinal("City")),
                    Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                    Quantity = reader.GetInt32(reader.GetOrdinal("Quantity")),
                    ShelfLife = reader.GetString(reader.GetOrdinal("ShelfLife")),
                    Markup = reader.GetDecimal(reader.GetOrdinal("Markup")),
                    PriceDate = reader.GetDateTime(reader.GetOrdinal("PriceDate"))
                });
            }
            return list;
        }
    }
}
