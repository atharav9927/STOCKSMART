package io.stocksmart.backend.init;

import io.stocksmart.backend.entity.*;
import io.stocksmart.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final StockLevelRepository stockLevelRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            LocationRepository locationRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            SupplierRepository supplierRepository,
            ProductRepository productRepository,
            StockLevelRepository stockLevelRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.stockLevelRepository = stockLevelRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping seeder.");
            return;
        }

        log.info("Seeding StockSmart default master data and credentials...");

        // 1. Seed Users
        String encodedPassword = passwordEncoder.encode("password");

        userRepository.save(new UserEntity(
                "usr-admin",
                "admin@stocksmart.io",
                encodedPassword,
                "Alex Mercer",
                Role.ADMIN,
                List.of("loc-1", "loc-2", "loc-3", "loc-4", "loc-5", "loc-6"),
                true,
                Instant.now(),
                null
        ));

        userRepository.save(new UserEntity(
                "usr-mgr",
                "manager@stocksmart.io",
                encodedPassword,
                "Elena Rostova",
                Role.INVENTORY_MANAGER,
                List.of("loc-1", "loc-2", "loc-3", "loc-4"),
                true,
                Instant.now(),
                null
        ));

        userRepository.save(new UserEntity(
                "usr-buyer",
                "buyer@stocksmart.io",
                encodedPassword,
                "Marcus Vance",
                Role.BUYER,
                List.of("loc-1", "loc-2"),
                true,
                Instant.now(),
                null
        ));

        userRepository.save(new UserEntity(
                "usr-clerk",
                "clerk@stocksmart.io",
                encodedPassword,
                "Sarah Lin",
                Role.STORE_CLERK,
                List.of("loc-1"),
                true,
                Instant.now(),
                null
        ));

        userRepository.save(new UserEntity(
                "usr-viewer",
                "viewer@stocksmart.io",
                encodedPassword,
                "David Kim",
                Role.VIEWER,
                List.of("loc-1", "loc-5"),
                true,
                Instant.now(),
                null
        ));

        // 2. Seed Locations
        LocationEntity cdc = locationRepository.save(new LocationEntity(
                "loc-1", "CDC", "Central Distribution Center (CDC)", "DISTRIBUTION_CENTER", "450 Logistics Parkway, Dallas, TX", 50000, true, true, Instant.now()
        ));

        LocationEntity nrh = locationRepository.save(new LocationEntity(
                "loc-2", "NRH", "North Regional Hub (NRH)", "WAREHOUSE", "1200 Industrial Way, Chicago, IL", 30000, true, false, Instant.now()
        ));

        LocationEntity srh = locationRepository.save(new LocationEntity(
                "loc-3", "SRH", "South Regional Hub (SRH)", "WAREHOUSE", "880 Freight Lane, Atlanta, GA", 25000, true, false, Instant.now()
        ));

        LocationEntity wfd = locationRepository.save(new LocationEntity(
                "loc-4", "WFD", "West Fulfillment Depot (WFD)", "WAREHOUSE", "310 Harbor Blvd, Long Beach, CA", 28000, true, false, Instant.now()
        ));

        LocationEntity store1 = locationRepository.save(new LocationEntity(
                "loc-5", "STR-101", "Flagship Store #101", "RETAIL_STORE", "750 5th Avenue, New York, NY", 5000, true, false, Instant.now()
        ));

        LocationEntity store2 = locationRepository.save(new LocationEntity(
                "loc-6", "STR-204", "Metro Express Store #204", "RETAIL_STORE", "104 Market Street, San Francisco, CA", 3500, true, false, Instant.now()
        ));

        // 3. Seed Categories & Brands
        CategoryEntity catElectronics = categoryRepository.save(new CategoryEntity(
                "cat-1", "Industrial Electronics", "industrial-electronics", null, "industrial-electronics", 0, 0, Instant.now()
        ));

        CategoryEntity catPackaging = categoryRepository.save(new CategoryEntity(
                "cat-2", "Packaging & Thermal Media", "packaging-thermal", null, "packaging-thermal", 0, 1, Instant.now()
        ));

        BrandEntity brandApex = brandRepository.save(new BrandEntity(
                "brd-1", "Apex Systems", "APEX", true, Instant.now()
        ));

        BrandEntity brandZebra = brandRepository.save(new BrandEntity(
                "brd-2", "Zebra Technologies", "ZBR", true, Instant.now()
        ));

        // 4. Seed Suppliers
        supplierRepository.save(new SupplierEntity(
                "sup-1", "SUP-APEX", "Apex Electronics Global", "Jonathan Vance", "orders@apexelectronics.com", "+1 (555) 234-5678", 5, 4.9, 1000.0, true, Instant.now()
        ));

        supplierRepository.save(new SupplierEntity(
                "sup-2", "SUP-VANGUARD", "Vanguard Industrial Supplies", "Rachel Adams", "sales@vanguardindustrial.com", "+1 (555) 876-5432", 7, 4.7, 500.0, true, Instant.now()
        ));

        // 5. Seed 25 Core Products with Barcodes and Stock Allocations
        for (int i = 1; i <= 25; i++) {
            String sku = String.format("SKU-%05d", i);
            String barcode1 = String.format("89012345%04d", i);
            String barcode2 = String.format("78098765%04d", i);
            double cost = 25.0 + (i * 12.5);
            double price = cost * 1.45;

            ProductEntity prod = productRepository.save(new ProductEntity(
                    "prod-" + i,
                    sku,
                    i % 2 == 0 ? "Thermal Barcode Terminal T-" + (100 + i) : "Pro Industrial Scanner Core " + (50 + i),
                    "High-durability operations equipment for warehouse telemetry and inventory scanning.",
                    i % 2 == 0 ? catPackaging.getId() : catElectronics.getId(),
                    i % 2 == 0 ? brandZebra.getId() : brandApex.getId(),
                    price,
                    cost,
                    15,
                    300,
                    30,
                    60,
                    Arrays.asList(barcode1, barcode2),
                    "ACTIVE",
                    Instant.now(),
                    Instant.now()
            ));

            stockLevelRepository.save(new StockLevelEntity(
                    null,
                    prod.getId(),
                    cdc.getId(),
                    80 + (i * 3),
                    10,
                    5,
                    String.format("A-%02d-01", (i % 15) + 1),
                    Instant.now()
            ));

            stockLevelRepository.save(new StockLevelEntity(
                    null,
                    prod.getId(),
                    nrh.getId(),
                    35 + (i * 2),
                    4,
                    0,
                    String.format("B-%02d-02", (i % 10) + 1),
                    Instant.now()
            ));

            stockLevelRepository.save(new StockLevelEntity(
                    null,
                    prod.getId(),
                    store1.getId(),
                    12 + (i % 8),
                    2,
                    0,
                    String.format("STR-%02d", (i % 5) + 1),
                    Instant.now()
            ));
        }

        log.info("Data seeding completed. 5 users, 6 facilities, 25 products, and stock matrix initialized.");
    }
}
