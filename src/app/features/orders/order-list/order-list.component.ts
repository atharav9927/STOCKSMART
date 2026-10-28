import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent, StatusChipComponent } from '../../../shared';
import { Order, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, StatusChipComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">CUSTOMER ORDERS & DISPATCH</h1>
          <p class="page__subtitle">OUTBOUND FULFILLMENT • PICKING WAVES & PACKING WORKSTATIONS</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <a routerLink="/orders/returns" class="btn btn--secondary btn--sm">[ RETURNS / RMA ]</a>
          <a routerLink="/orders/pos-sim" class="btn btn--secondary btn--sm">[ POS SIMULATOR ]</a>
        </div>
      </div>

      <app-data-table
        [data]="mockData.orders()"
        [allColumns]="columns"
        [total]="mockData.orders().length"
        [searchable]="true"
        (rowClick)="onRowClick($event)"
      />
    </div>
  `
})
export class OrderListComponent {
  mockData = inject(MockDataService);
  private router = inject(Router);

  columns: TableColumn[] = [
    { key: 'orderNumber', label: 'ORDER NUMBER', sortable: true, width: '130px' },
    { key: 'customerName', label: 'CLIENT / RECIPIENT', sortable: true },
    { key: 'locationName', label: 'FULFILMENT DC', sortable: true },
    { key: 'totalAmount', label: 'TOTAL', sortable: true, type: 'currency', align: 'right' },
    { key: 'createdAt', label: 'PLACED AT', sortable: true, type: 'date' },
    { key: 'status', label: 'STATUS', sortable: true, type: 'status' }
  ];

  onRowClick(row: Order): void {
    this.router.navigate(['/orders', row.id]);
  }
}
