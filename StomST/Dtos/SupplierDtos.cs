namespace StomST.Dtos
{
    public sealed record SupplierDto(
        int SupplierId,
        string SupplierName,
        bool IsContractSigned,
        bool IsDiscount,
        IReadOnlyList<SubsupplierDto> Subsuppliers);

    public sealed record SubsupplierDto(
        int SubsupplierId,
        string SubsupplierName,
        int SupplierId,
        IReadOnlyList<string> Phones,
        IReadOnlyList<string> Emails);
}
