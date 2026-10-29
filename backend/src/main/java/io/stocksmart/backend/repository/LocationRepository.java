package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<LocationEntity, String> {
    Optional<LocationEntity> findByCode(String code);
}
