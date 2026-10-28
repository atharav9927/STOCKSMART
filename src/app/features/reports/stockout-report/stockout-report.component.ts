import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent, StatusChipComponent } from '../../../shared';
import { TableColumn, StockLevel } from '../../../core/models';

@Component({
  selector: 'app-stockout-report',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, StatusChipComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">STOCKOUT INCIDENTS & REVENUE RISK</h1>
          <p class="page__subtitle">ZERO-INVENTORY SKUS • ESTIMATED LOST SALES & DEPLETION ACCELERATION</p>
        </div>
        <a routerLink="/procurement/suggestions" class="btn btn--primary btn--sm">[ VIEW REORDER QUEUE ]</a>
      </div>

      <div class="grid grid--3" style="margin-bottom: 24px;">
        <div class="card card--compact">
          <span class="text-label text-muted">CRITICAL STOCKOUT NODES</span>
          <span class="text-display-md text-data text-error">{{ stockouts().length }}</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">ESTIMATED REVENUE AT RISK</span>
          <span class="text-display-md text-data text-error">\${{ revenueAtRisk() | number:'1.0-0' }}</span>
          <span class="text-caption text-secondary">Based on past 30-day velocity</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">OUT-OF-STOCK RATE</span>
          <span class="text-display-md text-data">{{ stockoutRate() }}%</span>
          <span class="text-caption text-secondary">Enterprise threshold: &lt; 2.0%</span>
        </div>
      </div>

      <div class="card">
        <app-data-table
          [data]="stockouts()"
          [allColumns]="columns"
          [total]="stockouts().length"
          [searchable]="true"
          [exportable]="true"
        />
      </div>
    </div>
  `
})
export class StockoutReportComponent {
  mockData = inject(MockDataService);

  stockouts = computed(() => {
    return this.mockData.stockLevels().filter(s => s.status === 'out_of_stock');
  });

  revenueAtRisk = computed(() => {
    return this.stockouts().reduce((sum, s) => sum + (s.reorderQuantity * s.unitCost * 1.4), 0);
  });

  stockoutRate = computed(() => {
    const total = this.mockData.stockLevels().length || 1;
    return ((this.stockouts().length / total) * 100).toFixed(1);
  });

  columns: TableColumn[] = [
    { key: 'productSku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'DESIGNATION', sortable: true },
    { key: 'locationName', label: 'FACILITY NODE', sortable: true },
    { key: 'reorderPoint', label: 'TARGET MIN', sortable: true, type: 'number', align: 'right' },
    { key: 'reorderQuantity', label: 'RECOMMENDED ORDER', sortable: true, type: 'number', align: 'right' },
    {
      key: 'status',
      label: 'SEVERITY',
      format: () => '✕ CRITICAL STOCKOUT'
    }
  ];
}
