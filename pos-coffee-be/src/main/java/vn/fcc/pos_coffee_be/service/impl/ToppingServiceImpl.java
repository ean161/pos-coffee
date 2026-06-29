package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import vn.fcc.pos_coffee_be.dto.request.ToppingRequest;
import vn.fcc.pos_coffee_be.dto.response.ToppingResponse;
import vn.fcc.pos_coffee_be.entity.Topping;
import vn.fcc.pos_coffee_be.repository.ToppingRepository;
import vn.fcc.pos_coffee_be.service.IToppingService;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ToppingServiceImpl implements IToppingService {

    private final ToppingRepository toppingRepository;

    @Override
    public ToppingResponse createTopping(ToppingRequest request) {

        Topping topping = new Topping();

        topping.setName(request.name());
        topping.setPrice(request.price());
        topping.setStatus(true);

        Topping saved = toppingRepository.save(topping);

        return mapToResponse(saved);
    }

    @Override
    public ToppingResponse updateToppingPrice(
            String id,
            BigDecimal newPrice) {

        Topping topping = findToppingById(id);

        topping.setPrice(newPrice);

        Topping updated = toppingRepository.save(topping);

        return mapToResponse(updated);
    }

    @Override
    public void updateStatus(
            String id,
            Boolean status) {

        Topping topping = findToppingById(id);

        topping.setStatus(status);

        toppingRepository.save(topping);
    }

    @Override
    public Page<ToppingResponse> getAllToppings(
            Pageable pageable) {

        return toppingRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public ToppingResponse getToppingById(String id) {
        return mapToResponse(findToppingById(id));
    }

    private Topping findToppingById(String id) {
        return toppingRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Topping không tồn tại"
                        ));
    }

    private ToppingResponse mapToResponse(
            Topping topping) {

        return new ToppingResponse(
                topping.getId(),
                topping.getName(),
                topping.getPrice(),
                topping.getStatus()
        );
    }
}