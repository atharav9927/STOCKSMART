package io.stocksmart.backend.repository;

import io.stocksmart.backend.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, String> {
    Optional<ProductEntity> findBySku(String sku);

    @Query("SELECT p FROM ProductEntity p JOIN p.barcodes b WHERE LOWER(b) = LOWER(:code) OR LOWER(p.sku) = LOWER(:code)")
    Optional<ProductEntity> findByBarcodeOrSku(@Param("code") String code);

    List<ProductEntity> findByCategoryId(String categoryId);
    List<ProductEntity> findByBrandId(String brandId);
}
