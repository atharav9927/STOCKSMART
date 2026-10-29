package io.stocksmart.backend.controller;

import io.stocksmart.backend.entity.AuditLogEntity;
import io.stocksmart.backend.entity.UserEntity;
import io.stocksmart.backend.repository.AuditLogRepository;
import io.stocksmart.backend.repository.ProductRepository;
import io.stocksmart.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final ProductRepository productRepository;

    public AdminController(UserRepository userRepository, AuditLogRepository auditLogRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLogEntity>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findTop100ByOrderByTimestampDesc());
    }

    public static class SystemStats {
        private long totalUsers;
        private long totalProducts;
        private long totalAuditLogs;
        private String systemStatus;

        public SystemStats() {}
        public SystemStats(long totalUsers, long totalProducts, long totalAuditLogs, String systemStatus) {
            this.totalUsers = totalUsers;
            this.totalProducts = totalProducts;
            this.totalAuditLogs = totalAuditLogs;
            this.systemStatus = systemStatus;
        }

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

        public long getTotalProducts() { return totalProducts; }
        public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

        public long getTotalAuditLogs() { return totalAuditLogs; }
        public void setTotalAuditLogs(long totalAuditLogs) { this.totalAuditLogs = totalAuditLogs; }

        public String getSystemStatus() { return systemStatus; }
        public void setSystemStatus(String systemStatus) { this.systemStatus = systemStatus; }
    }

    @GetMapping("/stats")
    public ResponseEntity<SystemStats> getStats() {
        return ResponseEntity.ok(new SystemStats(
                userRepository.count(),
                productRepository.count(),
                auditLogRepository.count(),
                "OPERATIONAL"
        ));
    }
}
