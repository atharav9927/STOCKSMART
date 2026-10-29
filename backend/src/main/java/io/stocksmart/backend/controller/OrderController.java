package io.stocksmart.backend.controller;

import io.stocksmart.backend.entity.InventoryMovementEntity;
import io.stocksmart.backend.entity.OrderEntity;
import io.stocksmart.backend.entity.OrderItemEntity;
import io.stocksmart.backend.repository.InventoryMovementRepository;
import io.stocksmart.backend.repository.OrderRepository;
import io.stocksmart.backend.repository.StockLevelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final StockLevelRepository stockLevelRepository;
    private final InventoryMovementRepository movementRepository;

    public OrderController(OrderRepository orderRepository, StockLevelRepository stockLevelRepository, InventoryMovementRepository movementRepository) {
        this.orderRepository = orderRepository;
        this.stockLevelRepository = stockLevelRepository;
        this.movementRepository = movementRepository;
    }

    @GetMapping
    public ResponseEntity<List<OrderEntity>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/pos/checkout")
    @Transactional
    public ResponseEntity<OrderEntity> posCheckout(@RequestBody OrderEntity order) {
        if (order.getId() == null || order.getId().isBlank()) {
            order.setId("ord-" + System.currentTimeMillis());
        }
        if (order.getOrderNumber() == null || order.getOrderNumber().isBlank()) {
            order.setOrderNumber("POS-" + System.currentTimeMillis() % 100000);
        }
        order.setStatus("DELIVERED");

        if (order.getItems() != null) {
            for (OrderItemEntity item : order.getItems()) {
                stockLevelRepository.findByProductIdAndLocationId(item.getProductId(), order.getLocationId())
                        .ifPresent(stock -> {
                            stock.setOnHand(Math.max(0, stock.getOnHand() - item.getQuantity()));
                            stock.setUpdatedAt(Instant.now());
                            stockLevelRepository.save(stock);

                            InventoryMovementEntity movement = new InventoryMovementEntity(
                                    null,
                                    "MOV-POS-" + System.currentTimeMillis(),
                                    "SALES_PICK",
                                    item.getProductId(),
                                    order.getLocationId(),
                                    item.getQuantity(),
                                    0.0,
                                    "POS_SALE",
                                    order.getOrderNumber(),
                                    "Retail checkout POS sale deduction",
                                    "CASHIER",
                                    Instant.now()
                            );
                            movementRepository.save(movement);
                        });
            }
        }

        return ResponseEntity.ok(orderRepository.save(order));
    }
}
