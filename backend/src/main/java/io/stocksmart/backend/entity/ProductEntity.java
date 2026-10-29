package io.stocksmart.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class ProductEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String categoryId;
    private String brandId;

    @Column(nullable = false)
    private double unitPrice;

    @Column(nullable = false)
    private double unitCost;

    private int minStockLevel = 10;
    private int maxStockLevel = 500;
    private int reorderPoint = 25;
    private int reorderQuantity = 50;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_barcodes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "barcode")
    private List<String> barcodes = new ArrayList<>();

    private String status = "ACTIVE";
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public ProductEntity() {}

    public ProductEntity(String id, String sku, String name, String description, String categoryId, String brandId, double unitPrice, double unitCost, int minStockLevel, int maxStockLevel, int reorderPoint, int reorderQuantity, List<String> barcodes, String status, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.brandId = brandId;
        this.unitPrice = unitPrice;
        this.unitCost = unitCost;
        this.minStockLevel = minStockLevel;
        this.maxStockLevel = maxStockLevel;
        this.reorderPoint = reorderPoint;
        this.reorderQuantity = reorderQuantity;
        this.barcodes = barcodes != null ? barcodes : new ArrayList<>();
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getBrandId() { return brandId; }
    public void setBrandId(String brandId) { this.brandId = brandId; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public double getUnitCost() { return unitCost; }
    public void setUnitCost(double unitCost) { this.unitCost = unitCost; }

    public int getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(int minStockLevel) { this.minStockLevel = minStockLevel; }

    public int getMaxStockLevel() { return maxStockLevel; }
    public void setMaxStockLevel(int maxStockLevel) { this.maxStockLevel = maxStockLevel; }

    public int getReorderPoint() { return reorderPoint; }
    public void setReorderPoint(int reorderPoint) { this.reorderPoint = reorderPoint; }

    public int getReorderQuantity() { return reorderQuantity; }
    public void setReorderQuantity(int reorderQuantity) { this.reorderQuantity = reorderQuantity; }

    public List<String> getBarcodes() { return barcodes; }
    public void setBarcodes(List<String> barcodes) { this.barcodes = barcodes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
