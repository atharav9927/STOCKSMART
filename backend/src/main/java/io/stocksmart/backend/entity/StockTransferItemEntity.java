package io.stocksmart.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "stock_transfer_items")
public class StockTransferItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transfer_id", nullable = false)
    @JsonIgnore
    private StockTransferEntity transfer;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private int quantityRequested;

    private int quantityDispatched = 0;
    private int quantityReceived = 0;

    public StockTransferItemEntity() {}

    public StockTransferItemEntity(String id, StockTransferEntity transfer, String productId, int quantityRequested, int quantityDispatched, int quantityReceived) {
        this.id = id;
        this.transfer = transfer;
        this.productId = productId;
        this.quantityRequested = quantityRequested;
        this.quantityDispatched = quantityDispatched;
        this.quantityReceived = quantityReceived;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public StockTransferEntity getTransfer() { return transfer; }
    public void setTransfer(StockTransferEntity transfer) { this.transfer = transfer; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public int getQuantityRequested() { return quantityRequested; }
    public void setQuantityRequested(int quantityRequested) { this.quantityRequested = quantityRequested; }

    public int getQuantityDispatched() { return quantityDispatched; }
    public void setQuantityDispatched(int quantityDispatched) { this.quantityDispatched = quantityDispatched; }

    public int getQuantityReceived() { return quantityReceived; }
    public void setQuantityReceived(int quantityReceived) { this.quantityReceived = quantityReceived; }
}
