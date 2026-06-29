package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vn.fcc.pos_coffee_be.dto.request.ProductRequest;
import vn.fcc.pos_coffee_be.dto.response.ProductResponse;
import vn.fcc.pos_coffee_be.dto.response.ProductVariantResponse;
import vn.fcc.pos_coffee_be.entity.Category;
import vn.fcc.pos_coffee_be.entity.Product;
import vn.fcc.pos_coffee_be.entity.ProductVariants;
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
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Danh mục không tồn tại"
                        ));

        Product product = new Product();

        product.setCategory(category);
        product.setName(request.name());
        product.setBasePrice(request.basePrice());
        product.setStatus(true);

        Product saved = productRepository.save(product);

        return mapToProductResponse(saved);
    }

    @Override
    public ProductVariantResponse addVariant(
            String productId,
            String sizeName,
            BigDecimal priceAdjustment
    ) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Sản phẩm không tồn tại"
                        ));

        ProductVariants variant = new ProductVariants();

        variant.setProduct(product);
        variant.setSizeName(sizeName);
        variant.setPriceAdjustment(priceAdjustment);

        ProductVariants saved = variantRepository.save(variant);

        return mapToVariantResponse(saved);
    }

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {

        return productRepository
                .findAll(pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    public List<ProductVariantResponse> getVariantsByProductId(String productId) {

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

    private ProductVariantResponse mapToVariantResponse(ProductVariants variant) {

        return new ProductVariantResponse(
                variant.getId(),
                variant.getProduct().getId(),
                variant.getSizeName(),
                variant.getPriceAdjustment()
        );
    }
}