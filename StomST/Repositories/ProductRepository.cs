using StomST.Models;
using System.Data.SqlClient;
using System.Data;
using StomST.Interfaces;

namespace StomST.Repositories
{
    public class ProductRepository : IProductInterface
    {
        private readonly string _connectionString;
        public ProductRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MainConnection");
        }
        public List<ProductModel> GetProductList()
        {
            var res = new List<ProductModel>();
            using var c = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("dbo.GetProductList", c) { CommandType = CommandType.StoredProcedure };
            c.Open(); using var r = cmd.ExecuteReader();
            while (r.Read()) res.Add(new ProductModel
            {
                ProductId = r.GetInt32("ProductId"),
                ProductName = r.GetString("ProductName"),
                CategoryName = r.GetString("CategoryName"),
                BrandName = r.GetString("BrandName"),
                ManufacturerName = r.GetString("ManufacturerName")
            });
            return res;
        }

        public ProductModel GetProductDetails(int id)
        {
            var m = new ProductModel();
            using var c = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("dbo.GetProductDetails", c) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@ProductId", id);
            c.Open(); using var r = cmd.ExecuteReader();
            if (r.Read())
            {
                m.ProductId = r.GetInt32("ProductId");
                m.ProductName = r.GetString("ProductName");
                m.CategoryId = r.GetInt32("CategoryId");
                m.CategoryName = r.GetString("CategoryName");
                m.BrandId = r.GetInt32("BrandId");
                m.BrandName = r.GetString("BrandName");
                m.ManufacturerId = r.GetInt32("ManufacturerId");
                m.ManufacturerName = r.GetString("ManufacturerName");
                m.CorporationId = r.GetInt32("CorporationId");
                m.CorporationName = r.GetString("CorporationName");
                m.DosageFormId = r.GetInt32("DosageFormId");
                m.DosageFormName = r.GetString("DosageFormName");
                m.PatentId = r.GetInt32("PatentId");
                m.PatentName = r.GetString("PatentName");
                m.CountryId = r.GetInt32("CountryId");
                m.CountryName = r.GetString("CountryName");
                m.IINId = r.GetInt32("IINId");
                m.IINName = r.GetString("IINName");
            }
            if (r.NextResult()) while (r.Read()) m.ATCCodes.Add(r.GetString(0));
            return m;
        }
    }
}

