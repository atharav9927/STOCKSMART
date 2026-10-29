package io.stocksmart.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrderEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String poNumber;

    @Column(nullable = false)
    private String supplierId;

    @Column(nullable = false)
    private String locationId;

    @Column(nullable = false)
    private String status = "DRAFT";

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<PurchaseOrderItemEntity> items = new ArrayList<>();

    private double subtotal = 0.0;
    private double taxAmount = 0.0;
    private double shippingCost = 0.0;
    private double totalAmount = 0.0;
    private LocalDate expectedDeliveryDate;
    private String notes;
    private String createdBy;
    private Instant createdAt = Instant.now();

    public PurchaseOrderEntity() {}

    public PurchaseOrderEntity(String id, String poNumber, String supplierId, String locationId, String status, List<PurchaseOrderItemEntity> items, double subtotal, double taxAmount, double shippingCost, double totalAmount, LocalDate expectedDeliveryDate, String notes, String createdBy, Instant createdAt) {
        this.id = id;
        this.poNumber = poNumber;
        this.supplierId = supplierId;
        this.locationId = locationId;
        this.status = status != null ? status : "DRAFT";
        this.items = items != null ? items : new ArrayList<>();
        this.subtotal = subtotal;
        this.taxAmount = taxAmount;
        this.shippingCost = shippingCost;
        this.totalAmount = totalAmount;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.notes = notes;
        this.createdBy = createdBy;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }

    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<PurchaseOrderItemEntity> getItems() { return items; }
    public void setItems(List<PurchaseOrderItemEntity> items) { this.items = items; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(double taxAmount) { this.taxAmount = taxAmount; }

    public double getShippingCost() { return shippingCost; }
    public void setShippingCost(double shippingCost) { this.shippingCost = shippingCost; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public void addItem(PurchaseOrderItemEntity item) {
        items.add(item);
        item.setPurchaseOrder(this);
    }
}
