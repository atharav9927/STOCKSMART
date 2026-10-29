import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing">
      <!-- Top Navigation -->
      <header class="landing-header">
        <div class="header-brand">
          <span class="status-dot"></span>
          <span class="brand-text">STOCKSMART</span>
          <span class="brand-badge text-mono">OS//v1.0</span>
        </div>

        <nav class="header-nav">
          <a href="#capabilities" class="nav-link">CAPABILITIES</a>
          <a href="#architecture" class="nav-link">ARCHITECTURE</a>
          <a href="#roles" class="nav-link">ROLES</a>
          <a href="https://github.com/atharavagarwal/STOCKSMART" target="_blank" rel="noopener" class="nav-link">GITHUB</a>
        </nav>

        <div class="header-actions">
          @if (auth.isLoggedIn()) {
            <a routerLink="/dashboard" class="btn btn--primary">
              [ ENTER CONSOLE: {{ auth.userName() }} ]
            </a>
          } @else {
            <a routerLink="/login" class="btn btn--outline btn--sm">
              [ OPERATOR LOGIN ]
            </a>
            <button class="btn btn--primary btn--sm" (click)="quickLogin('admin')">
              [ QUICK DEMO ]
            </button>
          }
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-status">
          <span class="text-label text-mono">[ TELEMETRY ACTIVE // 6 HUBS SYNCED ]</span>
        </div>

        <h1 class="hero-title">
          PRECISION INVENTORY<br />
          <span class="hero-title--accent">OPTIMIZATION ENGINE.</span>
        </h1>

        <p class="hero-subtitle">
          A high-density operational platform built for warehouse floors, multi-facility distribution centers, and retail storefronts. High-contrast monochromatic typography with color reserved strictly as signal.
        </p>

        <div class="hero-cta">
          <button class="btn btn--primary btn--lg" (click)="quickLogin('admin')">
            [ LAUNCH TERMINAL (ADMIN) ]
          </button>
          <a routerLink="/login" class="btn btn--outline btn--lg">
            [ ROLE CLEARANCE LOGIN ]
          </a>
          <a href="https://github.com/atharavagarwal/STOCKSMART" target="_blank" rel="noopener" class="btn btn--ghost btn--lg">
            [ VIEW SOURCE CODE ]
          </a>
        </div>

        <!-- Telemetry Stats Strip -->
        <div class="telemetry-strip">
          <div class="telemetry-item">
            <span class="telemetry-val text-display">520</span>
            <span class="telemetry-lbl text-label">SKUS IN MATRIX</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-val text-display">6</span>
            <span class="telemetry-lbl text-label">CONNECTED HUBS</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-val text-display">99.8%</span>
            <span class="telemetry-lbl text-label">PICK ACCURACY</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-val text-display">&lt; 50ms</span>
            <span class="telemetry-lbl text-label">WEDGE LATENCY</span>
          </div>
        </div>
      </section>

      <!-- Capabilities Grid -->
      <section id="capabilities" class="section">
        <div class="section-header">
          <span class="text-label text-secondary">MODULAR CAPABILITIES</span>
          <h2 class="section-title text-display">DESIGNED FOR HIGH-SPEED LOGISTICS</h2>
        </div>

        <div class="capabilities-grid">
          <div class="cap-card">
            <div class="cap-header">
              <span class="cap-num text-mono">01</span>
              <span class="cap-tag">MATRIX</span>
            </div>
            <h3 class="cap-title">2D SKU Allocation Matrix</h3>
            <p class="cap-desc">
              Real-time visualization of available, allocated, and reserved stock units across 6 regional warehouses with auto-replenishment triggers.
            </p>
          </div>

          <div class="cap-card">
            <div class="cap-header">
              <span class="cap-num text-mono">02</span>
              <span class="cap-tag">SCANNING</span>
            </div>
            <h3 class="cap-title">Camera & Wedge Scanning</h3>
            <p class="cap-desc">
              Hardware keyboard-wedge capture with audio frequency oscillator feedback plus live camera video barcode scanning via ZXing with reticle targeting.
            </p>
          </div>

          <div class="cap-card">
            <div class="cap-header">
              <span class="cap-num text-mono">03</span>
              <span class="cap-tag">FULFILMENT</span>
            </div>
            <h3 class="cap-title">Pick-Pack-Ship Lifecycle</h3>
            <p class="cap-desc">
              Rigorous 3-step barcode verification preventing packing errors, integrated customer returns (RMA), and instant cashier POS terminal.
            </p>
          </div>

          <div class="cap-card">
            <div class="cap-header">
              <span class="cap-num text-mono">04</span>
              <span class="cap-tag">PURCHASING</span>
            </div>
            <h3 class="cap-title">Procurement & RTV Claims</h3>
            <p class="cap-desc">
              Multi-line PO generation, dock goods receipt recording short/damaged delivery tallies, and Vendor Returns for credit notes.
            </p>
          </div>

          <div class="cap-card">
            <div class="cap-header">
              <span class="cap-num text-mono">05</span>
              <span class="cap-tag">AUDIT</span>
            </div>
            <h3 class="cap-title">Immutable Ledger & Shrinkage</h3>
            <p class="cap-desc">
              Append-only movement transactions, cycle count discrepancy reconciliation, and shrinkage analysis by damage, expiry, or pilferage.
            </p>
          </div>

          <div class="cap-card">
            <div class="cap-header">
              <span class="cap-num text-mono">06</span>
              <span class="cap-tag">SECURITY</span>
            </div>
            <h3 class="cap-title">Granular RBAC Matrix</h3>
            <p class="cap-desc">
              5 role clearance levels with facility location scoping, preventing store clerks from modifying procurement or executive financial reports.
            </p>
          </div>
        </div>
      </section>

      <!-- Roles & 1-Click Launch -->
      <section id="roles" class="section">
        <div class="section-header">
          <span class="text-label text-secondary">ROLE-BASED CLEARANCE</span>
          <h2 class="section-title text-display">ONE-CLICK DEMO ACCESS</h2>
        </div>

        <div class="roles-grid">
          <div class="role-box" (click)="quickLogin('admin')">
            <div class="role-box__top">
              <span class="badge badge--danger">ADMIN</span>
              <span class="text-caption text-secondary">FULL ACCESS</span>
            </div>
            <span class="role-name">System Administrator</span>
            <p class="role-desc">Catalog master data, security policy matrix, audit logs, and data operations.</p>
            <button class="btn btn--outline btn--sm">[ LAUNCH AS ADMIN ]</button>
          </div>

          <div class="role-box" (click)="quickLogin('inventory_manager')">
            <div class="role-box__top">
              <span class="badge badge--warning">MANAGER</span>
              <span class="text-caption text-secondary">OPERATIONS</span>
            </div>
            <span class="role-name">Inventory Manager</span>
            <p class="role-desc">Stock matrix, transfer approvals, discrepancy write-offs, and count audits.</p>
            <button class="btn btn--outline btn--sm">[ LAUNCH AS MANAGER ]</button>
          </div>

          <div class="role-box" (click)="quickLogin('buyer')">
            <div class="role-box__top">
              <span class="badge badge--info">BUYER</span>
              <span class="text-caption text-secondary">PURCHASING</span>
            </div>
            <span class="role-name">Procurement Specialist</span>
            <p class="role-desc">Supplier negotiations, PO generation, replenishment rules, and vendor returns.</p>
            <button class="btn btn--outline btn--sm">[ LAUNCH AS BUYER ]</button>
          </div>

          <div class="role-box" (click)="quickLogin('store_clerk')">
            <div class="role-box__top">
              <span class="badge badge--transit">CLERK</span>
              <span class="text-caption text-secondary">SCOPED HUB</span>
            </div>
            <span class="role-name">Warehouse Clerk</span>
            <p class="role-desc">Barcode scan lookup, pick-pack-ship fulfilment, and blind cycle counting.</p>
            <button class="btn btn--outline btn--sm">[ LAUNCH AS CLERK ]</button>
          </div>
        </div>
      </section>

      <!-- Architecture Section -->
      <section id="architecture" class="section">
        <div class="section-header">
          <span class="text-label text-secondary">FULL STACK MONOREPO</span>
          <h2 class="section-title text-display">ENGINEERED FOR PRODUCTION</h2>
        </div>

        <div class="arch-box">
          <div class="arch-col">
            <span class="text-label text-primary font-bold">FRONTEND ARCHITECTURE</span>
            <ul class="arch-list text-caption text-secondary">
              <li>Angular 17+ Standalone Components & Signals</li>
              <li>Nothing OS Swiss Industrial Design Tokens</li>
              <li>42 Complete Operational Routes (100% Lazy-Loaded)</li>
              <li>Client-side In-Memory Database with 520 Seeded SKUs</li>
              <li>Camera Video Scanning via ZXing + Keyboard Wedge</li>
            </ul>
          </div>

          <div class="arch-divider"></div>

          <div class="arch-col">
            <span class="text-label text-primary font-bold">BACKEND & DATABASE</span>
            <ul class="arch-list text-caption text-secondary">
              <li>Spring Boot 3.3.5 REST API (Java 21/25)</li>
              <li>Stateless JWT Security & BCrypt Password Encryption</li>
              <li>Dual Profile: In-memory H2 (Local) + PostgreSQL (Cloud)</li>
              <li>Render Monorepo Blueprint (Static + Java + PostgreSQL)</li>
              <li>Automatic Master Data Seeder on First Boot</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-left">
          <span class="status-dot"></span>
          <span class="text-mono font-bold">STOCKSMART OPERATIONS</span>
          <span class="text-caption text-secondary">PRECISION INVENTORY CONTROL</span>
        </div>
        <div class="footer-right text-caption text-secondary">
          <span>NOTHING OS DESIGN PRINCIPLES // SWISS MODERNISM</span>
          <span>MIT LICENSE // 2026</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing {
      min-height: 100vh;
      background: #000000;
      color: #E8E8E8;
      font-family: var(--font-body, 'Space Grotesk', sans-serif);
      display: flex;
      flex-direction: column;
    }

    /* === Header === */
    .landing-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-xl);
      border-bottom: 1px solid #222222;
      position: sticky;
      top: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 100;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #4A9E5C;
      border-radius: 50%;
      box-shadow: 0 0 8px #4A9E5C;
    }
    .brand-text {
      font-family: var(--font-body);
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #FFFFFF;
      font-size: 16px;
    }
    .brand-badge {
      font-size: 11px;
      color: #999999;
      background: #111111;
      padding: 2px 6px;
      border: 1px solid #333333;
    }
    .header-nav {
      display: flex;
      gap: var(--space-lg);
    }
    .nav-link {
      font-family: var(--font-data);
      font-size: 12px;
      color: #999999;
      text-decoration: none;
      letter-spacing: 0.05em;
      transition: color 0.15s ease;
    }
    .nav-link:hover {
      color: #FFFFFF;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    /* === Hero === */
    .hero {
      padding: 100px var(--space-xl) 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #222222;
      background: radial-gradient(circle at 50% 20%, rgba(215, 25, 33, 0.05) 0%, transparent 60%);
    }
    .hero-status {
      margin-bottom: var(--space-md);
      color: #999999;
    }
    .hero-title {
      font-family: var(--font-display, 'Doto', sans-serif);
      font-size: clamp(36px, 6vw, 68px);
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      margin: 0 0 var(--space-md);
      font-weight: 800;
    }
    .hero-title--accent {
      color: #D71921;
    }
    .hero-subtitle {
      max-width: 720px;
      font-size: 17px;
      line-height: 1.6;
      color: #999999;
      margin-bottom: var(--space-xl);
    }
    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      justify-content: center;
      margin-bottom: 80px;
    }

    /* === Telemetry Strip === */
    .telemetry-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      width: 100%;
      max-width: 960px;
      border: 1px solid #333333;
      background: #111111;
    }
    .telemetry-item {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      border-right: 1px solid #222222;
    }
    .telemetry-item:last-child {
      border-right: none;
    }
    .telemetry-val {
      font-size: 32px;
      color: #FFFFFF;
      font-weight: 700;
    }
    .telemetry-lbl {
      color: #999999;
      font-size: 11px;
    }

    /* === Sections === */
    .section {
      padding: 80px var(--space-xl);
      border-bottom: 1px solid #222222;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    .section-header {
      margin-bottom: var(--space-xl);
    }
    .section-title {
      font-size: 28px;
      margin-top: var(--space-xs);
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    /* === Capabilities Grid === */
    .capabilities-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
    }
    .cap-card {
      background: #111111;
      border: 1px solid #222222;
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      transition: border-color 0.2s ease;
    }
    .cap-card:hover {
      border-color: #444444;
    }
    .cap-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cap-num {
      color: #D71921;
      font-weight: 700;
      font-size: 14px;
    }
    .cap-tag {
      font-size: 10px;
      font-family: var(--font-data);
      color: #666666;
      border: 1px solid #222222;
      padding: 2px 6px;
    }
    .cap-title {
      font-size: 17px;
      color: #FFFFFF;
      margin: 0;
    }
    .cap-desc {
      font-size: 14px;
      line-height: 1.5;
      color: #999999;
      margin: 0;
    }

    /* === Roles Grid === */
    .roles-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
    }
    .role-box {
      background: #111111;
      border: 1px solid #222222;
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.15s ease;
    }
    .role-box:hover {
      border-color: #E8E8E8;
      transform: translateY(-2px);
    }
    .role-box__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .role-name {
      font-weight: 700;
      color: #FFFFFF;
      font-size: 15px;
    }
    .role-desc {
      font-size: 13px;
      color: #999999;
      line-height: 1.4;
      flex: 1;
      margin-bottom: var(--space-sm);
    }

    /* === Architecture Box === */
    .arch-box {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: var(--space-xl);
      background: #111111;
      border: 1px solid #333333;
      padding: var(--space-xl);
    }
    .arch-col {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .arch-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .arch-list li {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }
    .arch-list li::before {
      content: "▪";
      color: #D71921;
    }
    .arch-divider {
      width: 1px;
      background: #222222;
    }

    /* === Footer === */
    .landing-footer {
      padding: var(--space-xl);
      border-top: 1px solid #222222;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .footer-left,
    .footer-right {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .capabilities-grid { grid-template-columns: repeat(2, 1fr); }
      .roles-grid { grid-template-columns: repeat(2, 1fr); }
      .arch-box { grid-template-columns: 1fr; }
      .arch-divider { display: none; }
    }
    @media (max-width: 768px) {
      .header-nav { display: none; }
      .telemetry-strip { grid-template-columns: 1fr 1fr; }
      .capabilities-grid { grid-template-columns: 1fr; }
      .roles-grid { grid-template-columns: 1fr; }
      .landing-footer { flex-direction: column; gap: var(--space-md); text-align: center; }
    }
  `]
})
export class LandingPageComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  quickLogin(role: 'admin' | 'inventory_manager' | 'buyer' | 'store_clerk' | 'viewer'): void {
    const emailMap: Record<string, string> = {
      admin: 'admin@stocksmart.io',
      inventory_manager: 'manager@stocksmart.io',
      buyer: 'buyer@stocksmart.io',
      store_clerk: 'clerk@stocksmart.io',
      viewer: 'viewer@stocksmart.io'
    };

    const email = emailMap[role];
    if (email) {
      this.auth.login({ email, password: 'password' })
        .then(() => this.router.navigate(['/dashboard']))
        .catch(err => console.error('Quick login failed', err));
    }
  }
}
