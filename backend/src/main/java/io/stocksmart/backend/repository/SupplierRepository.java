package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.SupplierEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<SupplierEntity, String> {
    Optional<SupplierEntity> findByCode(String code);
}
