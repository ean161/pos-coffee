package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.request.ProductRequest;
import vn.fcc.pos_coffee_be.dto.response.ProductResponse;
import vn.fcc.pos_coffee_be.dto.response.ProductVariantResponse;
import vn.fcc.pos_coffee_be.entity.Category;
import vn.fcc.pos_coffee_be.entity.Product;
import vn.fcc.pos_coffee_be.entity.ProductVariant;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.CategoryRepository;
import vn.fcc.pos_coffee_be.repository.ProductRepository;
import vn.fcc.pos_coffee_be.repository.ProductVariantRepository;
import vn.fcc.pos_coffee_be.service.IProductService;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại với ID: " + request.categoryId()));

        Product product = new Product();
        product.setCategory(category);
        product.setName(request.name());
        product.setBasePrice(request.basePrice());
        product.setStatus(true);

        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }

    @Override
    public ProductVariantResponse addVariant(String productId, String sizeName, BigDecimal priceAdjustment) {
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setSizeName(sizeName);
        variant.setPriceAdjustment(priceAdjustment);

        ProductVariant saved = variantRepository.save(variant);
        return mapToVariantResponse(saved);
    }

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToProductResponse);
    }

    @Override
    public List<ProductVariantResponse> getVariantsByProductId(String productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId);
        }
        return variantRepository.findByProductId(productId)
                .stream()
                .map(this::mapToVariantResponse)
                .toList();
    }

    private ProductResponse mapToProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getCategory().getId(),
                product.getName(),
                product.getBasePrice(),
                product.getStatus()
        );
    }

    private ProductVariantResponse mapToVariantResponse(ProductVariant variant) {
        return new ProductVariantResponse(
                variant.getId(),
                variant.getProduct().getId(),
                variant.getSizeName(),
                variant.getPriceAdjustment()
        );
    }
}