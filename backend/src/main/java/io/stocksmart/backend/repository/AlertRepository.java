package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<AlertEntity, String> {
    List<AlertEntity> findByIsReadFalseOrderByCreatedAtDesc();
    List<AlertEntity> findAllByOrderByCreatedAtDesc();
}
