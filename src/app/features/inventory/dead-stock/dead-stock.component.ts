import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent } from '../../../shared';
import { TableColumn, StockLevel } from '../../../core/models';

@Component({
  selector: 'app-dead-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">DEAD STOCK & AGED INVENTORY</h1>
          <p class="page__subtitle">IDLE CAPITAL IDENTIFICATION • ZERO MOVEMENT > 90 DAYS</p>
        </div>
        <button class="btn btn--secondary btn--sm" (click)="notifications.success('[DISPATCH] Liquidation wave submitted to outlet channel.')">
          [ INITIATE LIQUIDATION PROMO ]
        </button>
      </div>

      <!-- Financial Impact KPI Cards -->
      <div class="grid grid--3" style="margin-bottom: 24px;">
        <div class="card card--compact">
          <span class="text-label text-muted">IDLE CAPITAL TIED UP</span>
          <span class="text-display-md text-data text-error">\${{ totalDeadCapital() | number:'1.0-0' }}</span>
          <span class="text-caption text-secondary">Carrying cost: \${{ carryingCost() | number:'1.0-0' }} / yr</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">AFFECTED SKUS</span>
          <span class="text-display-md text-data">{{ deadItems().length }}</span>
          <span class="text-caption text-secondary">Zero movement in 90+ days</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">RECOMMENDED ACTION</span>
          <span class="text-subheading" style="margin-top: 8px;">DISCOUNT 30% OR OUTLET DUMP</span>
        </div>
      </div>

      <div class="card">
        <app-data-table
          [data]="deadItems()"
          [allColumns]="columns"
          [total]="deadItems().length"
          [searchable]="true"
          [exportable]="true"
        />
      </div>
    </div>
  `
})
export class DeadStockComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  deadItems = computed(() => {
    return this.mockData.stockLevels().filter(s => s.quantityOnHand > 20).slice(0, 25);
  });

  totalDeadCapital = computed(() => {
    return this.deadItems().reduce((sum, s) => sum + s.totalValue, 0);
  });

  carryingCost = computed(() => this.totalDeadCapital() * 0.18);

  columns: TableColumn[] = [
    { key: 'productSku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'DESIGNATION', sortable: true },
    { key: 'locationName', label: 'FACILITY NODE', sortable: true },
    { key: 'quantityOnHand', label: 'IDLE UNITS', sortable: true, type: 'number', align: 'right' },
    { key: 'totalValue', label: 'CAPITAL TIED UP', sortable: true, type: 'currency', align: 'right' },
    {
      key: 'lastMovementDate',
      label: 'IDLE TIME',
      format: () => '114 DAYS'
    }
  ];
}
