# StockSmart — Retail Inventory Optimization System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Angular](https://img.shields.io/badge/Angular-17.3-red.svg)](https://angular.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%2B-blue.svg)]()
[![Design System](https://img.shields.io/badge/Design_System-Nothing_OS-black.svg)]()
[![GitHub Pages](https://img.shields.io/badge/demo-live_on_github_pages-brightgreen.svg)](https://atharav9927.github.io/STOCKSMART/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)]()

> **StockSmart** is a dense, high-performance retail inventory optimization and operations management platform designed for warehouse and store personnel. Built with the **Nothing OS / Swiss industrial design language** (`Doto`, `Space Grotesk`, `Space Mono` typography, monochromatic canvas, zero gradients/shadows, and signal-red alerts), it combines an **Angular 17+** signal-based frontend with a robust **Spring Boot 3 REST API** supporting dual H2 in-memory local dev and production PostgreSQL persistence.

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: [https://github.com/atharav9927/STOCKSMART](https://github.com/atharav9927/STOCKSMART)
- **Live Demo (GitHub Pages)**: [https://atharav9927.github.io/STOCKSMART/](https://atharav9927.github.io/STOCKSMART/)
- **Landing Page**: Real-time telemetry, 6 connected hubs, system architecture, and 1-click role demo launcher.
- **Operator Login**: Form-validated credentials with bypass profile switcher and password recovery flows.

---

## 🏛️ System Architecture

```
STOCKSMART (Monorepo)
├── src/                          # Angular 17+ Standalone Frontend
│   ├── app/
│   │   ├── core/                 # Auth, JWT & error interceptors, guards, models
│   │   ├── features/             # 12 lazy-loaded operational modules (42 pages)
│   │   │   ├── admin/            # Users, RBAC permissions, audit log, data backup
│   │   │   ├── alerts/           # Notification center, threshold rules
│   │   │   ├── auth/             # Login, profile, password recovery
│   │   │   ├── catalog/          # Products, categories tree (CDK drag/drop), thermal labels
│   │   │   ├── dashboard/        # Executive command, facility-specific dashboards
│   │   │   ├── identification/   # Master barcodes registry, UHF RFID dock portal simulator
│   │   │   ├── inventory/        # Stock matrix, transfers, adjustments, cycle counts
│   │   │   ├── orders/           # Outbound queue, pick-pack-ship, reverse RMA, POS register
│   │   │   ├── procurement/      # PO requisition, goods receipt check-in, vendor returns (RTV)
│   │   │   ├── reports/          # KPIs, inventory valuation, stockouts, shrinkage analysis
│   │   │   ├── scan/             # Wedge scanner & ZXing video camera scanner
│   │   │   └── suppliers/        # Scorecards, price matrices, vendor comparisons
│   │   └── shared/               # Reusable Nothing OS components & FormKit
│   └── styles/                   # Design tokens, typography, OLED palette
│
├── backend/                      # Spring Boot 3.3.5 REST API (Java 21/25)
│   ├── src/main/java/io/stocksmart/backend/
│   │   ├── config/               # SecurityFilterChain, CORS, BCrypt
│   │   ├── controller/           # REST endpoints (/api/auth, /api/catalog, /api/inventory, etc.)
│   │   ├── entity/               # JPA entities (Users, Products, StockLevels, Movements, etc.)
│   │   ├── init/                 # Auto-seeder (5 default users, 6 hubs, 25 SKUs)
│   │   ├── repository/           # Spring Data JPA repositories
│   │   ├── security/             # JWT Token Provider, JwtAuthenticationFilter
│   │   └── service/              # Core business logic
│   ├── src/main/resources/       # application.yml (dual H2/PostgreSQL profiles)
│   └── pom.xml                   # Maven dependencies & build configuration
│
├── render.yaml                   # 1-Click Render Cloud Deployment Blueprint
├── server.js                     # Express 5 production static server with gzip & SPA fallback
└── DESIGN.md                     # Aesthetic specification and design token manual
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: v18.x or v20+
- **Java**: JDK 21 or JDK 25
- **Maven**: Pre-packaged via `./mvnw` (no manual Maven install required)

### 1. Run the Frontend (Port 4200)
```powershell
# From root directory
npm install
npm start
# Available at: http://localhost:4200
```

### 2. Run the Spring Boot Backend (Port 8080)
```powershell
cd backend
./mvnw spring-boot:run
# Available at: http://localhost:8080
# H2 Database Console: http://localhost:8080/h2-console
```

---

## 🔑 Default Credentials & Role Clearance

| Role | Email | Password | Assigned Scope |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@stocksmart.io` | `password` | Unrestricted clearance across all 6 facilities |
| **Inventory Manager** | `manager@stocksmart.io` | `password` | Stock adjustments, PO approvals, count reconciliations |
| **Procurement Buyer** | `buyer@stocksmart.io` | `password` | PO generation, vendor returns, supplier price comparisons |
| **Store Clerk** | `clerk@stocksmart.io` | `password` | Scoped to assigned warehouse, barcode pick-pack-ship |
| **Viewer** | `viewer@stocksmart.io` | `password` | Read-only access to catalog, stock matrix, and reports |

---

## 📱 Hardware & Scanning Features

1. **Camera Barcode Scanner (ZXing)**:
   - Live video viewfinder modal with Nothing OS red laser scanning reticle.
   - Decodes UPC-A, EAN-13, Code 128, and QR codes directly using device webcams or smartphone rear cameras.
2. **Keyboard-Wedge Auto-Focus**:
   - Traps high-speed laser wedge barcode guns without requiring field re-focusing.
3. **Web Audio Oscillator API**:
   - Dual-tone synthesized sound pulses (880 Hz success beep / 220 Hz error buzz).
4. **Thermal Label Generator**:
   - 12-up printable label sheets formatted for standard Avery and Zebra thermal roll printers.
5. **Fixed Dock UHF RFID Portal Simulator**:
   - Multi-tag burst EPC tag ingestion with real-time RSSI signal strength meters.

---

## 🌐 Deploy to Render (1-Click Blueprint)

The repository includes a production-tested [`render.yaml`](./render.yaml) blueprint:

1. Push this repository to your GitHub account:
   ```powershell
   git remote add origin https://github.com/<your-username>/STOCKSMART.git
   git push -u origin main
   ```
2. Log into [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ click **New +** $\rightarrow$ **Blueprint**.
3. Select `STOCKSMART`. Render automatically provisions:
   - **`stocksmart-frontend`**: Static Site with global CDN, SSL, and SPA rewrite rules.
   - **`stocksmart-api`**: Java 21 web service running the Spring Boot executable jar.
   - **`stocksmart-db`**: Managed PostgreSQL database.

---

## 🛡️ License
Released under the [MIT License](LICENSE).
