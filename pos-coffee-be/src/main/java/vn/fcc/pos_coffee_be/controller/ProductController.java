package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.ProductRequest;
import vn.fcc.pos_coffee_be.dto.request.ProductVariantRequest;
import vn.fcc.pos_coffee_be.dto.response.ProductResponse;
import vn.fcc.pos_coffee_be.dto.response.ProductVariantResponse;
import vn.fcc.pos_coffee_be.service.IProductService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return new ResponseEntity<>(productService.createProduct(request), HttpStatus.CREATED);
    }

    @PostMapping("/{productId}/variants")
    public ResponseEntity<ProductVariantResponse> addVariant(
            @PathVariable String productId,
            @Valid @RequestBody ProductVariantRequest request) {
        return new ResponseEntity<>(
                productService.addVariant(productId, request.sizeName(), request.priceAdjustment()),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{productId}/variants")
    public ResponseEntity<List<ProductVariantResponse>> getVariantsByProductId(@PathVariable String productId) {
        return ResponseEntity.ok(productService.getVariantsByProductId(productId));
    }
}