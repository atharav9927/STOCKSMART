package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.BrandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<BrandEntity, String> {
    Optional<BrandEntity> findByCode(String code);
}
