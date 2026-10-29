package io.stocksmart.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "stock_levels", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"productId", "locationId"})
})
public class StockLevelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private String locationId;

    private int onHand = 0;
    private int allocated = 0;
    private int reserved = 0;
    private String binLocation = "A-01-01";
    private Instant updatedAt = Instant.now();

    public StockLevelEntity() {}

    public StockLevelEntity(String id, String productId, String locationId, int onHand, int allocated, int reserved, String binLocation, Instant updatedAt) {
        this.id = id;
        this.productId = productId;
        this.locationId = locationId;
        this.onHand = onHand;
        this.allocated = allocated;
        this.reserved = reserved;
        this.binLocation = binLocation != null ? binLocation : "A-01-01";
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public int getOnHand() { return onHand; }
    public void setOnHand(int onHand) { this.onHand = onHand; }

    public int getAllocated() { return allocated; }
    public void setAllocated(int allocated) { this.allocated = allocated; }

    public int getReserved() { return reserved; }
    public void setReserved(int reserved) { this.reserved = reserved; }

    public String getBinLocation() { return binLocation; }
    public void setBinLocation(String binLocation) { this.binLocation = binLocation; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public int getAvailable() {
        return Math.max(0, onHand - allocated - reserved);
    }
}
