package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.response.CategoryResponse;
import vn.fcc.pos_coffee_be.entity.Category;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.CategoryRepository;
import vn.fcc.pos_coffee_be.service.ICategoryService;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;

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
    public void updateStatus(String id, Boolean status) {
        Category category = findCategoryById(id);
        category.setStatus(status);
        categoryRepository.save(category);
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