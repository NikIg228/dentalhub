using StomST.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace StomST.Repositories
{
    public class AccountRepository : IAccountInterface
    {
        private readonly string _connectionString;
        public AccountRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MainConnection");
        }
        public int GetEmployeeId(string userName, string password)
        {
            int employeeId = 0;
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (var cmd = new SqlCommand("dbo.GetEmployeeId", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@userName", userName);
                    cmd.Parameters.AddWithValue("@password", HelperRepository.EncryptPassword(password));

                    var result = cmd.ExecuteScalar();
                    if (result != null)
                    {
                        employeeId = Convert.ToInt32(result);
                    }
                    return employeeId;
                }
            }
        }
        public int GetDentistryId(int employeeId)
        {
            int dentistry = 0;
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                using (var cmd = new SqlCommand("dbo.GetDentistryId", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@employeeId", employeeId);

                    var result = cmd.ExecuteScalar();
                    if (result != null)
                    {
                        dentistry = Convert.ToInt32(result);
                    }
                    return dentistry;
                }
            }
        }

        public List<string> GetRoles(int employeeId)
        {
            List<string> roles = new List<string>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("dbo.GetRoles", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@employeeId", employeeId);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    string role = reader["GUID"] != DBNull.Value ? Convert.ToString(reader["GUID"]) : string.Empty;
                    roles.Add(role);
                }
            }
            return roles;
        }
    }
}
