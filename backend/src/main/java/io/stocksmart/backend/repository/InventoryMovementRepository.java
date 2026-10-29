package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.InventoryMovementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovementEntity, String> {
    List<InventoryMovementEntity> findByProductId(String productId);
    List<InventoryMovementEntity> findByLocationId(String locationId);
    List<InventoryMovementEntity> findTop50ByOrderByTimestampDesc();
}
