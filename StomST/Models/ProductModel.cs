namespace StomST.Models
{
    public class ProductModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }

        public int BrandId { get; set; }
        public string BrandName { get; set; }

        public int ManufacturerId { get; set; }
        public string ManufacturerName { get; set; }

        public int CorporationId { get; set; }
        public string CorporationName { get; set; }

        public int DosageFormId { get; set; }
        public string DosageFormName { get; set; }

        public int PatentId { get; set; }
        public string PatentName { get; set; }

        public int CountryId { get; set; }
        public string CountryName { get; set; }

        public int IINId { get; set; }
        public string IINName { get; set; }

        // Список ATC кодов
        public List<string> ATCCodes { get; set; } = new();
    }
}
