package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.request.ProductRequest;
import vn.fcc.pos_coffee_be.dto.response.ProductResponse;
import vn.fcc.pos_coffee_be.dto.response.ProductVariantResponse;
import vn.fcc.pos_coffee_be.entity.Product;
import vn.fcc.pos_coffee_be.entity.ProductVariants;

import java.math.BigDecimal;
import java.util.List;

public interface IProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductVariantResponse addVariant(
            String productId,
            String sizeName,
            BigDecimal priceAdjustment
    );

    Page<ProductResponse> getAllProducts(Pageable pageable);

    List<ProductVariantResponse> getVariantsByProductId(String productId);
}