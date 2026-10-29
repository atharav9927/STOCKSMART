package io.stocksmart.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "locations")
public class LocationEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    private String address;

    private int totalCapacity = 10000;

    private boolean active = true;

    private boolean isPrimary = false;

    private Instant createdAt = Instant.now();

    public LocationEntity() {}

    public LocationEntity(String id, String code, String name, String type, String address, int totalCapacity, boolean active, boolean isPrimary, Instant createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = type;
        this.address = address;
        this.totalCapacity = totalCapacity;
        this.active = active;
        this.isPrimary = isPrimary;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
