package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import vn.fcc.pos_coffee_be.dto.response.CategoryResponse;

public interface ICategoryService {

    CategoryResponse createCategory(String name);

    CategoryResponse updateCategory(String id, String name);

    void updateStatus(String id, Boolean status);

    Page<CategoryResponse> getAllCategories(int page, int size);

    CategoryResponse getCategoryById(String id);

}