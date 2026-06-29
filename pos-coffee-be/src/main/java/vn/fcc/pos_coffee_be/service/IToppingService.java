package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.request.ToppingRequest;
import vn.fcc.pos_coffee_be.dto.response.ToppingResponse;

import java.math.BigDecimal;

public interface IToppingService {

    ToppingResponse createTopping(ToppingRequest request);

    ToppingResponse updateToppingPrice(
            String id,
            BigDecimal newPrice
    );

    void updateStatus(String id, Boolean status);

    Page<ToppingResponse> getAllToppings(Pageable pageable);

    ToppingResponse getToppingById(String id);
}