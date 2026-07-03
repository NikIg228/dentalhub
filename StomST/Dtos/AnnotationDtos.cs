namespace StomST.Dtos
{
    public sealed record AnnotationDto(
        int AnnotationId,
        int ProductId,
        string TradeName,
        string INN,
        string FullDescription,
        string PharmacologicalProperties,
        string DosageForm,
        string Composition,
        string Description,
        string PharmacotherapeuticGroup,
        string Indications,
        string UsageMethods,
        string SideEffects,
        string Contraindications,
        string DrugInteractions,
        string SpecialInstructions,
        string Overdose,
        string Packaging,
        string StorageConditions,
        string ShelfLife,
        string PharmacyDispensingConditions,
        DateTime CreatedAt);
}
