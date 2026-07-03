namespace StomST.Models
{
    public class AnnotationModel
    {
        public int AnnotationId { get; set; }
        public int ProductId { get; set; }
        public string TradeName { get; set; }
        public string INN { get; set; }
        public string FullDescription { get; set; }
        public string PharmacologicalProperties { get; set; }
        public string DosageForm { get; set; }
        public string Composition { get; set; }
        public string Description { get; set; }
        public string PharmacotherapeuticGroup { get; set; }
        public string Indications { get; set; }
        public string UsageMethods { get; set; }
        public string SideEffects { get; set; }
        public string Contraindications { get; set; }
        public string DrugInteractions { get; set; }
        public string SpecialInstructions { get; set; }
        public string Overdose { get; set; }
        public string Packaging { get; set; }
        public string StorageConditions { get; set; }
        public string ShelfLife { get; set; }
        public string PharmacyDispensingConditions { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
