package io.stocksmart.backend.controller;

import io.stocksmart.backend.entity.InventoryMovementEntity;
import io.stocksmart.backend.entity.PurchaseOrderEntity;
import io.stocksmart.backend.entity.StockLevelEntity;
import io.stocksmart.backend.repository.InventoryMovementRepository;
import io.stocksmart.backend.repository.PurchaseOrderRepository;
import io.stocksmart.backend.repository.StockLevelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/procurement")
public class ProcurementController {

    private final PurchaseOrderRepository poRepository;
    private final StockLevelRepository stockLevelRepository;
    private final InventoryMovementRepository movementRepository;

    public ProcurementController(PurchaseOrderRepository poRepository, StockLevelRepository stockLevelRepository, InventoryMovementRepository movementRepository) {
        this.poRepository = poRepository;
        this.stockLevelRepository = stockLevelRepository;
        this.movementRepository = movementRepository;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<PurchaseOrderEntity>> getPurchaseOrders() {
        return ResponseEntity.ok(poRepository.findAll());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<PurchaseOrderEntity> getOrderById(@PathVariable String id) {
        return poRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/orders")
    public ResponseEntity<PurchaseOrderEntity> createOrder(
            @RequestBody PurchaseOrderEntity po,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (po.getId() == null || po.getId().isBlank()) {
            po.setId("po-" + System.currentTimeMillis());
        }
        if (po.getPoNumber() == null || po.getPoNumber().isBlank()) {
            po.setPoNumber("PO-" + System.currentTimeMillis() % 100000);
        }
        po.setCreatedBy(userDetails != null ? userDetails.getUsername() : "BUYER");
        return ResponseEntity.ok(poRepository.save(po));
    }

    public static class GoodsReceiptItemDto {
        private String poItemId;
        private String productId;
        private int received;
        private int damaged;

        public GoodsReceiptItemDto() {}

        public String getPoItemId() { return poItemId; }
        public void setPoItemId(String poItemId) { this.poItemId = poItemId; }

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public int getReceived() { return received; }
        public void setReceived(int received) { this.received = received; }

        public int getDamaged() { return damaged; }
        public void setDamaged(int damaged) { this.damaged = damaged; }
    }

    public static class GoodsReceiptRequest {
        private List<GoodsReceiptItemDto> items;
        private String notes;

        public GoodsReceiptRequest() {}

        public List<GoodsReceiptItemDto> getItems() { return items; }
        public void setItems(List<GoodsReceiptItemDto> items) { this.items = items; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    @PostMapping("/orders/{id}/receive")
    @Transactional
    public ResponseEntity<PurchaseOrderEntity> receiveGoods(
            @PathVariable String id,
            @RequestBody GoodsReceiptRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        PurchaseOrderEntity po = poRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found: " + id));

        if (request.getItems() != null) {
            for (GoodsReceiptItemDto itemDto : request.getItems()) {
                if (itemDto.getReceived() > 0) {
                    StockLevelEntity stock = stockLevelRepository
                            .findByProductIdAndLocationId(itemDto.getProductId(), po.getLocationId())
                            .orElseGet(() -> new StockLevelEntity(
                                    null,
                                    itemDto.getProductId(),
                                    po.getLocationId(),
                                    0,
                                    0,
                                    0,
                                    "DOCK-IN",
                                    Instant.now()
                            ));

                    stock.setOnHand(stock.getOnHand() + itemDto.getReceived());
                    stock.setUpdatedAt(Instant.now());
                    stockLevelRepository.save(stock);

                    InventoryMovementEntity movement = new InventoryMovementEntity(
                            null,
                            "MOV-" + System.currentTimeMillis() + "-" + itemDto.getProductId(),
                            "PURCHASE_RECEIPT",
                            itemDto.getProductId(),
                            po.getLocationId(),
                            itemDto.getReceived(),
                            0.0,
                            "PO_RECEIPT",
                            po.getPoNumber(),
                            request.getNotes() != null ? request.getNotes() : "Goods receipt check-in",
                            userDetails != null ? userDetails.getUsername() : "DOCK_CLERK",
                            Instant.now()
                    );
                    movementRepository.save(movement);
                }
            }
        }

        po.setStatus("RECEIVED");
        return ResponseEntity.ok(poRepository.save(po));
    }
}
