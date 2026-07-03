using StomST.Models;

namespace StomST.Interfaces
{
    public interface ISupplierInterface
    {
        List<SupplierModel> GetSuppliers(int dentistryId);
        List<SubsupplierModel> GetSubsuppliers();
        List<SubsupplierPhones> GetSubsupplierPhones();
        List<SubsupplierEmails> GetSubsupplierEmails();
    }
}
