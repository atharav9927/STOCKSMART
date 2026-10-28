import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, StatusChipComponent, QuantityBadgeComponent } from '../../../shared';
import { TableColumn, Product } from '../../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent, StatusChipComponent, QuantityBadgeComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">PRODUCT CATALOG</h1>
          <p class="page__subtitle">HARDWARE SKUS, PRICING SPECIFICATIONS & VARIANTS</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <a routerLink="/catalog/import" class="btn btn--secondary btn--sm">[ IMPORT CSV ]</a>
          <a routerLink="/catalog/labels" class="btn btn--secondary btn--sm">[ PRINT LABELS ]</a>
          <a routerLink="/catalog/products/new" class="btn btn--primary btn--sm">[ + NEW SKU ]</a>
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="catalog-summary card card--compact">
        <div class="stat-pill">
          <span class="text-label">TOTAL SKUS</span>
          <span class="text-data text-subheading">{{ mockData.products().length }}</span>
        </div>
        <div class="stat-pill">
          <span class="text-label">ACTIVE HARDWARE</span>
          <span class="text-data text-subheading text-success">{{ activeCount() }}</span>
        </div>
        <div class="stat-pill">
          <span class="text-label">CATEGORIES</span>
          <span class="text-data text-subheading">{{ mockData.categories().length }}</span>
        </div>
        <div class="stat-pill">
          <span class="text-label">BRANDS</span>
          <span class="text-data text-subheading">{{ mockData.brands().length }}</span>
        </div>
      </div>

      <!-- Main Product Table -->
      <app-data-table
        [data]="products()"
        [allColumns]="columns"
        [total]="products().length"
        [searchable]="true"
        [selectable]="true"
        [exportable]="true"
        (rowClick)="onRowClick($event)"
        (export)="onExport()"
      >
        <div bulkActions class="layout-row layout-gap-xs">
          <button class="btn btn--secondary btn--sm" (click)="bulkPrintLabels()">PRINT SELECTED</button>
        </div>
      </app-data-table>
    </div>
  `,
  styles: [`
    .catalog-summary {
      display: flex;
      gap: var(--space-xl);
      margin-bottom: var(--space-md);
      background: var(--surface-raised);
      flex-wrap: wrap;
    }
    .stat-pill {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  `]
})
export class ProductListComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  products = this.mockData.products;

  activeCount = computed(() => this.products().filter(p => p.isActive).length);

  columns: TableColumn[] = [
    { key: 'sku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'name', label: 'PRODUCT DESIGNATION', sortable: true },
    {
      key: 'categoryId',
      label: 'CATEGORY',
      sortable: true,
      format: (val) => {
        const cat = this.mockData.categories().find(c => c.id === val);
        return cat ? cat.name : 'General';
      }
    },
    {
      key: 'brandId',
      label: 'BRAND',
      sortable: true,
      format: (val) => {
        const b = this.mockData.brands().find(br => br.id === val);
        return b ? b.name : 'Generic';
      }
    },
    { key: 'unitCost', label: 'UNIT COST', sortable: true, type: 'currency', align: 'right' },
    { key: 'unitPrice', label: 'RETAIL PRICE', sortable: true, type: 'currency', align: 'right' },
    { key: 'reorderPoint', label: 'REORDER PT', sortable: true, type: 'number', align: 'right' },
    {
      key: 'isActive',
      label: 'STATUS',
      sortable: true,
      format: (val) => val ? '● ACTIVE' : '○ INACTIVE'
    }
  ];

  onRowClick(row: Product): void {
    this.router.navigate(['/catalog/products', row.id]);
  }

  onExport(): void {
    this.notifications.success('[EXPORT] Product catalog exported to CSV format.');
  }

  bulkPrintLabels(): void {
    this.notifications.show('[QUEUE] Barcode print jobs queued for selected items', 'info');
  }
}
