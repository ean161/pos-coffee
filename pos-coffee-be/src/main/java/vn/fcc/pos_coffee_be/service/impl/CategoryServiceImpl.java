package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.response.CategoryResponse;
import vn.fcc.pos_coffee_be.entity.Category;
import vn.fcc.pos_coffee_be.entity.Product;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.CategoryRepository;
import vn.fcc.pos_coffee_be.repository.ProductRepository;
import vn.fcc.pos_coffee_be.service.ICategoryService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public CategoryResponse createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        category.setStatus(true);
        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(String id, String name) {
        Category category = findCategoryById(id);
        category.setName(name);
        return mapToResponse(categoryRepository.save(category));
    }
    
    @Override
    public CategoryResponse updateStatus(String id, Boolean status) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        category.setStatus(status);
        Category updatedCategory = categoryRepository.save(category);

        if (!status) {
            List<Product> products = productRepository.findByCategoryId(id);
            for (Product p : products) {
                p.setStatus(false);
            }
            productRepository.saveAll(products);
        }

        return mapToResponse(updatedCategory);
    }

    @Override
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public CategoryResponse getCategoryById(String id) {
        return mapToResponse(findCategoryById(id));
    }

    private Category findCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getStatus()
        );
    }
}