package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.StockTransferEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockTransferRepository extends JpaRepository<StockTransferEntity, String> {
    Optional<StockTransferEntity> findByTransferNumber(String transferNumber);
    List<StockTransferEntity> findByStatus(String status);
}
