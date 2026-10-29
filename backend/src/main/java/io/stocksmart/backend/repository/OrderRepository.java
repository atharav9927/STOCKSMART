package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, String> {
    Optional<OrderEntity> findByOrderNumber(String orderNumber);
    List<OrderEntity> findByStatus(String status);
}
