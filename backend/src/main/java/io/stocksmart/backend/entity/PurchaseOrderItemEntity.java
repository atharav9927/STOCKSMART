package io.stocksmart.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "purchase_order_items")
public class PurchaseOrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    @JsonIgnore
    private PurchaseOrderEntity purchaseOrder;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private int quantityOrdered;

    private int quantityReceived = 0;
    private int quantityDamaged = 0;

    @Column(nullable = false)
    private double unitCost;

    @Column(nullable = false)
    private double totalCost;

    public PurchaseOrderItemEntity() {}

    public PurchaseOrderItemEntity(String id, PurchaseOrderEntity purchaseOrder, String productId, int quantityOrdered, int quantityReceived, int quantityDamaged, double unitCost, double totalCost) {
        this.id = id;
        this.purchaseOrder = purchaseOrder;
        this.productId = productId;
        this.quantityOrdered = quantityOrdered;
        this.quantityReceived = quantityReceived;
        this.quantityDamaged = quantityDamaged;
        this.unitCost = unitCost;
        this.totalCost = totalCost;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public PurchaseOrderEntity getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrderEntity purchaseOrder) { this.purchaseOrder = purchaseOrder; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public int getQuantityOrdered() { return quantityOrdered; }
    public void setQuantityOrdered(int quantityOrdered) { this.quantityOrdered = quantityOrdered; }

    public int getQuantityReceived() { return quantityReceived; }
    public void setQuantityReceived(int quantityReceived) { this.quantityReceived = quantityReceived; }

    public int getQuantityDamaged() { return quantityDamaged; }
    public void setQuantityDamaged(int quantityDamaged) { this.quantityDamaged = quantityDamaged; }

    public double getUnitCost() { return unitCost; }
    public void setUnitCost(double unitCost) { this.unitCost = unitCost; }

    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }
}
