using StomST.Models;
using System.Data.SqlClient;
using System.Data;
using StomST.Interfaces;

namespace StomST.Repositories
{
    public class AnnotationRepository : IAnnotationInterface
    {
        private readonly string _connectionString;
        public AnnotationRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MainConnection");
        }
        public List<AnnotationModel> GetAnnotations()
        {
            var list = new List<AnnotationModel>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("dbo.GetProductAnnotations", conn)
            { CommandType = CommandType.StoredProcedure };
            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                list.Add(new AnnotationModel
                {
                    AnnotationId = reader.GetInt32("AnnotationId"),
                    ProductId = reader.GetInt32("ProductId"),
                    TradeName = reader.GetString("TradeName"),
                    INN = reader.GetString("INN"),
                    FullDescription = reader.GetString("FullDescription"),
                    PharmacologicalProperties = reader.GetString("PharmacologicalProperties"),
                    DosageForm = reader.GetString("DosageForm"),
                    Composition = reader.GetString("Composition"),
                    Description = reader.GetString("Description"),
                    PharmacotherapeuticGroup = reader.GetString("PharmacotherapeuticGroup"),
                    Indications = reader.GetString("Indications"),
                    UsageMethods = reader.GetString("UsageMethods"),
                    SideEffects = reader.GetString("SideEffects"),
                    Contraindications = reader.GetString("Contraindications"),
                    DrugInteractions = reader.GetString("DrugInteractions"),
                    SpecialInstructions = reader.GetString("SpecialInstructions"),
                    Overdose = reader.GetString("Overdose"),
                    Packaging = reader.GetString("Packaging"),
                    StorageConditions = reader.GetString("StorageConditions"),
                    ShelfLife = reader.GetString("ShelfLife"),
                    PharmacyDispensingConditions = reader.GetString("PharmacyDispensingConditions"),
                    CreatedAt = reader.GetDateTime("CreatedAt")
                });
            }
            return list;
        }
    }
}
