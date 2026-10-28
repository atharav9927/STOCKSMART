import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, StatusChipComponent, LocationPickerComponent } from '../../../shared';
import { StockCount, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-count-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent, StatusChipComponent, LocationPickerComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">CYCLE & PHYSICAL STOCK COUNTS</h1>
          <p class="page__subtitle">PERIODIC AUDITS, WALL-TO-WALL INVENTORIES & BLIND TALLIES</p>
        </div>
        <button class="btn btn--primary btn--sm" (click)="showNewModal.set(true)">
          [ + INITIALIZE COUNT SESSION ]
        </button>
      </div>

      @if (showNewModal()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">CONFIGURE AUDIT SESSION</span>
          <div class="grid grid--3" style="margin-top: 16px;">
            <app-location-picker
              label="FACILITY NODE *"
              [selectedId]="locationId"
              (locationSelected)="locationId = $event.id"
            />
            <div>
              <label class="text-label">COUNT SCOPE / METHOD *</label>
              <select class="form-field__input form-field__input--boxed" [(ngModel)]="countType">
                <option value="cycle">Cycle Count (High Velocity ABC)</option>
                <option value="full">Full Wall-to-Wall Physical</option>
                <option value="spot">Spot Check (Discrepancy Investigation)</option>
              </select>
            </div>
          </div>
          <div class="layout-row layout-gap-sm" style="margin-top: 16px;">
            <button class="btn btn--primary btn--sm" (click)="startCount()">LAUNCH SCAN SESSION</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewModal.set(false)">CANCEL</button>
          </div>
        </div>
      }

      <app-data-table
        [data]="mockData.counts()"
        [allColumns]="columns"
        [total]="mockData.counts().length"
        [searchable]="true"
        (rowClick)="onRowClick($event)"
      />
    </div>
  `
})
export class CountListComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  showNewModal = signal(false);
  locationId = 'loc-003';
  countType: StockCount['type'] = 'cycle';

  columns: TableColumn[] = [
    { key: 'countNumber', label: 'AUDIT NO', sortable: true, width: '130px' },
    { key: 'locationName', label: 'FACILITY NODE', sortable: true },
    { key: 'type', label: 'METHOD', sortable: true },
    { key: 'totalItems', label: 'TOTAL SKUS', sortable: true, type: 'number', align: 'right' },
    { key: 'countedItems', label: 'COUNTED', sortable: true, type: 'number', align: 'right' },
    { key: 'varianceItems', label: 'VARIANCES', sortable: true, type: 'number', align: 'right' },
    { key: 'status', label: 'STATUS', sortable: true, type: 'status' }
  ];

  onRowClick(row: StockCount): void {
    this.router.navigate(['/inventory/counts', row.id]);
  }

  startCount(): void {
    const loc = this.mockData.locations().find(l => l.id === this.locationId);
    if (!loc) return;

    const prods = this.mockData.products().slice(0, 5);
    const newCount: StockCount = {
      id: `cnt-${Date.now()}`,
      countNumber: `CNT-2024-${100 + this.mockData.counts().length + 1}`,
      locationId: loc.id,
      locationName: loc.name,
      status: 'in_progress',
      type: this.countType,
      items: prods.map(p => ({
        id: `ci-${p.id}`,
        productId: p.id,
        productSku: p.sku,
        productName: p.name,
        expectedQuantity: 40,
        countedQuantity: null,
        variance: null,
        variancePercent: null,
        status: 'pending',
        countedAt: null,
        countedBy: null
      })),
      totalItems: prods.length,
      countedItems: 0,
      varianceItems: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      createdBy: 'usr-004',
      createdByName: 'David Kim'
    };

    this.mockData.counts.update(list => [newCount, ...list]);
    this.notifications.success(`[INITIALIZED] Audit session ${newCount.countNumber} active.`);
    this.showNewModal.set(false);
    this.router.navigate(['/inventory/counts', newCount.id]);
  }
}
