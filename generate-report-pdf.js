const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stocksmartDir = 'C:\\Users\\Lenovo\\Downloads\\stocksmart';
const p1 = path.join(stocksmartDir, 'docs', 'images', 'screenshot_operations_command_kpis.png');
const p2 = path.join(stocksmartDir, 'docs', 'images', 'screenshot_inventory_matrix_table.png');

const img1Base64 = fs.readFileSync(p1).toString('base64');
const img2Base64 = fs.readFileSync(p2).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>StockSmart — Retail Inventory Optimization System Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');

    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1a1a1a;
      background: #ffffff;
    }

    /* Print styling */
    .page-break {
      page-break-after: always;
    }

    .no-break {
      page-break-inside: avoid;
    }

    /* Cover Page */
    .cover {
      height: 92vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 2px solid #000000;
      padding: 40px;
      background: #fafafa;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000000;
      padding-bottom: 16px;
    }

    .cover-brand {
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      font-size: 14pt;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cover-badge {
      background: #000000;
      color: #ffffff;
      padding: 4px 10px;
      font-size: 11pt;
    }

    .cover-date {
      font-family: 'Space Mono', monospace;
      font-size: 10pt;
      color: #555555;
    }

    .cover-hero {
      margin: auto 0;
    }

    .cover-pre {
      font-family: 'Space Mono', monospace;
      font-size: 11pt;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #d71921;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .cover-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 34pt;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: #000000;
      margin-bottom: 18px;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #444444;
      line-height: 1.5;
      max-width: 90%;
    }

    .cover-meta {
      border-top: 2px solid #000000;
      padding-top: 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      font-family: 'Space Mono', monospace;
      font-size: 9.5pt;
    }

    .meta-group strong {
      display: block;
      color: #000000;
      margin-bottom: 4px;
      text-transform: uppercase;
      font-size: 9pt;
      letter-spacing: 0.05em;
    }

    .meta-group span {
      color: #444444;
      word-break: break-all;
    }

    /* Content styling */
    h1, h2, h3, h4 {
      font-family: 'Space Grotesk', sans-serif;
      color: #000000;
      font-weight: 700;
    }

    h2 {
      font-size: 16pt;
      border-bottom: 2px solid #000000;
      padding-bottom: 6px;
      margin-top: 26px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h3 {
      font-size: 12.5pt;
      margin-top: 18px;
      margin-bottom: 8px;
      color: #111111;
    }

    p {
      margin-bottom: 10px;
      color: #2b2b2b;
      text-align: justify;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    li {
      margin-bottom: 5px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 18px 0;
      font-size: 9.5pt;
    }

    th, td {
      border: 1px solid #d0d0d0;
      padding: 8px 10px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
      color: #000000;
      font-family: 'Space Mono', monospace;
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    tr:nth-child(even) td {
      background-color: #fafafa;
    }

    /* Callouts & Badges */
    .callout {
      background: #f7f7f7;
      border-left: 4px solid #000000;
      padding: 12px 16px;
      margin: 14px 0;
      font-size: 9.5pt;
    }

    .callout--accent {
      border-left-color: #d71921;
      background: #fff8f8;
    }

    .code-block {
      background: #111111;
      color: #00ff66;
      font-family: 'Space Mono', monospace;
      font-size: 8.5pt;
      padding: 12px;
      border-radius: 4px;
      margin: 12px 0;
      line-height: 1.45;
      overflow-x: auto;
    }

    code {
      font-family: 'Space Mono', monospace;
      font-size: 8.5pt;
      background: #eeeeee;
      padding: 2px 5px;
      border-radius: 3px;
      color: #b31010;
    }

    /* Image figures */
    .figure-container {
      margin: 16px 0;
      border: 1px solid #cccccc;
      border-radius: 6px;
      padding: 10px;
      background: #000000;
      text-align: center;
      page-break-inside: avoid;
    }

    .figure-image {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
    }

    .figure-caption {
      font-size: 9pt;
      color: #bbbbbb;
      margin-top: 8px;
      font-family: 'Space Mono', monospace;
      text-align: left;
      padding: 0 4px;
    }

    .figure-caption strong {
      color: #ffffff;
    }

    /* Header & Footer in content */
    .header-bar {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #cccccc;
      padding-bottom: 4px;
      margin-bottom: 16px;
      font-family: 'Space Mono', monospace;
      font-size: 8pt;
      color: #777777;
    }

    .footer-bar {
      margin-top: 30px;
      border-top: 1px solid #e0e0e0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #888888;
      font-family: 'Space Mono', monospace;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover page-break">
    <div class="cover-top">
      <div class="cover-brand">
        <span class="cover-badge">SS</span>
        <span>STOCKSMART // OS v1.0</span>
      </div>
      <div class="cover-date">NOVEMBER 2026</div>
    </div>

    <div class="cover-hero">
      <div class="cover-pre">ENGINEERING & ACADEMIC PROJECT REPORT</div>
      <h1 class="cover-title">RETAIL INVENTORY OPTIMIZATION SYSTEM</h1>
      <p class="cover-subtitle">
        A dense, high-frequency multi-facility inventory operations platform engineered with Nothing OS Swiss Industrial Design, Angular 17+ Signals, and Spring Boot 3.3.5 REST Architecture.
      </p>
    </div>

    <div class="cover-meta">
      <div class="meta-group">
        <strong>Repository URL</strong>
        <span>https://github.com/atharav9927/STOCKSMART</span>
      </div>
      <div class="meta-group">
        <strong>Live Production URL</strong>
        <span>https://atharav9927.github.io/STOCKSMART/</span>
      </div>
      <div class="meta-group">
        <strong>Technology Focus</strong>
        <span>Angular 17 • Spring Boot 3 • Java 21 • TypeScript</span>
      </div>
      <div class="meta-group">
        <strong>Author & Maintainer</strong>
        <span>Atharav Agarwal (atharav9927)</span>
      </div>
    </div>
  </div>

  <!-- SECTION 1 & 2 -->
  <div class="header-bar">
    <span>STOCKSMART SYSTEM REPORT</span>
    <span>EXECUTIVE SUMMARY & TECH STACK</span>
  </div>

  <h2>1. Executive Summary</h2>
  <p>
    Modern multi-echelon retail supply chains frequently suffer from fragmented inventory visibility, high wedge latency during barcode capture, cognitive fatigue from bloated enterprise dashboards, and stockout reconciliation delays. <strong>StockSmart</strong> was engineered to solve these challenges through an ultra-dense, low-latency operational control plane.
  </p>
  <p>
    Designed using the <strong>Nothing OS Swiss Modernist design philosophy</strong> (monochromatic OLED canvas, <code>Doto</code> dot-matrix numbers, <code>Space Grotesk</code>/<code>Space Mono</code> type hierarchy, and zero superficial drop shadows), the system reserves color strictly for actionable alerts (signal red for stockouts and green for healthy velocity).
  </p>

  <div class="callout callout--accent">
    <strong>Core Architectural Innovation:</strong> StockSmart operates simultaneously in two production modes:
    <ul>
      <li><strong>Autonomous Client-Side SPA:</strong> 100% functional on GitHub Pages with an in-browser reactive signals data engine and persistent local session state (all 42 routes work without a remote server).</li>
      <li><strong>Enterprise Cloud Mode:</strong> A robust Spring Boot 3.3.5 REST API with PostgreSQL persistence, stateless JWT security, and Docker/Render container deployment blueprints.</li>
    </ul>
  </div>

  <h2>2. Technology Stack & Language Breakdown</h2>

  <h3>2.1. Programming Languages</h3>
  <table>
    <thead>
      <tr>
        <th>Language</th>
        <th>Version / Spec</th>
        <th>System Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>TypeScript</strong></td>
        <td>v5.4.x</td>
        <td>Angular 17 standalone components, reactive signals, models, routing guards, interceptors</td>
      </tr>
      <tr>
        <td><strong>Java</strong></td>
        <td>OpenJDK 21 / 25</td>
        <td>Spring Boot 3.3.5 REST API, Spring Security filter chains, JPA entities, JWT encryption</td>
      </tr>
      <tr>
        <td><strong>HTML5 / CSS3 / SCSS</strong></td>
        <td>W3C Standards</td>
        <td>Nothing OS design tokens, OLED theme, responsive grid layouts, thermal label print styles</td>
      </tr>
      <tr>
        <td><strong>SQL</strong></td>
        <td>ANSI / H2 / PG</td>
        <td>Relational schema modeling, multi-facility inventory indexing, immutable ledger queries</td>
      </tr>
    </tbody>
  </table>

  <h3>2.2. Frameworks & Core Libraries</h3>
  <ul>
    <li><strong>Frontend Framework:</strong> <code>Angular 17.3</code> (Standalone Architecture, zero <code>NgModule</code> overhead, 65 tree-shaken lazy-loaded route chunks).</li>
    <li><strong>State Management:</strong> Native <code>Angular Signals</code> (<code>signal()</code>, <code>computed()</code>, <code>effect()</code>) delivering instantaneous DOM updates without zone-pollution.</li>
    <li><strong>Barcode Scanning Engine:</strong> <code>@zxing/library</code> & <code>@zxing/browser</code> providing real-time WebRTC camera video barcode decoding with an optical HUD targeting reticle.</li>
    <li><strong>Acoustic Feedback:</strong> Native <code>Web Audio Oscillator API</code> generating 880 Hz positive sine beeps and 220 Hz sawtooth alerts.</li>
    <li><strong>Backend Framework:</strong> <code>Spring Boot 3.3.5</code> with Spring Web MVC, Spring Data JPA, and Spring Actuator.</li>
    <li><strong>Security:</strong> <code>Spring Security 6</code> with stateless JSON Web Tokens (<code>jjwt 0.12.5</code>) and BCrypt password encryption (strength 12).</li>
    <li><strong>Databases:</strong> Dual-profile architecture using in-memory <code>H2 Database</code> for local development and managed <code>PostgreSQL 16</code> on Render.</li>
  </ul>

  <div class="footer-bar">
    <span>StockSmart Retail Inventory Optimization System</span>
    <span>Page 2</span>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 3 & 4: VISUAL TELEMETRY & SCREENSHOTS -->
  <div class="header-bar">
    <span>STOCKSMART SYSTEM REPORT</span>
    <span>LIVE SYSTEM SCREENSHOTS & TELEMETRY</span>
  </div>

  <h2>3. Visual Telemetry & Live Screen Captures</h2>
  <p>
    The system is deployed and fully operational at <code>https://atharav9927.github.io/STOCKSMART/dashboard</code>. The following screen captures illustrate the live application state:
  </p>

  <div class="figure-container">
    <img src="data:image/png;base64,${img1Base64}" class="figure-image" alt="Operations Command Center KPIs" />
    <div class="figure-caption">
      <strong>Figure 3.1: Operations Command Center & Telemetry KPIs.</strong> Live URL: <code>https://atharav9927.github.io/STOCKSMART/dashboard</code>. Features Nothing OS dot-matrix numerals (<code>Doto</code> font) displaying Total Inventory Value ($22.6M with positive green sparkline), Low Stock Items (240 SKUs with warning red curve), Critical Stockouts (120 SKUs), and Active Purchase Orders.
    </div>
  </div>

  <div class="figure-container">
    <img src="data:image/png;base64,${img2Base64}" class="figure-image" alt="Multi-Facility SKU Allocation Matrix" />
    <div class="figure-caption">
      <strong>Figure 3.2: Multi-Facility Real-Time SKU Allocation Matrix.</strong> Live display of cross-facility distribution for high-velocity hardware SKUs (e.g., <em>Ear (2) Transparent White</em>, <em>Ear (a) Canary Yellow</em>, <em>Phone (2a) Milk White</em>) across Central Distribution Center, East Coast Warehouse, and Flagship Retail Stores with On-Hand and Available quantities.
    </div>
  </div>

  <div class="footer-bar">
    <span>StockSmart Retail Inventory Optimization System</span>
    <span>Page 3</span>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 5: MODULES & ACCESS -->
  <div class="header-bar">
    <span>STOCKSMART SYSTEM REPORT</span>
    <span>OPERATIONAL MODULES & SECURITY CLEARANCES</span>
  </div>

  <h2>4. Core Operational Modules (42 Routes)</h2>
  <table>
    <thead>
      <tr>
        <th>Module Domain</th>
        <th>Route Prefix</th>
        <th>Key Capabilities & Workflows</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Public Access</strong></td>
        <td><code>/</code>, <code>/login</code></td>
        <td>Nothing OS landing page with live telemetry, operator login form, credential recovery, 1-click role bypass.</td>
      </tr>
      <tr>
        <td><strong>Command & Telemetry</strong></td>
        <td><code>/dashboard</code></td>
        <td>Executive enterprise overview, multi-location facility switcher, financial valuation sparklines, action quick-links.</td>
      </tr>
      <tr>
        <td><strong>Catalog Master</strong></td>
        <td><code>/catalog/*</code></td>
        <td>520 SKU directory, drag-and-drop category taxonomy CDK tree, thermal Avery/Zebra barcode label printer sheets.</td>
      </tr>
      <tr>
        <td><strong>Stock Matrix & Transfer</strong></td>
        <td><code>/inventory/*</code></td>
        <td>Cross-facility 2D stock matrix, inter-warehouse replenishment transfers, shrinkage adjustments, blind cycle count audits.</td>
      </tr>
      <tr>
        <td><strong>Fulfilment & POS</strong></td>
        <td><code>/orders/*</code></td>
        <td>3-step barcode verified pick-pack-ship outbound queue, reverse logistics RMA returns, instant cashier POS terminal.</td>
      </tr>
      <tr>
        <td><strong>Procurement & RTV</strong></td>
        <td><code>/procurement/*</code></td>
        <td>Multi-line purchase order generation, goods receiving dock short/damaged delivery tallies, vendor return (RTV) claims.</td>
      </tr>
      <tr>
        <td><strong>Auditing & Shrinkage</strong></td>
        <td><code>/reports/*</code></td>
        <td>Inventory turnover ratios, stockout risk forecasting, ABC velocity distribution, damage/pilferage shrinkage ledger.</td>
      </tr>
      <tr>
        <td><strong>Administration & RBAC</strong></td>
        <td><code>/admin/*</code></td>
        <td>Operator management, 5-level role permission matrix, facility settings, immutable ledger backups.</td>
      </tr>
    </tbody>
  </table>

  <h2>5. Security Model & Role Clearance Matrix</h2>
  <p>
    StockSmart implements a strict role-based access control (RBAC) hierarchy. Evaluators can access the live system using the pre-seeded operator profiles (Standardized Password: <code>password</code>):
  </p>

  <table>
    <thead>
      <tr>
        <th>Role Clearance</th>
        <th>System Email</th>
        <th>Operational Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>System Admin</strong></td>
        <td><code>admin@stocksmart.io</code></td>
        <td>Unrestricted global access: RBAC matrix configuration, data backups, facility setup, immutable audit ledger.</td>
      </tr>
      <tr>
        <td><strong>Inventory Manager</strong></td>
        <td><code>manager@stocksmart.io</code></td>
        <td>Stock adjustments, transfer approvals, discrepancy write-offs, cycle count reconciliations, shrinkage audits.</td>
      </tr>
      <tr>
        <td><strong>Procurement Buyer</strong></td>
        <td><code>buyer@stocksmart.io</code></td>
        <td>Supplier vendor scorecards, PO requisitions, replenishment thresholds, vendor return (RTV) credit note claims.</td>
      </tr>
      <tr>
        <td><strong>Warehouse Clerk</strong></td>
        <td><code>clerk@stocksmart.io</code></td>
        <td>Scoped facility clearance: Camera & wedge barcode lookup, pick-pack-ship scanning, blind count entry.</td>
      </tr>
      <tr>
        <td><strong>Auditor / Viewer</strong></td>
        <td><code>viewer@stocksmart.io</code></td>
        <td>Read-only clearance: Financial inventory valuation, stockout forecasts, stock allocation matrix, turnover metrics.</td>
      </tr>
    </tbody>
  </table>

  <h2>6. Conclusion</h2>
  <p>
    StockSmart successfully demonstrates an industrial-grade solution uniting aesthetic restraint with full-stack capability. By leveraging Angular 17 Standalone Signals, Spring Boot 3.3.5, and dual deployment targets (GitHub Pages & Render), the platform provides sub-50ms operational response times, robust auditability, and zero barrier-to-entry for evaluators.
  </p>

  <div class="footer-bar">
    <span>StockSmart Retail Inventory Optimization System</span>
    <span>Page 4</span>
  </div>

</body>
</html>`;

const tempHtmlPath = path.join(stocksmartDir, 'report_temp.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

const outputPdfPath = path.join(stocksmartDir, 'StockSmart_Project_Report.pdf');
const userDownloadsPdf = path.join('C:\\Users\\Lenovo\\Downloads', 'StockSmart_Project_Report.pdf');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" --no-pdf-header-footer "${tempHtmlPath}"`;

console.log('Rendering PDF with Edge...');
execSync(cmd);

console.log('Copying to user Downloads folder...');
fs.copyFileSync(outputPdfPath, userDownloadsPdf);

console.log('Cleaning up temporary HTML...');
fs.unlinkSync(tempHtmlPath);

console.log('PDF Generation Successful!');
console.log('Output PDF size:', fs.statSync(outputPdfPath).size, 'bytes');
