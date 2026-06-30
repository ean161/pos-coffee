package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.response.CategoryResponse;

public interface ICategoryService {

    CategoryResponse createCategory(String name);

    CategoryResponse updateCategory(String id, String name);

    void updateStatus(String id, Boolean status);

    Page<CategoryResponse> getAllCategories(Pageable pageable);

    CategoryResponse getCategoryById(String id);

}