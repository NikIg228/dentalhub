namespace StomST.Dtos
{
    public sealed record ProductListItemDto(
        int ProductId,
        string ProductName,
        string CategoryName,
        string BrandName,
        string ManufacturerName);

    public sealed record ProductDetailsDto(
        int ProductId,
        string ProductName,
        int CategoryId,
        string CategoryName,
        int BrandId,
        string BrandName,
        int ManufacturerId,
        string ManufacturerName,
        int CorporationId,
        string CorporationName,
        int DosageFormId,
        string DosageFormName,
        int PatentId,
        string PatentName,
        int CountryId,
        string CountryName,
        int IINId,
        string IINName,
        IReadOnlyList<string> ATCCodes);

    public sealed record SupplierProductStockDto(
        int SupplierId,
        string SupplierName,
        string City,
        decimal Price,
        int Quantity,
        string ShelfLife,
        decimal Markup,
        DateTime PriceDate);
}
