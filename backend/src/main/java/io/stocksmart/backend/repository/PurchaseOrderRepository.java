package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.PurchaseOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrderEntity, String> {
    Optional<PurchaseOrderEntity> findByPoNumber(String poNumber);
    List<PurchaseOrderEntity> findBySupplierId(String supplierId);
    List<PurchaseOrderEntity> findByStatus(String status);
}
