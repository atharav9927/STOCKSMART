package io.stocksmart.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock_transfers")
public class StockTransferEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String transferNumber;

    @Column(nullable = false)
    private String sourceLocationId;

    @Column(nullable = false)
    private String destinationLocationId;

    @Column(nullable = false)
    private String status = "DRAFT";

    @OneToMany(mappedBy = "transfer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<StockTransferItemEntity> items = new ArrayList<>();

    private String notes;
    private String trackingNumber;
    private String requestedBy;
    private Instant createdAt = Instant.now();

    public StockTransferEntity() {}

    public StockTransferEntity(String id, String transferNumber, String sourceLocationId, String destinationLocationId, String status, List<StockTransferItemEntity> items, String notes, String trackingNumber, String requestedBy, Instant createdAt) {
        this.id = id;
        this.transferNumber = transferNumber;
        this.sourceLocationId = sourceLocationId;
        this.destinationLocationId = destinationLocationId;
        this.status = status != null ? status : "DRAFT";
        this.items = items != null ? items : new ArrayList<>();
        this.notes = notes;
        this.trackingNumber = trackingNumber;
        this.requestedBy = requestedBy;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTransferNumber() { return transferNumber; }
    public void setTransferNumber(String transferNumber) { this.transferNumber = transferNumber; }

    public String getSourceLocationId() { return sourceLocationId; }
    public void setSourceLocationId(String sourceLocationId) { this.sourceLocationId = sourceLocationId; }

    public String getDestinationLocationId() { return destinationLocationId; }
    public void setDestinationLocationId(String destinationLocationId) { this.destinationLocationId = destinationLocationId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<StockTransferItemEntity> getItems() { return items; }
    public void setItems(List<StockTransferItemEntity> items) { this.items = items; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public void addItem(StockTransferItemEntity item) {
        items.add(item);
        item.setTransfer(this);
    }
}
