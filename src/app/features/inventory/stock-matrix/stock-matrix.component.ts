import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, StatusChipComponent, QuantityBadgeComponent } from '../../../shared';
import { TableColumn, StockLevel } from '../../../core/models';

@Component({
  selector: 'app-stock-matrix',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent, StatusChipComponent, QuantityBadgeComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">STOCK ALLOCATION MATRIX</h1>
          <p class="page__subtitle">GLOBAL MULTI-NODE INVENTORY MAPPING • SKU × LOCATION</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <a routerLink="/inventory/adjustments" class="btn btn--secondary btn--sm">[ + ADJUSTMENT ]</a>
          <a routerLink="/inventory/transfers" class="btn btn--primary btn--sm">[ + TRANSFER WAVE ]</a>
        </div>
      </div>

      <!-- Filters Ribbon -->
      <div class="matrix-filter card card--compact">
        <div class="layout-row layout-gap-md layout-wrap">
          <div>
            <label class="text-label">FILTER LOCATION</label>
            <select
              class="form-field__input form-field__input--boxed"
              [ngModel]="selectedLocationFilter()"
              (ngModelChange)="selectedLocationFilter.set($event)"
            >
              <option value="all">ALL NODES (ENTERPRISE)</option>
              @for (loc of mockData.locations(); track loc.id) {
                <option [value]="loc.id">{{ loc.code }} — {{ loc.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="text-label">STOCK STATUS</label>
            <select
              class="form-field__input form-field__input--boxed"
              [ngModel]="statusFilter()"
              (ngModelChange)="statusFilter.set($event)"
            >
              <option value="all">ALL STATES</option>
              <option value="in_stock">IN STOCK ONLY</option>
              <option value="low_stock">LOW STOCK ALERT</option>
              <option value="out_of_stock">STOCKOUT CRITICAL</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Matrix Table -->
      <app-data-table
        [data]="filteredStocks()"
        [allColumns]="columns"
        [total]="filteredStocks().length"
        [searchable]="true"
        [selectable]="true"
        [exportable]="true"
        (export)="notifications.success('[EXPORT] Stock matrix CSV generated.')"
      >
        <div bulkActions class="layout-row layout-gap-xs">
          <button class="btn btn--secondary btn--sm" (click)="reorderSelected()">REORDER SELECTED</button>
        </div>
      </app-data-table>
    </div>
  `,
  styles: [`
    .matrix-filter {
      margin-bottom: var(--space-md);
      background: var(--surface-raised);
    }
  `]
})
export class StockMatrixComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  selectedLocationFilter = signal<string>('all');
  statusFilter = signal<string>('all');

  filteredStocks = computed(() => {
    let list = this.mockData.stockLevels();
    const loc = this.selectedLocationFilter();
    const status = this.statusFilter();

    if (loc !== 'all') {
      list = list.filter(s => s.locationId === loc);
    }
    if (status !== 'all') {
      list = list.filter(s => s.status === status);
    }
    return list;
  });

  columns: TableColumn[] = [
    { key: 'productSku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'PRODUCT DESIGNATION', sortable: true },
    { key: 'locationName', label: 'WAREHOUSE / STORE NODE', sortable: true },
    { key: 'quantityOnHand', label: 'ON HAND', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityReserved', label: 'RESERVED', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityAvailable', label: 'AVAILABLE', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityInTransit', label: 'IN TRANSIT', sortable: true, type: 'number', align: 'right' },
    { key: 'totalValue', label: 'VALUE', sortable: true, type: 'currency', align: 'right' },
    { key: 'status', label: 'HEALTH STATUS', sortable: true, type: 'status' }
  ];

  reorderSelected(): void {
    this.notifications.show('[ROUTED] Reorder requisitions created for flagged items', 'info');
  }
}
