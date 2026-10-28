import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent, StatusChipComponent } from '../../../shared';
import { PurchaseOrder, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, StatusChipComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">PURCHASE ORDERS & REPLENISHMENT</h1>
          <p class="page__subtitle">VENDOR REQUISITIONS, LINE ITEMS & DOCK RECEIPT DOCKETS</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <a routerLink="/procurement/suggestions" class="btn btn--secondary btn--sm">[ VIEW SUGGESTIONS ]</a>
          <a routerLink="/procurement/orders/new" class="btn btn--primary btn--sm">[ + DRAFT NEW PO ]</a>
        </div>
      </div>

      <app-data-table
        [data]="mockData.purchaseOrders()"
        [allColumns]="columns"
        [total]="mockData.purchaseOrders().length"
        [searchable]="true"
        (rowClick)="onRowClick($event)"
      />
    </div>
  `
})
export class PoListComponent {
  mockData = inject(MockDataService);
  private router = inject(Router);

  columns: TableColumn[] = [
    { key: 'poNumber', label: 'PO NUMBER', sortable: true, width: '140px' },
    { key: 'supplierName', label: 'VENDOR / SUPPLIER', sortable: true },
    { key: 'locationName', label: 'DELIVERY DESTINATION', sortable: true },
    { key: 'totalAmount', label: 'TOTAL VALUE', sortable: true, type: 'currency', align: 'right' },
    { key: 'expectedDeliveryDate', label: 'EST. DELIVERY', sortable: true, type: 'date' },
    { key: 'createdByName', label: 'PURCHASER', sortable: true },
    { key: 'status', label: 'ORDER STATE', sortable: true, type: 'status' }
  ];

  onRowClick(row: PurchaseOrder): void {
    this.router.navigate(['/procurement/orders', row.id]);
  }
}
