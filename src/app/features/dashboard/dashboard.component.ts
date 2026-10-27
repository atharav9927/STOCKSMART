import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  KpiCardComponent,
  DataTableComponent,
  StatusChipComponent,
  QuantityBadgeComponent,
  ScanInputComponent,
  ProductPickerComponent,
  LocationPickerComponent,
  SupplierPickerComponent,
  SlideOverComponent
} from '../../shared';
import { TableColumn, StockLevel, Product } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    KpiCardComponent,
    DataTableComponent,
    StatusChipComponent,
    QuantityBadgeComponent,
    ScanInputComponent,
    ProductPickerComponent,
    LocationPickerComponent,
    SupplierPickerComponent,
    SlideOverComponent
  ],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page__header">
        <div>
          <h1 class="page__title">OPERATIONS COMMAND</h1>
          <p class="page__subtitle">
            REAL-TIME INVENTORY OPTIMIZATION & TELEMETRY • {{ activeLocationLabel() }}
          </p>
        </div>
        <div class="layout-row layout-gap-sm">
          <button class="btn btn--secondary btn--sm" (click)="openQuickScan.set(true)">
            [ FAST SCAN ]
          </button>
          <button class="btn btn--primary btn--sm" (click)="simulateDataSync()">
            [ RECONCILE LEDGER ]
          </button>
        </div>
      </div>

      <!-- KPI Metrics Grid (Nothing-inspired instrument panel) -->
      <div class="grid grid--4 kpi-row">
        <app-kpi-card
          label="TOTAL INVENTORY VALUE"
          [value]="totalValue()"
          [previousValue]="4280000"
          format="currency"
          icon="◆"
          [trend]="[4100000, 4180000, 4250000, 4220000, 4280000, totalValue()]"
        />

        <app-kpi-card
          label="LOW STOCK ITEMS"
          [value]="lowStockCount()"
          [previousValue]="28"
          format="number"
          suffix="SKUS"
          icon="▼"
          [invertChange]="true"
          [trend]="[34, 31, 29, 32, 28, lowStockCount()]"
        />

        <app-kpi-card
          label="CRITICAL STOCKOUTS"
          [value]="stockoutCount()"
          [previousValue]="12"
          format="number"
          suffix="SKUS"
          icon="✕"
          [invertChange]="true"
          [trend]="[16, 14, 15, 13, 12, stockoutCount()]"
        />

        <app-kpi-card
          label="ACTIVE PURCHASE ORDERS"
          [value]="openPoCount()"
          [previousValue]="6"
          format="number"
          suffix="ORDERS"
          icon="⬡"
          [trend]="[4, 5, 5, 6, 6, openPoCount()]"
        />
      </div>

      <!-- Main Operational Split -->
      <div class="dashboard-split">
        <!-- Stock Levels Data Table -->
        <div class="dashboard-table-container">
          <div class="section-header">
            <div>
              <h2 class="text-subheading">CRITICAL STOCK ALLOCATION</h2>
              <span class="text-caption text-muted">SORTED BY REORDER PRIORITY</span>
            </div>
            <a routerLink="/inventory/stock" class="btn btn--ghost btn--sm">VIEW FULL MATRIX →</a>
          </div>

          <app-data-table
            [data]="tableData()"
            [allColumns]="stockColumns"
            [total]="tableData().length"
            [searchable]="true"
            [selectable]="true"
            [exportable]="true"
            (rowClick)="onRowSelect($event)"
            (export)="exportCsv()"
          >
            <div bulkActions class="bulk-btns">
              <button class="btn btn--secondary btn--sm" (click)="triggerBulkTransfer()">
                TRANSFER SELECTED
              </button>
            </div>
          </app-data-table>
        </div>

        <!-- System Alerts & Quick Action Feeds -->
        <div class="dashboard-side">
          <!-- Active Alerts -->
          <div class="card">
            <div class="section-header">
              <span class="text-label">TELEMETRY & ALERTS</span>
              <a routerLink="/alerts" class="text-caption text-interactive">VIEW ALL ({{ mockData.alerts().length }})</a>
            </div>

            <div class="alerts-feed">
              @for (alert of mockData.alerts(); track alert.id) {
                <div class="alert-item" [class.alert-item--critical]="alert.severity === 'critical'">
                  <div class="alert-item__header">
                    <span class="text-label" [class.text-error]="alert.severity === 'critical'" [class.text-warning]="alert.severity === 'warning'">
                      [{{ alert.severity }}]
                    </span>
                    <span class="text-caption text-disabled">{{ alert.createdAt | date:'HH:mm' }}</span>
                  </div>
                  <span class="text-body-sm font-medium">{{ alert.title }}</span>
                  <p class="text-caption text-secondary">{{ alert.message }}</p>
                  @if (alert.actionUrl) {
                    <a [routerLink]="alert.actionUrl" class="text-caption text-interactive">
                      {{ alert.actionLabel || 'REVIEW' }} →
                    </a>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Component Sandbox / Pickers Demonstration -->
          <div class="card">
            <span class="text-label text-muted">QUICK LOOKUP SELECTORS</span>
            <div class="sandbox-pickers">
              <app-product-picker
                label="PRODUCT PICKER"
                [selectedId]="sampleProductId()"
                (productSelected)="onSampleProductSelect($event)"
              />
              <app-location-picker
                label="WAREHOUSE / STORE SCOPE"
                [selectedId]="mockData.selectedLocationId()"
                (locationSelected)="mockData.setSelectedLocation($event.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Slide Over Scan Modal -->
      <app-slide-over
        [open]="openQuickScan()"
        title="BARCODE / RFID SCANNER DOCK"
        (close)="openQuickScan.set(false)"
      >
        <div class="scan-modal-content">
          <app-scan-input
            label="RAPID HARDWARE WEDGE CAPTURE"
            placeholder="Scan SKU, EAN13 or RFID..."
            (scanned)="handleScannedCode($event)"
          />

          @if (scannedResult()) {
            <div class="scanned-card card card--raised">
              <span class="text-label text-success">[MATCH LOCATED]</span>
              <h3 class="text-heading">{{ scannedResult()!.product.name }}</h3>
              <div class="scanned-meta">
                <span class="text-data text-subheading">SKU: {{ scannedResult()!.product.sku }}</span>
                <span class="text-data text-subheading">COST: \${{ scannedResult()!.product.unitCost }}</span>
                <span class="text-data text-subheading">PRICE: \${{ scannedResult()!.product.unitPrice }}</span>
              </div>
              <hr class="divider" />
              <span class="text-label">STOCK ACROSS LOCATIONS</span>
              @for (st of scannedResult()!.stock; track st.locationId) {
                <div class="layout-between">
                  <span class="text-body-sm">{{ st.locationName }}</span>
                  <app-quantity-badge [value]="st.quantityOnHand" unit="PCS" />
                </div>
              }
            </div>
          }
        </div>
      </app-slide-over>
    </div>
  `,
  styles: [`
    .kpi-row {
      margin-bottom: var(--space-xl);
    }
    .dashboard-split {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-lg);
    }
    @media (max-width: 1200px) {
      .dashboard-split {
        grid-template-columns: 1fr;
      }
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-sm);
    }
    .dashboard-side {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .alerts-feed {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      max-height: 400px;
      overflow-y: auto;
    }
    .alert-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--space-sm);
      border-bottom: 1px solid var(--border);
    }
    .alert-item--critical {
      border-left: 2px solid var(--accent);
      background: var(--surface-raised);
    }
    .alert-item__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sandbox-pickers {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-top: var(--space-sm);
    }
    .scan-modal-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }
    .scanned-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .scanned-meta {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }
    .bulk-btns {
      display: flex;
      gap: var(--space-xs);
    }
  `]
})
export class DashboardComponent {
  mockData = inject(MockDataService);
  auth = inject(AuthService);
  notifications = inject(NotificationService);

  openQuickScan = signal(false);
  scannedResult = signal<{ product: Product; stock: StockLevel[] } | null>(null);
  sampleProductId = signal<string | null>('prod-1');

  stockColumns: TableColumn[] = [
    { key: 'productSku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'PRODUCT DESIGNATION', sortable: true },
    { key: 'locationName', label: 'LOCATION', sortable: true },
    { key: 'quantityOnHand', label: 'ON HAND', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityAvailable', label: 'AVAILABLE', sortable: true, type: 'number', align: 'right' },
    { key: 'reorderPoint', label: 'REORDER PT', sortable: true, type: 'number', align: 'right' },
    { key: 'status', label: 'STATUS', sortable: true, type: 'status' }
  ];

  activeLocationLabel = computed(() => {
    const id = this.mockData.selectedLocationId();
    if (id === 'all') return 'ENTERPRISE SCOPE (ALL SITES)';
    const loc = this.mockData.locations().find(l => l.id === id);
    return loc ? `${loc.code} — ${loc.name}` : 'UNKNOWN LOCATION';
  });

  tableData = computed(() => {
    const locId = this.mockData.selectedLocationId();
    let data = this.mockData.stockLevels();
    if (locId !== 'all') {
      data = data.filter(s => s.locationId === locId);
    }
    // Filter to prioritized items (low stock or critical)
    return data.slice(0, 40);
  });

  totalValue = computed(() => {
    const locId = this.mockData.selectedLocationId();
    const list = this.mockData.stockLevels();
    return list
      .filter(s => locId === 'all' || s.locationId === locId)
      .reduce((sum, item) => sum + item.totalValue, 0);
  });

  lowStockCount = computed(() => {
    const locId = this.mockData.selectedLocationId();
    return this.mockData.stockLevels().filter(s =>
      (locId === 'all' || s.locationId === locId) && s.status === 'low_stock'
    ).length;
  });

  stockoutCount = computed(() => {
    const locId = this.mockData.selectedLocationId();
    return this.mockData.stockLevels().filter(s =>
      (locId === 'all' || s.locationId === locId) && s.status === 'out_of_stock'
    ).length;
  });

  openPoCount = computed(() => {
    return this.mockData.purchaseOrders().filter(po => po.status !== 'received' && po.status !== 'cancelled').length;
  });

  onRowSelect(row: any): void {
    this.notifications.show(`[SELECTED: ${row.productSku}] ${row.productName}`, 'info');
  }

  exportCsv(): void {
    this.notifications.success('[SAVED] Stock matrix exported to CSV');
  }

  triggerBulkTransfer(): void {
    this.notifications.show('[ROUTED] Bulk transfer wave initiated for selected SKUs', 'info');
  }

  simulateDataSync(): void {
    this.notifications.success('[SYNCHRONIZED] All location ledgers balanced');
  }

  onSampleProductSelect(product: Product): void {
    this.sampleProductId.set(product.id);
    this.notifications.show(`[LOADED PRODUCT] ${product.sku} — ${product.name}`, 'info');
  }

  handleScannedCode(code: string): void {
    const res = this.mockData.lookupBarcode(code);
    if (res) {
      this.scannedResult.set(res);
      this.notifications.success(`[SCANNED] Found SKU ${res.product.sku}`);
    } else {
      this.scannedResult.set(null);
      this.notifications.error(`[NOT FOUND] No record for code: ${code}`);
    }
  }
}
