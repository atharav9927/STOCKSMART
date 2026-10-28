import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusChipComponent, QuantityBadgeComponent, DataTableComponent, TimelineComponent } from '../../../shared';
import { Product, StockLevel, InventoryMovement, TableColumn } from '../../../core/models';

type TabKey = 'overview' | 'variants' | 'stock' | 'movements' | 'suppliers' | 'barcodes';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusChipComponent, QuantityBadgeComponent, DataTableComponent, TimelineComponent],
  template: `
    @if (product(); as prod) {
      <div class="page">
        <!-- Breadcrumb & Back -->
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ prod.sku }}</span>
              <span class="chip" [class.chip--success]="prod.isActive">{{ prod.isActive ? '● ACTIVE' : '○ INACTIVE' }}</span>
            </div>
            <h1 class="page__title">{{ prod.name }}</h1>
          </div>
          <div class="layout-row layout-gap-sm">
            <a [routerLink]="['/catalog/products', prod.id, 'edit']" class="btn btn--secondary btn--sm">
              [ EDIT SKU ]
            </a>
            <button class="btn btn--secondary btn--sm" (click)="printLabel()">
              [ PRINT LABEL ]
            </button>
            <a routerLink="/catalog/products" class="btn btn--ghost btn--sm">
              ← CATALOG
            </a>
          </div>
        </div>

        <!-- Metric Header Strip -->
        <div class="grid grid--4 kpi-strip">
          <div class="card card--compact">
            <span class="text-label text-muted">TOTAL ON HAND</span>
            <span class="text-display-md text-data">{{ totalOnHand() }}</span>
            <span class="text-caption text-secondary">Across {{ locationsCount() }} facilities</span>
          </div>

          <div class="card card--compact">
            <span class="text-label text-muted">TOTAL VALUE</span>
            <span class="text-display-md text-data">\${{ totalValue() | number:'1.0-0' }}</span>
            <span class="text-caption text-secondary">Unit cost: \${{ prod.unitCost }}</span>
          </div>

          <div class="card card--compact">
            <span class="text-label text-muted">RETAIL PRICE</span>
            <span class="text-display-md text-data text-success">\${{ prod.unitPrice }}</span>
            <span class="text-caption text-secondary">Margin: {{ marginPercent() }}%</span>
          </div>

          <div class="card card--compact">
            <span class="text-label text-muted">REORDER POINT</span>
            <span class="text-display-md text-data">{{ prod.reorderPoint }}</span>
            <span class="text-caption text-secondary">Batch size: {{ prod.reorderQuantity }}</span>
          </div>
        </div>

        <!-- Tabbed Navigation Bar -->
        <div class="tab-bar">
          <button
            class="tab-btn"
            [class.tab-btn--active]="activeTab() === 'overview'"
            (click)="activeTab.set('overview')"
          >
            OVERVIEW
          </button>
          <button
            class="tab-btn"
            [class.tab-btn--active]="activeTab() === 'variants'"
            (click)="activeTab.set('variants')"
          >
            VARIANTS ({{ prod.variants.length }})
          </button>
          <button
            class="tab-btn"
            [class.tab-btn--active]="activeTab() === 'stock'"
            (click)="activeTab.set('stock')"
          >
            STOCK BY LOCATION
          </button>
          <button
            class="tab-btn"
            [class.tab-btn--active]="activeTab() === 'movements'"
            (click)="activeTab.set('movements')"
          >
            MOVEMENT HISTORY
          </button>
          <button
            class="tab-btn"
            [class.tab-btn--active]="activeTab() === 'suppliers'"
            (click)="activeTab.set('suppliers')"
          >
            SUPPLIERS
          </button>
          <button
            class="tab-btn"
            [class.tab-btn--active]="activeTab() === 'barcodes'"
            (click)="activeTab.set('barcodes')"
          >
            BARCODES & RFID
          </button>
        </div>

        <!-- TAB CONTENT: OVERVIEW -->
        @if (activeTab() === 'overview') {
          <div class="tab-content grid grid--2">
            <div class="card">
              <span class="text-label text-muted">ENGINEERING SPECIFICATIONS</span>
              <div class="spec-list">
                <div class="spec-row">
                  <span class="text-label">CATEGORY</span>
                  <span class="text-body-sm">{{ categoryName() }}</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">BRAND</span>
                  <span class="text-body-sm">{{ brandName() }}</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">UNIT OF MEASURE</span>
                  <span class="text-data">{{ prod.unitOfMeasure }}</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">UNIT WEIGHT</span>
                  <span class="text-data">{{ prod.weight }} kg</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">DIMENSIONS (L x W x H)</span>
                  <span class="text-data">
                    {{ prod.dimensions?.length }} × {{ prod.dimensions?.width }} × {{ prod.dimensions?.height }} cm
                  </span>
                </div>
              </div>
            </div>

            <div class="card">
              <span class="text-label text-muted">DESCRIPTION & OPERATIONAL NOTES</span>
              <p class="text-body-sm" style="margin-top: 12px; line-height: 1.6;">
                {{ prod.description || 'No extended technical description provided.' }}
              </p>
              <div class="meta-box">
                <span class="text-label text-disabled">CREATED: {{ prod.createdAt | date:'yyyy-MM-dd' }}</span>
                <span class="text-label text-disabled">LAST REVISION: {{ prod.updatedAt | date:'yyyy-MM-dd HH:mm' }}</span>
              </div>
            </div>
          </div>
        }

        <!-- TAB CONTENT: VARIANTS -->
        @if (activeTab() === 'variants') {
          <div class="tab-content">
            <div class="card">
              <div class="layout-between" style="margin-bottom: 16px;">
                <span class="text-label text-muted">REGISTERED HARDWARE VARIANTS</span>
                <button class="btn btn--secondary btn--sm" (click)="notifications.show('[INFO] Variant builder drawer opened', 'info')">
                  + ADD VARIANT
                </button>
              </div>

              @if (prod.variants.length > 0) {
                <table class="dt__table">
                  <thead>
                    <tr>
                      <th class="dt__th">VARIANT SKU</th>
                      <th class="dt__th">NAME</th>
                      <th class="dt__th">ATTRIBUTES</th>
                      <th class="dt__th" style="text-align: right;">DELTA COST</th>
                      <th class="dt__th" style="text-align: right;">DELTA PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (v of prod.variants; track v.id) {
                      <tr class="dt__row">
                        <td class="dt__td text-data">{{ v.sku }}</td>
                        <td class="dt__td">{{ v.name }}</td>
                        <td class="dt__td">
                          @for (attr of v.attributes | keyvalue; track attr.key) {
                            <span class="chip chip--technical">{{ attr.key }}: {{ attr.value }}</span>
                          }
                        </td>
                        <td class="dt__td text-data" style="text-align: right;">+\${{ v.additionalCost }}</td>
                        <td class="dt__td text-data" style="text-align: right;">+\${{ v.additionalPrice }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              } @else {
                <div class="empty text-caption text-disabled" style="padding: 32px 0;">
                  No variants defined. This hardware item is a single monolithic SKU.
                </div>
              }
            </div>
          </div>
        }

        <!-- TAB CONTENT: STOCK BY LOCATION -->
        @if (activeTab() === 'stock') {
          <div class="tab-content">
            <app-data-table
              [data]="locationStocks()"
              [allColumns]="stockColumns"
              [total]="locationStocks().length"
              [searchable]="false"
              [showDensityToggle]="false"
            />
          </div>
        }

        <!-- TAB CONTENT: MOVEMENTS -->
        @if (activeTab() === 'movements') {
          <div class="tab-content">
            <app-data-table
              [data]="productMovements()"
              [allColumns]="movementColumns"
              [total]="productMovements().length"
              [searchable]="true"
            />
          </div>
        }

        <!-- TAB CONTENT: SUPPLIERS -->
        @if (activeTab() === 'suppliers') {
          <div class="tab-content grid grid--2">
            @for (sup of mockData.suppliers(); track sup.id) {
              <div class="card card--raised">
                <div class="layout-between">
                  <h3 class="text-subheading">{{ sup.name }}</h3>
                  <span class="chip chip--success">★ {{ sup.rating }}</span>
                </div>
                <div class="spec-list" style="margin-top: 12px;">
                  <div class="spec-row">
                    <span class="text-label">SUPPLIER CODE</span>
                    <span class="text-data">{{ sup.code }}</span>
                  </div>
                  <div class="spec-row">
                    <span class="text-label">LEAD TIME</span>
                    <span class="text-data">{{ sup.leadTimeDays }} DAYS</span>
                  </div>
                  <div class="spec-row">
                    <span class="text-label">TERMS</span>
                    <span class="text-body-sm">{{ sup.paymentTerms }}</span>
                  </div>
                  <div class="spec-row">
                    <span class="text-label">CONTACT EMAIL</span>
                    <span class="text-data text-caption">{{ sup.email }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- TAB CONTENT: BARCODES & RFID -->
        @if (activeTab() === 'barcodes') {
          <div class="tab-content grid grid--2">
            <div class="card">
              <span class="text-label text-muted">REGISTERED IDENTIFIERS</span>
              <div class="spec-list" style="margin-top: 16px;">
                @for (bc of prod.barcodes; track bc.id) {
                  <div class="spec-row">
                    <div>
                      <span class="chip chip--technical">{{ bc.type }}</span>
                      <span class="text-data text-subheading" style="margin-left: 8px;">{{ bc.code }}</span>
                    </div>
                    @if (bc.isPrimary) {
                      <span class="text-label text-success">[PRIMARY]</span>
                    }
                  </div>
                }
              </div>
            </div>

            <div class="card">
              <span class="text-label text-muted">VISUAL BARCODE REPRODUCTION</span>
              <div class="barcode-visual">
                <div class="barcode-lines" aria-hidden="true"></div>
                <span class="text-data text-caption">{{ prod.barcodes[0].code || prod.sku }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="page">
        <p class="text-subheading text-disabled">Product not located in catalog.</p>
        <a routerLink="/catalog/products" class="btn btn--secondary btn--sm">← RETURN TO CATALOG</a>
      </div>
    }
  `,
  styles: [`
    .kpi-strip {
      margin-bottom: var(--space-lg);
    }
    .tab-bar {
      display: flex;
      gap: 2px;
      border-bottom: 1px solid var(--border-visible);
      margin-bottom: var(--space-lg);
      overflow-x: auto;
    }
    .tab-btn {
      background: transparent;
      border: none;
      padding: 12px 20px;
      font-family: var(--font-data);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
    }
    .tab-btn:hover {
      color: var(--text-primary);
    }
    .tab-btn--active {
      color: var(--text-display);
      border-bottom-color: var(--accent);
      background: var(--surface);
    }
    .spec-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }
    .spec-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--space-xs);
    }
    .meta-box {
      margin-top: var(--space-xl);
      padding-top: var(--space-md);
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .barcode-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-xl);
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      margin-top: var(--space-md);
    }
    .barcode-lines {
      width: 220px;
      height: 60px;
      background: repeating-linear-gradient(
        90deg,
        var(--text-display) 0px,
        var(--text-display) 2px,
        transparent 2px,
        transparent 5px,
        var(--text-display) 5px,
        var(--text-display) 9px,
        transparent 9px,
        transparent 11px
      );
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  activeTab = signal<TabKey>('overview');
  product = signal<Product | null>(null);

  locationStocks = computed(() => {
    const p = this.product();
    if (!p) return [];
    return this.mockData.stockLevels().filter(s => s.productId === p.id);
  });

  productMovements = computed(() => {
    const p = this.product();
    if (!p) return [];
    return this.mockData.movements().filter(m => m.productId === p.id);
  });

  totalOnHand = computed(() => {
    return this.locationStocks().reduce((sum, s) => sum + s.quantityOnHand, 0);
  });

  totalValue = computed(() => {
    return this.locationStocks().reduce((sum, s) => sum + s.totalValue, 0);
  });

  locationsCount = computed(() => this.locationStocks().length);

  marginPercent = computed(() => {
    const p = this.product();
    if (!p || p.unitCost === 0) return 0;
    return (((p.unitPrice - p.unitCost) / p.unitPrice) * 100).toFixed(1);
  });

  categoryName = computed(() => {
    const p = this.product();
    if (!p) return '';
    return this.mockData.categories().find(c => c.id === p.categoryId)?.name || 'General';
  });

  brandName = computed(() => {
    const p = this.product();
    if (!p) return '';
    return this.mockData.brands().find(b => b.id === p.brandId)?.name || 'Generic';
  });

  stockColumns: TableColumn[] = [
    { key: 'locationName', label: 'LOCATION NAME', sortable: true },
    { key: 'quantityOnHand', label: 'ON HAND', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityReserved', label: 'RESERVED', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityAvailable', label: 'AVAILABLE', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityInTransit', label: 'IN TRANSIT', sortable: true, type: 'number', align: 'right' },
    { key: 'status', label: 'STATUS', sortable: true, type: 'status' }
  ];

  movementColumns: TableColumn[] = [
    { key: 'createdAt', label: 'TIMESTAMP', sortable: true, type: 'date' },
    { key: 'type', label: 'TYPE', sortable: true },
    { key: 'locationName', label: 'LOCATION', sortable: true },
    { key: 'quantity', label: 'QTY', sortable: true, type: 'number', align: 'right' },
    { key: 'newQuantity', label: 'BAL AFTER', sortable: true, type: 'number', align: 'right' },
    { key: 'referenceId', label: 'REFERENCE', sortable: true },
    { key: 'createdByName', label: 'OPERATOR', sortable: true }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.products().find(p => p.id === id);
      if (found) {
        this.product.set(found);
      }
    }
  }

  printLabel(): void {
    const p = this.product();
    if (p) {
      this.notifications.success(`[PRINTED] Label dispatch sent for ${p.sku}`);
    }
  }
}
