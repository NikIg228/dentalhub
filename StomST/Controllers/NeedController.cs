using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StomST.Interfaces;
using StomST.Models;
using StomST.Repositories;

namespace StomST.Controllers
{
    [Authorize]
    public class NeedController : Controller
    {
        private readonly ISupplierInterface _supplierRepository;
        private readonly IProductInterface _productRepository;
        private readonly IAnnotationInterface _annotationRepository;
        public NeedController(ISupplierInterface supplierRepository, IProductInterface productRepository, IAnnotationInterface annotationRepository)
        {
            _supplierRepository = supplierRepository;
            _productRepository = productRepository;
            _annotationRepository = annotationRepository;
        }
        public IActionResult Index()
        {
            List<ProductModel> items = _productRepository.GetProductList();
            return View(items);
        }
    }
}
