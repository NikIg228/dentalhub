using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StomST.Dtos;
using StomST.Interfaces;
using StomST.Models;

namespace StomST.Controllers.Api
{
    [ApiController]
    [Authorize]
    [Route("api/products")]
    public class ProductsApiController : ControllerBase
    {
        private readonly IProductInterface _productRepository;
        private readonly ISupplierProductStockInterface _stockRepository;

        public ProductsApiController(
            IProductInterface productRepository,
            ISupplierProductStockInterface stockRepository)
        {
            _productRepository = productRepository;
            _stockRepository = stockRepository;
        }

        [HttpGet]
        public ActionResult<IReadOnlyList<ProductListItemDto>> GetProducts()
        {
            List<ProductModel> products = _productRepository.GetProductList();
            return Ok(products.Select(ToListItemDto).ToList());
        }

        [HttpGet("{productId:int}")]
        public ActionResult<ProductDetailsDto> GetProductDetails(int productId)
        {
            ProductModel product = _productRepository.GetProductDetails(productId);
            if (product.ProductId == 0)
            {
                return NotFound(new { message = "Товар не найден" });
            }

            return Ok(ToDetailsDto(product));
        }

        [HttpGet("{productId:int}/stocks")]
        public ActionResult<IReadOnlyList<SupplierProductStockDto>> GetProductStocks(int productId)
        {
            List<SupplierProductStockModel> stocks = _stockRepository.GetStocksByProduct(productId);
            return Ok(stocks.Select(ToStockDto).ToList());
        }

        private static ProductListItemDto ToListItemDto(ProductModel product)
        {
            return new ProductListItemDto(
                product.ProductId,
                product.ProductName,
                product.CategoryName,
                product.BrandName,
                product.ManufacturerName);
        }

        private static ProductDetailsDto ToDetailsDto(ProductModel product)
        {
            return new ProductDetailsDto(
                product.ProductId,
                product.ProductName,
                product.CategoryId,
                product.CategoryName,
                product.BrandId,
                product.BrandName,
                product.ManufacturerId,
                product.ManufacturerName,
                product.CorporationId,
                product.CorporationName,
                product.DosageFormId,
                product.DosageFormName,
                product.PatentId,
                product.PatentName,
                product.CountryId,
                product.CountryName,
                product.IINId,
                product.IINName,
                product.ATCCodes);
        }

        private static SupplierProductStockDto ToStockDto(SupplierProductStockModel stock)
        {
            return new SupplierProductStockDto(
                stock.SupplierId,
                stock.SupplierName,
                stock.City,
                stock.Price,
                stock.Quantity,
                stock.ShelfLife,
                stock.Markup,
                stock.PriceDate);
        }
    }
}
