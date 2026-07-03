using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StomST.Dtos;
using StomST.Interfaces;
using StomST.Models;

namespace StomST.Controllers.Api
{
    [ApiController]
    [Authorize]
    [Route("api/suppliers")]
    public class SuppliersApiController : ControllerBase
    {
        private readonly ISupplierInterface _supplierRepository;

        public SuppliersApiController(ISupplierInterface supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        [HttpGet]
        public ActionResult<IReadOnlyList<SupplierDto>> GetSuppliers()
        {
            int dentistryId = int.TryParse(User.FindFirst("DentistryId")?.Value, out int value) ? value : 0;
            List<SupplierModel> suppliers = _supplierRepository.GetSuppliers(dentistryId);
            List<SubsupplierModel> subsuppliers = _supplierRepository.GetSubsuppliers();
            List<SubsupplierPhones> phones = _supplierRepository.GetSubsupplierPhones();
            List<SubsupplierEmails> emails = _supplierRepository.GetSubsupplierEmails();

            List<SupplierDto> result = suppliers.Select(supplier =>
            {
                List<SubsupplierDto> branchDtos = subsuppliers
                    .Where(branch => branch.SupplierId == supplier.SupplierId)
                    .Select(branch => new SubsupplierDto(
                        branch.SubsupplierId,
                        branch.SubsupplierName,
                        branch.SupplierId,
                        phones
                            .Where(phone => phone.SubsupplierId == branch.SubsupplierId)
                            .Select(phone => phone.Phone)
                            .ToList(),
                        emails
                            .Where(email => email.SubsupplierId == branch.SubsupplierId)
                            .Select(email => email.SubsupplierEmail)
                            .ToList()))
                    .ToList();

                return new SupplierDto(
                    supplier.SupplierId,
                    supplier.SupplierName,
                    supplier.IsContractSigned,
                    supplier.IsDiscount,
                    branchDtos);
            }).ToList();

            return Ok(result);
        }
    }
}
