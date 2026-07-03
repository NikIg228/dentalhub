namespace StomST.Models
{
    public class SupplierModel
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set;}
        public bool IsContractSigned { get; set; }
        public bool IsDiscount { get; set; }
        public List<SubsupplierModel> Subsuppliers { get; set; }
    }
    public class SubsupplierModel
    {
        public int SubsupplierId { get; set; }
        public string SubsupplierName { get; set; }
        public int SupplierId { get; set; }

        public List<SubsupplierPhones> SubsupplierPhones { get; set; }
        public List<SubsupplierEmails> SubsupplierEmails { get; set; }

    }
    public class SubsupplierPhones
    {
        public int SubsupplierId { get; set; }
        public int SubsupplierPhoneId { get; set; }
        public string Phone { get; set; }
    }
    public class SubsupplierEmails
    {
        public int SubsupplierId { get; set; }
        public int SubsupplierEmailId { get; set; }
        public string SubsupplierEmail { get; set; }
    }
}
