package io.stocksmart.backend.controller;

import io.stocksmart.backend.entity.InventoryMovementEntity;
import io.stocksmart.backend.entity.LocationEntity;
import io.stocksmart.backend.entity.StockLevelEntity;
import io.stocksmart.backend.entity.StockTransferEntity;
import io.stocksmart.backend.repository.InventoryMovementRepository;
import io.stocksmart.backend.repository.LocationRepository;
import io.stocksmart.backend.repository.StockLevelRepository;
import io.stocksmart.backend.repository.StockTransferRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final LocationRepository locationRepository;
    private final StockLevelRepository stockLevelRepository;
    private final InventoryMovementRepository movementRepository;
    private final StockTransferRepository transferRepository;

    public InventoryController(LocationRepository locationRepository, StockLevelRepository stockLevelRepository, InventoryMovementRepository movementRepository, StockTransferRepository transferRepository) {
        this.locationRepository = locationRepository;
        this.stockLevelRepository = stockLevelRepository;
        this.movementRepository = movementRepository;
        this.transferRepository = transferRepository;
    }

    @GetMapping("/locations")
    public ResponseEntity<List<LocationEntity>> getLocations() {
        return ResponseEntity.ok(locationRepository.findAll());
    }

    @GetMapping("/stock")
    public ResponseEntity<List<StockLevelEntity>> getStockLevels(
            @RequestParam(required = false) String locationId,
            @RequestParam(required = false) String productId) {
        if (locationId != null && !locationId.equals("all")) {
            return ResponseEntity.ok(stockLevelRepository.findByLocationId(locationId));
        }
        if (productId != null) {
            return ResponseEntity.ok(stockLevelRepository.findByProductId(productId));
        }
        return ResponseEntity.ok(stockLevelRepository.findAll());
    }

    @GetMapping("/movements")
    public ResponseEntity<List<InventoryMovementEntity>> getMovements() {
        return ResponseEntity.ok(movementRepository.findTop50ByOrderByTimestampDesc());
    }

    public static class AdjustmentRequest {
        private String productId;
        private String locationId;
        private int quantityDelta;
        private String reasonCode;
        private String notes;

        public AdjustmentRequest() {}

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getLocationId() { return locationId; }
        public void setLocationId(String locationId) { this.locationId = locationId; }

        public int getQuantityDelta() { return quantityDelta; }
        public void setQuantityDelta(int quantityDelta) { this.quantityDelta = quantityDelta; }

        public String getReasonCode() { return reasonCode; }
        public void setReasonCode(String reasonCode) { this.reasonCode = reasonCode; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    @PostMapping("/adjustments")
    @Transactional
    public ResponseEntity<StockLevelEntity> createAdjustment(
            @RequestBody AdjustmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        StockLevelEntity level = stockLevelRepository
                .findByProductIdAndLocationId(request.getProductId(), request.getLocationId())
                .orElseGet(() -> new StockLevelEntity(
                        null,
                        request.getProductId(),
                        request.getLocationId(),
                        0,
                        0,
                        0,
                        "A-01-01",
                        Instant.now()
                ));

        level.setOnHand(Math.max(0, level.getOnHand() + request.getQuantityDelta()));
        level.setUpdatedAt(Instant.now());
        StockLevelEntity savedLevel = stockLevelRepository.save(level);

        String movementNumber = "MOV-" + System.currentTimeMillis();
        String movementType = request.getQuantityDelta() >= 0 ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT";

        InventoryMovementEntity movement = new InventoryMovementEntity(
                null,
                movementNumber,
                movementType,
                request.getProductId(),
                request.getLocationId(),
                Math.abs(request.getQuantityDelta()),
                0.0,
                "ADJUSTMENT",
                request.getReasonCode(),
                request.getNotes(),
                userDetails != null ? userDetails.getUsername() : "SYSTEM",
                Instant.now()
        );
        movementRepository.save(movement);

        return ResponseEntity.ok(savedLevel);
    }

    @GetMapping("/transfers")
    public ResponseEntity<List<StockTransferEntity>> getTransfers() {
        return ResponseEntity.ok(transferRepository.findAll());
    }
}
