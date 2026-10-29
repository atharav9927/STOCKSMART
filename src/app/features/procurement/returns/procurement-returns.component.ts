import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { VendorReturn, TableColumn } from '../../../core/models';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-procurement-returns',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DataTableComponent,
    StatusChipComponent,
    KpiCardComponent,
    BreadcrumbsComponent
  ],
  template: `
    <div class="page">
      <app-breadcrumbs
        [items]="[
          { label: 'PROCUREMENT', url: '/procurement/orders' },
          { label: 'VENDOR RETURNS (RTV)' }
        ]"
      />

      <div class="page__header">
        <div>
          <span class="text-label text-secondary">REVERSE LOGISTICS & CLAIMS</span>
          <h1 class="text-display">VENDOR RETURNS (RTV)</h1>
        </div>
        <button class="btn btn--primary" (click)="openCreateModal()">
          + NEW RTV REQUISITION
        </button>
      </div>

      <!-- KPI Summary Row -->
      <div class="kpi-grid">
        <app-kpi-card
          label="ACTIVE CLAIMS"
          [value]="activeClaimsCount()"
          [showChange]="false"
        />
        <app-kpi-card
          label="PENDING CREDIT"
          [value]="pendingCreditTotal()"
          format="currency"
          [showChange]="false"
        />
        <app-kpi-card
          label="CREDIT SETTLED"
          [value]="settledCreditTotal()"
          format="currency"
          [showChange]="false"
        />
        <app-kpi-card
          label="AVG VENDOR SLA"
          [value]="4.2"
          suffix="DAYS"
          [showChange]="false"
        />
      </div>

      <!-- Returns Table -->
      <app-data-table
        [data]="returns()"
        [allColumns]="columns"
        [total]="returns().length"
        [searchable]="true"
        searchPlaceholder="Filter returns by RTV#, vendor, or PO..."
      />

      <!-- Create RTV Modal -->
      @if (showModal()) {
        <div class="modal-backdrop">
          <div class="modal">
            <div class="modal__header">
              <span class="text-label text-display">INITIATE VENDOR RETURN (RTV)</span>
              <button class="btn btn--ghost btn--sm" (click)="showModal.set(false)">✕</button>
            </div>

            <div class="modal__body">
              <div class="form-group">
                <label class="text-label">SUPPLIER / VENDOR</label>
                <select class="select" [(ngModel)]="selectedSupplierId">
                  @for (s of mockData.suppliers(); track s.id) {
                    <option [value]="s.id">{{ s.name }} ({{ s.code }})</option>
                  }
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="text-label">ORIGIN WAREHOUSE</label>
                  <select class="select" [(ngModel)]="selectedLocationId">
                    @for (loc of mockData.locations(); track loc.id) {
                      <option [value]="loc.id">{{ loc.name }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label class="text-label">RETURN DISPOSITION REASON</label>
                  <select class="select" [(ngModel)]="selectedReason">
                    <option value="defective">Defective / Hardware Failure</option>
                    <option value="damaged_in_transit">Damaged in Transit</option>
                    <option value="over_shipment">Over-Shipment PO Surplus</option>
                    <option value="expired">Expired / Shelf-life Breach</option>
                    <option value="recall">Vendor Manufacturer Recall</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="text-label">PRODUCT SKU</label>
                  <select class="select" [(ngModel)]="selectedProductId">
                    @for (p of mockData.products().slice(0, 15); track p.id) {
                      <option [value]="p.id">{{ p.sku }} — {{ p.name }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label class="text-label">QUANTITY TO RETURN</label>
                  <input type="number" class="input" [(ngModel)]="returnQty" min="1" />
                </div>
              </div>

              <div class="form-group">
                <label class="text-label">DISPOSITION NOTES & EVIDENCE</label>
                <textarea
                  class="input"
                  rows="3"
                  [(ngModel)]="returnNotes"
                  placeholder="Detail failure symptoms, package photos reference, or RMA authorization numbers..."
                ></textarea>
              </div>
            </div>

            <div class="modal__footer">
              <button class="btn btn--outline" (click)="showModal.set(false)">CANCEL</button>
              <button class="btn btn--primary" (click)="submitReturn()">SUBMIT RTV CLAIM</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }
    .page__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-md);
    }
    .modal {
      width: 100%;
      max-width: 640px;
      background: var(--surface);
      border: 1px solid var(--border-visible);
      display: flex;
      flex-direction: column;
    }
    .modal__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md);
      border-bottom: 1px solid var(--border);
    }
    .modal__body {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .modal__footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-md);
      border-top: 1px solid var(--border);
    }
    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ProcurementReturnsComponent {
  readonly mockData = inject(MockDataService);
  private readonly notifications = inject(NotificationService);

  readonly returns = this.mockData.vendorReturns;
  readonly showModal = signal(false);

  selectedSupplierId = 'sup-1';
  selectedLocationId = 'loc-1';
  selectedReason: VendorReturn['reason'] = 'defective';
  selectedProductId = 'prod-1';
  returnQty = 5;
  returnNotes = '';

  readonly activeClaimsCount = computed(() =>
    this.returns().filter(r => r.status !== 'credit_received' && r.status !== 'rejected').length
  );

  readonly pendingCreditTotal = computed(() =>
    this.returns()
      .filter(r => r.status !== 'credit_received' && r.status !== 'rejected')
      .reduce((sum, r) => sum + r.totalCreditExpected, 0)
  );

  readonly settledCreditTotal = computed(() =>
    this.returns()
      .filter(r => r.status === 'credit_received')
      .reduce((sum, r) => sum + r.totalCreditExpected, 0)
  );

  readonly columns: TableColumn[] = [
    { key: 'returnNumber', label: 'RTV #', sortable: true, width: '130px' },
    { key: 'supplierName', label: 'SUPPLIER / VENDOR', sortable: true },
    { key: 'reason', label: 'DISPOSITION', sortable: true },
    { key: 'locationName', label: 'DISPATCH FROM', sortable: true },
    { key: 'totalCreditExpected', label: 'CREDIT CLAIM', sortable: true, type: 'currency', align: 'right' },
    { key: 'status', label: 'STATUS', sortable: true, type: 'status' },
    { key: 'createdAt', label: 'INITIATED', sortable: true, type: 'date' }
  ];

  openCreateModal(): void {
    this.showModal.set(true);
  }

  submitReturn(): void {
    const product = this.mockData.products().find(p => p.id === this.selectedProductId);
    const supplier = this.mockData.suppliers().find(s => s.id === this.selectedSupplierId);
    const location = this.mockData.locations().find(l => l.id === this.selectedLocationId);

    const cost = (product?.unitCost || 50) * this.returnQty;

    const newClaim = this.mockData.createVendorReturn({
      supplierId: this.selectedSupplierId,
      supplierName: supplier?.name || 'Apex Electronics',
      locationId: this.selectedLocationId,
      locationName: location?.name || 'CDC Hub',
      reason: this.selectedReason,
      totalCreditExpected: cost,
      notes: this.returnNotes,
      items: [
        {
          id: `rtvi-${Date.now()}`,
          productId: this.selectedProductId,
          productSku: product?.sku || 'SKU-001',
          productName: product?.name || 'Item',
          quantity: this.returnQty,
          unitCost: product?.unitCost || 50,
          totalCost: cost,
          reason: this.returnNotes || 'Vendor warranty claim'
        }
      ]
    });

    this.notifications.show(`Vendor return ${newClaim.returnNumber} created successfully`, 'success');
    this.showModal.set(false);
  }
}
