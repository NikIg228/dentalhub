using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StomST.Interfaces;
using StomST.Models;

namespace StomST.Controllers
{
    [Authorize]
    public class DirectoryController : Controller
    {
        private readonly ISupplierInterface _supplierRepository;
        private readonly IProductInterface _productRepository;
        private readonly IAnnotationInterface _annotationRepository;
        public DirectoryController(ISupplierInterface supplierRepository, IProductInterface productRepository, IAnnotationInterface annotationRepository)
        {
            _supplierRepository = supplierRepository;
            _productRepository = productRepository;
            _annotationRepository = annotationRepository;
        }
        public IActionResult SupplierList()
        {

            int dentistryId = int.Parse(User.FindFirst("DentistryId")?.Value ?? "0");
            List<SupplierModel> suppliers = _supplierRepository.GetSuppliers(dentistryId);
            List<SubsupplierModel> subsuppliers = _supplierRepository.GetSubsuppliers();
            List<SubsupplierPhones> phones = _supplierRepository.GetSubsupplierPhones();
            List<SubsupplierEmails> emails = _supplierRepository.GetSubsupplierEmails();


            foreach (SubsupplierModel subsupplier in subsuppliers)
            {
                subsupplier.SubsupplierPhones = phones.Where(p => p.SubsupplierId == subsupplier.SubsupplierId).ToList();
                subsupplier.SubsupplierEmails = emails.Where(e => e.SubsupplierId == subsupplier.SubsupplierId).ToList();
            }
            foreach (SupplierModel supplier in suppliers)
            {
                supplier.Subsuppliers = subsuppliers.Where(ss=>ss.SupplierId==supplier.SupplierId).ToList();
            }
            return View(suppliers);
        }
        // GET: /Products
        public IActionResult ProductList()
        {
            List<ProductModel> items = _productRepository.GetProductList();
            return View(items);
        }

        // GET: /Products/Details/5
        public IActionResult ProductDetails(int id)
        {
            ProductModel product = _productRepository.GetProductDetails(id);
            if (product == null) return NotFound();
            return View(product);
        }
        public IActionResult AnnotationList()
        {
            List<AnnotationModel> items = _annotationRepository.GetAnnotations();
            return View(items);
        }
    }
}
