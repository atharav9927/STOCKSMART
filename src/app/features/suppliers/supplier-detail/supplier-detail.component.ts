import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent, StatusChipComponent } from '../../../shared';
import { Supplier, PurchaseOrder, TableColumn } from '../../../core/models';

type SupTab = 'profile' | 'products' | 'orders' | 'performance';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, StatusChipComponent],
  template: `
    @if (supplier(); as sup) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ sup.code }}</span>
              <span class="chip chip--success">★ {{ sup.rating }} SCORE</span>
            </div>
            <h1 class="page__title">{{ sup.name }}</h1>
            <p class="page__subtitle">{{ sup.contactName }} • {{ sup.email }} • {{ sup.phone }}</p>
          </div>
          <div class="layout-row layout-gap-sm">
            <a routerLink="/procurement/orders/new" class="btn btn--primary btn--sm">[ ISSUE PO TO VENDOR ]</a>
            <a routerLink="/suppliers" class="btn btn--secondary btn--sm">← SUPPLIERS</a>
          </div>
        </div>

        <!-- Metric Strips -->
        <div class="grid grid--4" style="margin-bottom: 24px;">
          <div class="card card--compact">
            <span class="text-label text-muted">ON-TIME SHIPMENT</span>
            <span class="text-display-md text-data text-success">{{ sup.onTimeDeliveryRate }}%</span>
          </div>
          <div class="card card--compact">
            <span class="text-label text-muted">QA PASS RATE</span>
            <span class="text-display-md text-data text-success">{{ sup.qualityRate }}%</span>
          </div>
          <div class="card card--compact">
            <span class="text-label text-muted">STANDARD LEAD TIME</span>
            <span class="text-display-md text-data">{{ sup.leadTimeDays }}d</span>
          </div>
          <div class="card card--compact">
            <span class="text-label text-muted">TOTAL PO ORDERS</span>
            <span class="text-display-md text-data">{{ supplierOrders().length }}</span>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tab-bar">
          <button class="tab-btn" [class.tab-btn--active]="activeTab() === 'profile'" (click)="activeTab.set('profile')">PROFILE & TERMS</button>
          <button class="tab-btn" [class.tab-btn--active]="activeTab() === 'products'" (click)="activeTab.set('products')">SUPPLIED SKUS</button>
          <button class="tab-btn" [class.tab-btn--active]="activeTab() === 'orders'" (click)="activeTab.set('orders')">PO ORDER HISTORY</button>
          <button class="tab-btn" [class.tab-btn--active]="activeTab() === 'performance'" (click)="activeTab.set('performance')">PERFORMANCE SCORECARD</button>
        </div>

        @if (activeTab() === 'profile') {
          <div class="grid grid--2">
            <div class="card">
              <span class="text-label text-muted">CONTRACTUAL TERMS</span>
              <div class="spec-list">
                <div class="spec-row">
                  <span class="text-label">PAYMENT TERMS</span>
                  <span class="text-data">{{ sup.paymentTerms }}</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">MINIMUM ORDER REQUISITION</span>
                  <span class="text-data">\${{ sup.minimumOrder | number:'1.0-0' }}</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">OPERATING CURRENCY</span>
                  <span class="text-data">{{ sup.currency }}</span>
                </div>
              </div>
            </div>

            <div class="card">
              <span class="text-label text-muted">VENDOR LOGISTICS ADDRESS</span>
              <p class="text-body-sm" style="margin-top: 12px; line-height: 1.6;">
                {{ sup.address }}<br />
                {{ sup.city }}, {{ sup.state }} {{ sup.zipCode }}<br />
                {{ sup.country }}
              </p>
            </div>
          </div>
        }

        @if (activeTab() === 'products') {
          <div class="card">
            <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">SOURCED CATALOG ITEMS</span>
            <table class="dt__table">
              <thead>
                <tr>
                  <th class="dt__th">SKU</th>
                  <th class="dt__th">DESIGNATION</th>
                  <th class="dt__th" style="text-align: right;">CONTRACT UNIT COST</th>
                  <th class="dt__th" style="text-align: right;">RETAIL PRICE</th>
                </tr>
              </thead>
              <tbody>
                @for (p of sampleProducts(); track p.id) {
                  <tr class="dt__row">
                    <td class="dt__td text-data">{{ p.sku }}</td>
                    <td class="dt__td">{{ p.name }}</td>
                    <td class="dt__td text-data" style="text-align: right;">\${{ p.unitCost }}</td>
                    <td class="dt__td text-data" style="text-align: right;">\${{ p.unitPrice }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (activeTab() === 'orders') {
          <div class="card">
            <app-data-table
              [data]="supplierOrders()"
              [allColumns]="orderColumns"
              [total]="supplierOrders().length"
              [searchable]="false"
            />
          </div>
        }

        @if (activeTab() === 'performance') {
          <div class="grid grid--2">
            <div class="card">
              <h3 class="text-subheading">SLA COMPLIANCE AUDIT</h3>
              <p class="text-caption text-secondary" style="margin: 8px 0 16px 0;">Calculated from past 12-month fulfillment ledger.</p>
              <div class="spec-list">
                <div class="spec-row">
                  <span class="text-label">DEFECT RATE</span>
                  <span class="text-data text-success">{{ (100 - sup.qualityRate).toFixed(1) }}% (Target &lt; 1%)</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">SHIPPING DELAY FREQUENCY</span>
                  <span class="text-data text-success">{{ (100 - sup.onTimeDeliveryRate).toFixed(1) }}%</span>
                </div>
                <div class="spec-row">
                  <span class="text-label">PRICE VOLATILITY INDEX</span>
                  <span class="text-data">0.4% / QTR</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
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
  `]
})
export class SupplierDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);

  activeTab = signal<SupTab>('profile');
  supplier = signal<Supplier | null>(null);

  supplierOrders = computed(() => {
    const s = this.supplier();
    if (!s) return [];
    return this.mockData.purchaseOrders().filter(po => po.supplierId === s.id);
  });

  sampleProducts = computed(() => {
    return this.mockData.products().slice(0, 8);
  });

  orderColumns: TableColumn[] = [
    { key: 'poNumber', label: 'PO NUMBER', sortable: true, width: '130px' },
    { key: 'expectedDeliveryDate', label: 'DELIVERY DATE', sortable: true, type: 'date' },
    { key: 'totalAmount', label: 'TOTAL', sortable: true, type: 'currency', align: 'right' },
    { key: 'status', label: 'STATUS', sortable: true, type: 'status' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.suppliers().find(s => s.id === id);
      if (found) this.supplier.set(found);
    }
  }
}
