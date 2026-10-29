package io.stocksmart.backend.controller;

import io.stocksmart.backend.entity.ProductEntity;
import io.stocksmart.backend.entity.StockLevelEntity;
import io.stocksmart.backend.repository.ProductRepository;
import io.stocksmart.backend.repository.StockLevelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scan")
public class ScanController {

    private final ProductRepository productRepository;
    private final StockLevelRepository stockLevelRepository;

    public ScanController(ProductRepository productRepository, StockLevelRepository stockLevelRepository) {
        this.productRepository = productRepository;
        this.stockLevelRepository = stockLevelRepository;
    }

    public static class ScanLookupResult {
        private ProductEntity product;
        private List<StockLevelEntity> stock;

        public ScanLookupResult() {}
        public ScanLookupResult(ProductEntity product, List<StockLevelEntity> stock) {
            this.product = product;
            this.stock = stock;
        }

        public ProductEntity getProduct() { return product; }
        public void setProduct(ProductEntity product) { this.product = product; }

        public List<StockLevelEntity> getStock() { return stock; }
        public void setStock(List<StockLevelEntity> stock) { this.stock = stock; }
    }

    @GetMapping("/lookup")
    public ResponseEntity<ScanLookupResult> lookupBarcode(@RequestParam String code) {
        String trimmed = code.trim();
        return productRepository.findByBarcodeOrSku(trimmed)
                .map(product -> {
                    List<StockLevelEntity> stock = stockLevelRepository.findByProductId(product.getId());
                    return ResponseEntity.ok(new ScanLookupResult(product, stock));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
