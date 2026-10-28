import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, StatusChipComponent, LocationPickerComponent, ProductPickerComponent } from '../../../shared';
import { StockTransfer, TableColumn, Location, Product } from '../../../core/models';

@Component({
  selector: 'app-transfer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent, StatusChipComponent, LocationPickerComponent, ProductPickerComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">INTER-FACILITY STOCK TRANSFERS</h1>
          <p class="page__subtitle">DISPATCH WAVES, REPLENISHMENT ORDERS & TRANSIT RECONCILIATION</p>
        </div>
        <button class="btn btn--primary btn--sm" (click)="showNewModal.set(true)">
          [ + CREATE TRANSFER WAVE ]
        </button>
      </div>

      <!-- Quick Modal Drawer for New Transfer -->
      @if (showNewModal()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">INITIATE INTER-SITE TRANSFER</span>
          <div class="grid grid--3" style="margin-top: 16px;">
            <app-location-picker
              label="ORIGIN FACILITY (FROM) *"
              [selectedId]="fromLocationId"
              (locationSelected)="fromLocationId = $event.id"
            />
            <app-location-picker
              label="DESTINATION FACILITY (TO) *"
              [selectedId]="toLocationId"
              (locationSelected)="toLocationId = $event.id"
            />
            <app-product-picker
              label="PRODUCT SKU *"
              [selectedId]="productId"
              (productSelected)="productId = $event.id"
            />
          </div>

          <div class="layout-row layout-gap-md" style="margin-top: 16px;">
            <div style="max-width: 180px;">
              <label class="text-label">QUANTITY *</label>
              <input type="number" class="form-field__input form-field__input--boxed text-data" min="1" [(ngModel)]="transferQty" />
            </div>
            <div style="flex: 1;">
              <label class="text-label">NOTES / CARRIER WAYBILL</label>
              <input type="text" class="form-field__input form-field__input--boxed" placeholder="e.g. Expedited pallet transfer via FedEx Freight" [(ngModel)]="transferNotes" />
            </div>
          </div>

          <div class="layout-row layout-gap-sm" style="margin-top: 16px;">
            <button class="btn btn--primary btn--sm" (click)="saveTransfer()">SUBMIT TRANSFER WAVE</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewModal.set(false)">CANCEL</button>
          </div>
        </div>
      }

      <app-data-table
        [data]="mockData.transfers()"
        [allColumns]="columns"
        [total]="mockData.transfers().length"
        [searchable]="true"
        (rowClick)="onRowClick($event)"
      />
    </div>
  `
})
export class TransferListComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  showNewModal = signal(false);
  fromLocationId = 'loc-001';
  toLocationId = 'loc-003';
  productId = 'prod-1';
  transferQty = 25;
  transferNotes = '';

  columns: TableColumn[] = [
    { key: 'transferNumber', label: 'TRANSFER NO', sortable: true, width: '140px' },
    { key: 'fromLocationName', label: 'ORIGIN NODE', sortable: true },
    { key: 'toLocationName', label: 'DESTINATION NODE', sortable: true },
    {
      key: 'items',
      label: 'ITEMS COUNT',
      format: (val: any) => `${val?.length || 0} SKUs`
    },
    { key: 'requestedByName', label: 'REQUESTED BY', sortable: true },
    { key: 'status', label: 'WORKFLOW STATE', sortable: true, type: 'status' }
  ];

  onRowClick(row: StockTransfer): void {
    this.router.navigate(['/inventory/transfers', row.id]);
  }

  saveTransfer(): void {
    const fromLoc = this.mockData.locations().find(l => l.id === this.fromLocationId);
    const toLoc = this.mockData.locations().find(l => l.id === this.toLocationId);
    const prod = this.mockData.products().find(p => p.id === this.productId);

    if (!fromLoc || !toLoc || !prod || fromLoc.id === toLoc.id) {
      this.notifications.error('[ERROR] Origin and destination nodes must be distinct.');
      return;
    }

    const tr = this.mockData.createTransfer({
      fromLocationId: fromLoc.id,
      fromLocationName: fromLoc.name,
      toLocationId: toLoc.id,
      toLocationName: toLoc.name,
      notes: this.transferNotes,
      items: [
        {
          id: `ti-${Date.now()}`,
          productId: prod.id,
          productSku: prod.sku,
          productName: prod.name,
          quantityRequested: this.transferQty,
          quantityDispatched: 0,
          quantityReceived: 0
        }
      ]
    });

    this.notifications.success(`[SUBMITTED] Transfer wave ${tr.transferNumber} created.`);
    this.showNewModal.set(false);
  }
}
