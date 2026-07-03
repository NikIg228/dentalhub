using StomST.Interfaces;
using System.Data.SqlClient;
using System.Data;
using StomST.Models;

namespace StomST.Repositories
{
    public class SupplierRepository : ISupplierInterface
    {
        private readonly string _connectionString;
        public SupplierRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MainConnection");
        }

        public List<SupplierModel> GetSuppliers(int dentistryId)
        {
            List<SupplierModel> suppliers = new List<SupplierModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("dbo.GetSuppliers", conn);
                cmd.Parameters.AddWithValue("@dentistryId", dentistryId);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    SupplierModel supplier = new SupplierModel();
                    supplier.SupplierId = reader["SupplierId"] != DBNull.Value ? Convert.ToInt32(reader["SupplierId"]) : 0;
                    supplier.SupplierName = reader["SupplierName"] != DBNull.Value ? Convert.ToString(reader["SupplierName"]) : string.Empty;
                    supplier.IsContractSigned = reader["IsContractSigned"] != DBNull.Value ? Convert.ToBoolean(reader["IsContractSigned"]) : false;
                    supplier.IsDiscount = reader["IsDiscount"] != DBNull.Value ? Convert.ToBoolean(reader["IsDiscount"]) : false;
                    suppliers.Add(supplier);
                }
            }
            return suppliers;
        }

        public List<SubsupplierModel> GetSubsuppliers()
        {
            List<SubsupplierModel> subsuppliers = new List<SubsupplierModel>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("dbo.GetSubsuppliers", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    SubsupplierModel subsupplier = new SubsupplierModel();
                    subsupplier.SupplierId = reader["SupplierId"] != DBNull.Value ? Convert.ToInt32(reader["SupplierId"]) : 0;
                    subsupplier.SubsupplierId = reader["SubsupplierId"] != DBNull.Value ? Convert.ToInt32(reader["SubsupplierId"]) : 0;
                    subsupplier.SubsupplierName = reader["SubsupplierName"] != DBNull.Value ? Convert.ToString(reader["SubsupplierName"]) : string.Empty;                    
                    subsuppliers.Add(subsupplier);
                }
            }
            return subsuppliers;
        }

        public List<SubsupplierPhones> GetSubsupplierPhones()
        {
            List<SubsupplierPhones> subsupplierPhones = new List<SubsupplierPhones>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("dbo.GetSubsupplierPhones", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    SubsupplierPhones subsupplierPhone = new SubsupplierPhones();
                    subsupplierPhone.SubsupplierPhoneId = reader["SubsupplierPhoneId"] != DBNull.Value ? Convert.ToInt32(reader["SubsupplierPhoneId"]) : 0;
                    subsupplierPhone.Phone = reader["Phone"] != DBNull.Value ? Convert.ToString(reader["Phone"]) : string.Empty;
                    subsupplierPhone.SubsupplierId = reader["SubsupplierId"] != DBNull.Value ? Convert.ToInt32(reader["SubsupplierId"]) : 0;
                    subsupplierPhones.Add(subsupplierPhone);
                }
            }
            return subsupplierPhones;
        }
        public List<SubsupplierEmails> GetSubsupplierEmails()
        {
            List<SubsupplierEmails> subsupplierEmails = new List<SubsupplierEmails>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("dbo.GetSubsupplierEmails", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    SubsupplierEmails subsupplierEmail = new SubsupplierEmails();
                    subsupplierEmail.SubsupplierEmailId = reader["SubsupplierEmailId"] != DBNull.Value ? Convert.ToInt32(reader["SubsupplierEmailId"]) : 0;
                    subsupplierEmail.SubsupplierEmail = reader["SubsupplierEmail"] != DBNull.Value ? Convert.ToString(reader["SubsupplierEmail"]) : string.Empty;
                    subsupplierEmail.SubsupplierId = reader["SubsupplierId"] != DBNull.Value ? Convert.ToInt32(reader["SubsupplierId"]) : 0;
                    subsupplierEmails.Add(subsupplierEmail);
                }
            }
            return subsupplierEmails;
        }
    }
}
