import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, StatusChipComponent } from '../../../shared';
import { InventoryMovement, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-movement-ledger',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent, StatusChipComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">INVENTORY MOVEMENTS AUDIT LEDGER</h1>
          <p class="page__subtitle">IMMUTABLE LOG OF RECEIPTS, DISPATCHES, SALES & RECONCILIATIONS</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <a routerLink="/inventory/adjustments" class="btn btn--primary btn--sm">[ + RECORD MOVEMENT ]</a>
        </div>
      </div>

      <!-- Filters Ribbon -->
      <div class="card card--compact" style="margin-bottom: 16px;">
        <div class="layout-row layout-gap-md layout-wrap">
          <div>
            <label class="text-label">MOVEMENT TYPE</label>
            <select
              class="form-field__input form-field__input--boxed"
              [ngModel]="typeFilter()"
              (ngModelChange)="typeFilter.set($event)"
            >
              <option value="all">ALL TYPES</option>
              <option value="receipt">RECEIPT (+)</option>
              <option value="sale">SALE (-)</option>
              <option value="transfer_in">TRANSFER IN (+)</option>
              <option value="transfer_out">TRANSFER OUT (-)</option>
              <option value="adjustment">ADJUSTMENT (±)</option>
              <option value="damage">DAMAGE (-)</option>
            </select>
          </div>

          <div>
            <label class="text-label">FACILITY NODE</label>
            <select
              class="form-field__input form-field__input--boxed"
              [ngModel]="locationFilter()"
              (ngModelChange)="locationFilter.set($event)"
            >
              <option value="all">ALL FACILITIES</option>
              @for (loc of mockData.locations(); track loc.id) {
                <option [value]="loc.id">{{ loc.code }} — {{ loc.name }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <app-data-table
        [data]="filteredMovements()"
        [allColumns]="columns"
        [total]="filteredMovements().length"
        [searchable]="true"
        [exportable]="true"
        (export)="notifications.success('[EXPORT] Audit ledger exported to CSV.')"
      />
    </div>
  `
})
export class MovementLedgerComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  typeFilter = signal<string>('all');
  locationFilter = signal<string>('all');

  filteredMovements = computed(() => {
    let list = this.mockData.movements();
    const t = this.typeFilter();
    const l = this.locationFilter();

    if (t !== 'all') list = list.filter(m => m.type === t);
    if (l !== 'all') list = list.filter(m => m.locationId === l);
    return list;
  });

  columns: TableColumn[] = [
    { key: 'createdAt', label: 'TIMESTAMP', sortable: true, type: 'date', width: '130px' },
    { key: 'type', label: 'TYPE', sortable: true, width: '120px' },
    { key: 'productSku', label: 'SKU', sortable: true, width: '120px' },
    { key: 'productName', label: 'DESIGNATION', sortable: true },
    { key: 'locationName', label: 'LOCATION', sortable: true },
    { key: 'quantity', label: 'CHANGE', sortable: true, type: 'number', align: 'right' },
    { key: 'previousQuantity', label: 'PREV', sortable: true, type: 'number', align: 'right' },
    { key: 'newQuantity', label: 'NEW BAL', sortable: true, type: 'number', align: 'right' },
    { key: 'referenceId', label: 'REFERENCE NO', sortable: true },
    { key: 'createdByName', label: 'OPERATOR', sortable: true }
  ];
}
