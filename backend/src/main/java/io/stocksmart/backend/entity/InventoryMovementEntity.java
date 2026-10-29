package io.stocksmart.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventory_movements")
public class InventoryMovementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String movementNumber;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private String locationId;

    @Column(nullable = false)
    private int quantity;

    private double unitCost;
    private String referenceType;
    private String referenceId;
    private String notes;
    private String performedBy;
    private Instant timestamp = Instant.now();

    public InventoryMovementEntity() {}

    public InventoryMovementEntity(String id, String movementNumber, String type, String productId, String locationId, int quantity, double unitCost, String referenceType, String referenceId, String notes, String performedBy, Instant timestamp) {
        this.id = id;
        this.movementNumber = movementNumber;
        this.type = type;
        this.productId = productId;
        this.locationId = locationId;
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.referenceType = referenceType;
        this.referenceId = referenceId;
        this.notes = notes;
        this.performedBy = performedBy;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMovementNumber() { return movementNumber; }
    public void setMovementNumber(String movementNumber) { this.movementNumber = movementNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitCost() { return unitCost; }
    public void setUnitCost(double unitCost) { this.unitCost = unitCost; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
