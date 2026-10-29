package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.StockLevelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockLevelRepository extends JpaRepository<StockLevelEntity, String> {
    Optional<StockLevelEntity> findByProductIdAndLocationId(String productId, String locationId);
    List<StockLevelEntity> findByProductId(String productId);
    List<StockLevelEntity> findByLocationId(String locationId);
}
