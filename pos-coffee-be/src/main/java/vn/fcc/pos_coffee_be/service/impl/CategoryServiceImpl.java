package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vn.fcc.pos_coffee_be.dto.response.CategoryResponse;
import vn.fcc.pos_coffee_be.entity.Category;
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

        Category saved = categoryRepository.save(category);

        return mapToResponse(saved);
    }

    @Override
    public CategoryResponse updateCategory(String id, String name) {

        Category category = findCategoryById(id);

        category.setName(name);

        Category updated = categoryRepository.save(category);

        return mapToResponse(updated);
    }

    @Override
    public void updateStatus(String id, Boolean status) {

        Category category = findCategoryById(id);

        category.setStatus(status);

        categoryRepository.save(category);
    }

    @Override
    public Page<CategoryResponse> getAllCategories(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("id").descending()
        );

        return categoryRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public CategoryResponse getCategoryById(String id) {

        Category category = findCategoryById(id);

        return mapToResponse(category);
    }

    
    private Category findCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy danh mục"
                        ));
    }

    private CategoryResponse mapToResponse(Category category) {

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getStatus()
        );
    }
}