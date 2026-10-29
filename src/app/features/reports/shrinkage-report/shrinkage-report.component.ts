import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../core/models';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';

interface ShrinkageItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  facility: string;
  quantityLost: number;
  unitCost: number;
  totalLoss: number;
  primaryCause: 'theft' | 'damage' | 'discrepancy' | 'expired';
  lastIncidentDate: string;
}

@Component({
  selector: 'app-shrinkage-report',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCardComponent, DataTableComponent, BreadcrumbsComponent],
  template: `
    <div class="page">
      <app-breadcrumbs
        [items]="[
          { label: 'REPORTS', url: '/reports/kpis' },
          { label: 'SHRINKAGE & LOSS PREVENTION' }
        ]"
      />

      <div class="page__header">
        <div>
          <span class="text-label text-secondary">LOSS PREVENTION & INVENTORY RECONCILIATION</span>
          <h1 class="text-display">SHRINKAGE & WRITE-OFF ANALYSIS</h1>
        </div>
        <div class="header-filters">
          <select class="select" [(ngModel)]="selectedLocation">
            <option value="all">All Facilities</option>
            @for (loc of mockData.locations(); track loc.id) {
              <option [value]="loc.name">{{ loc.name }}</option>
            }
          </select>
          <button class="btn btn--outline" (click)="exportLossReport()">EXPORT CSV</button>
        </div>
      </div>

      <!-- KPI Metrics -->
      <div class="kpi-grid">
        <app-kpi-card
          label="NET SHRINKAGE VALUE"
          [value]="totalLossValue()"
          format="currency"
          [showChange]="false"
        />
        <app-kpi-card
          label="OVERALL SHRINK RATE"
          [value]="0.84"
          suffix="%"
          [showChange]="false"
        />
        <app-kpi-card
          label="DAMAGE WRITE-OFFS"
          [value]="damageLossTotal()"
          format="currency"
          [showChange]="false"
        />
        <app-kpi-card
          label="UNEXPLAINED VARIANCE"
          [value]="theftDiscrepancyTotal()"
          format="currency"
          [showChange]="false"
        />
      </div>

      <!-- Loss Breakdown by Cause -->
      <div class="breakdown-grid">
        <div class="breakdown-card">
          <span class="text-label text-display">LOSS ALLOCATION BY CAUSE</span>
          <div class="bar-row">
            <div class="bar-label">
              <span>HANDLING DAMAGE</span>
              <span class="text-data">$18,420 (41%)</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width: 41%; background: var(--warning);"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-label">
              <span>UNEXPLAINED VARIANCE</span>
              <span class="text-data">$14,290 (32%)</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width: 32%; background: var(--accent);"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-label">
              <span>EXPIRY / OBSOLESCENCE</span>
              <span class="text-data">$7,850 (18%)</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width: 18%; background: var(--interactive);"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-label">
              <span>SUSPECTED PILFERAGE</span>
              <span class="text-data">$4,120 (9%)</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width: 9%; background: var(--text-primary);"></div></div>
          </div>
        </div>

        <div class="breakdown-card">
          <span class="text-label text-display">TOP FACILITY EXPOSURE</span>
          <div class="facility-stat">
            <span class="facility-name">Central Distribution Center (CDC)</span>
            <span class="text-data font-bold text-error">$21,490</span>
          </div>
          <div class="facility-stat">
            <span class="facility-name">North Regional Hub (NRH)</span>
            <span class="text-data font-bold text-warning">$12,300</span>
          </div>
          <div class="facility-stat">
            <span class="facility-name">South Regional Hub (SRH)</span>
            <span class="text-data font-bold text-warning">$7,150</span>
          </div>
          <div class="facility-stat">
            <span class="facility-name">West Fulfillment Depot (WFD)</span>
            <span class="text-data font-bold text-success">$3,740</span>
          </div>
        </div>
      </div>

      <!-- High Shrink Items Table -->
      <app-data-table
        [data]="filteredItems()"
        [allColumns]="columns"
        [total]="filteredItems().length"
        [searchable]="true"
        searchPlaceholder="Filter high-shrink SKUs..."
      />
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
    .header-filters {
      display: flex;
      gap: var(--space-sm);
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
    }
    .breakdown-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }
    .breakdown-card {
      background: var(--surface);
      border: 1px solid var(--border-visible);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .bar-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .bar-label {
      display: flex;
      justify-content: space-between;
      font-family: var(--font-data);
      font-size: 11px;
    }
    .bar-track {
      width: 100%;
      height: 8px;
      background: var(--surface-raised);
    }
    .bar-fill {
      height: 100%;
    }
    .facility-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-sm) 0;
      border-bottom: 1px solid var(--border);
    }
    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .breakdown-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .page__header { flex-direction: column; align-items: flex-start; gap: var(--space-md); }
    }
  `]
})
export class ShrinkageReportComponent {
  readonly mockData = inject(MockDataService);
  selectedLocation = 'all';

  readonly items = signal<ShrinkageItem[]>([
    { id: '1', sku: 'SKU-00001', productName: 'Pro Display Panel 27"', category: 'Electronics', facility: 'Central Distribution Center (CDC)', quantityLost: 8, unitCost: 1150.00, totalLoss: 9200.00, primaryCause: 'damage', lastIncidentDate: '2026-10-18' },
    { id: '2', sku: 'SKU-00012', productName: 'Wireless Barcode Scanner Zebra', category: 'Hardware', facility: 'North Regional Hub (NRH)', quantityLost: 14, unitCost: 380.00, totalLoss: 5320.00, primaryCause: 'theft', lastIncidentDate: '2026-10-22' },
    { id: '3', sku: 'SKU-00045', productName: 'Thermal Label Cartridge Bulk', category: 'Packaging', facility: 'Central Distribution Center (CDC)', quantityLost: 110, unitCost: 35.00, totalLoss: 3850.00, primaryCause: 'damage', lastIncidentDate: '2026-10-14' },
    { id: '4', sku: 'SKU-00088', productName: 'Precision Sensor Module v4', category: 'Components', facility: 'South Regional Hub (SRH)', quantityLost: 25, unitCost: 140.00, totalLoss: 3500.00, primaryCause: 'discrepancy', lastIncidentDate: '2026-10-25' },
    { id: '5', sku: 'SKU-00104', productName: 'Industrial Power Brick 65W', category: 'Electronics', facility: 'West Fulfillment Depot (WFD)', quantityLost: 42, unitCost: 48.00, totalLoss: 2016.00, primaryCause: 'discrepancy', lastIncidentDate: '2026-10-11' },
    { id: '6', sku: 'SKU-00215', productName: 'Lithium Battery Assembly 12V', category: 'Components', facility: 'Central Distribution Center (CDC)', quantityLost: 18, unitCost: 95.00, totalLoss: 1710.00, primaryCause: 'expired', lastIncidentDate: '2026-10-04' }
  ]);

  readonly filteredItems = computed(() => {
    if (this.selectedLocation === 'all') return this.items();
    return this.items().filter(i => i.facility === this.selectedLocation);
  });

  readonly totalLossValue = computed(() =>
    this.filteredItems().reduce((sum, i) => sum + i.totalLoss, 0)
  );

  readonly damageLossTotal = computed(() =>
    this.filteredItems().filter(i => i.primaryCause === 'damage').reduce((sum, i) => sum + i.totalLoss, 0)
  );

  readonly theftDiscrepancyTotal = computed(() =>
    this.filteredItems().filter(i => i.primaryCause === 'theft' || i.primaryCause === 'discrepancy').reduce((sum, i) => sum + i.totalLoss, 0)
  );

  readonly columns: TableColumn[] = [
    { key: 'sku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'ITEM DESCRIPTION', sortable: true },
    { key: 'facility', label: 'FACILITY', sortable: true },
    { key: 'primaryCause', label: 'CAUSE', sortable: true },
    { key: 'quantityLost', label: 'QTY LOST', sortable: true, align: 'right' },
    { key: 'totalLoss', label: 'FINANCIAL LOSS', sortable: true, type: 'currency', align: 'right' },
    { key: 'lastIncidentDate', label: 'INCIDENT DATE', sortable: true, type: 'date' }
  ];

  exportLossReport(): void {
    const csv = [
      ['SKU', 'Product Name', 'Facility', 'Cause', 'Quantity Lost', 'Unit Cost', 'Total Loss', 'Date'],
      ...this.filteredItems().map(i => [
        i.sku,
        `"${i.productName}"`,
        `"${i.facility}"`,
        i.primaryCause,
        i.quantityLost,
        i.unitCost,
        i.totalLoss,
        i.lastIncidentDate
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stocksmart-shrinkage-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
