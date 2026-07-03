using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StomST.Dtos;
using StomST.Interfaces;
using StomST.Models;

namespace StomST.Controllers.Api
{
    [ApiController]
    [Authorize]
    [Route("api/annotations")]
    public class AnnotationsApiController : ControllerBase
    {
        private readonly IAnnotationInterface _annotationRepository;

        public AnnotationsApiController(IAnnotationInterface annotationRepository)
        {
            _annotationRepository = annotationRepository;
        }

        [HttpGet]
        public ActionResult<IReadOnlyList<AnnotationDto>> GetAnnotations()
        {
            List<AnnotationModel> annotations = _annotationRepository.GetAnnotations();
            return Ok(annotations.Select(ToDto).ToList());
        }

        private static AnnotationDto ToDto(AnnotationModel annotation)
        {
            return new AnnotationDto(
                annotation.AnnotationId,
                annotation.ProductId,
                annotation.TradeName,
                annotation.INN,
                annotation.FullDescription,
                annotation.PharmacologicalProperties,
                annotation.DosageForm,
                annotation.Composition,
                annotation.Description,
                annotation.PharmacotherapeuticGroup,
                annotation.Indications,
                annotation.UsageMethods,
                annotation.SideEffects,
                annotation.Contraindications,
                annotation.DrugInteractions,
                annotation.SpecialInstructions,
                annotation.Overdose,
                annotation.Packaging,
                annotation.StorageConditions,
                annotation.ShelfLife,
                annotation.PharmacyDispensingConditions,
                annotation.CreatedAt);
        }
    }
}
