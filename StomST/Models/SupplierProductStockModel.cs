namespace StomST.Models
{
    public class SupplierProductStockModel
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string City { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ShelfLife { get; set; }
        public decimal Markup { get; set; }
        public DateTime PriceDate { get; set; }

    }
}
