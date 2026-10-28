import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent } from '../../../shared';
import { TableColumn } from '../../../core/models';

interface LocationValuation {
  locationId: string;
  locationName: string;
  type: string;
  totalSKUs: number;
  totalUnits: number;
  totalValue: number;
  percentOfTotal: number;
}

@Component({
  selector: 'app-valuation-report',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">STOCK VALUATION & ASSET AUDIT</h1>
          <p class="page__subtitle">COST BASIS VALUATION ACROSS NETWORK HUBS & CATEGORIES</p>
        </div>
      </div>

      <div class="grid grid--3" style="margin-bottom: 24px;">
        <div class="card card--compact">
          <span class="text-label text-muted">TOTAL ENTERPRISE VALUATION</span>
          <span class="text-display-md text-data text-success">\${{ enterpriseTotal() | number:'1.0-0' }}</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">TOTAL UNITS ON HAND</span>
          <span class="text-display-md text-data">{{ totalUnitsOnHand() | number }} PCS</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">AVERAGE UNIT COST BASIS</span>
          <span class="text-display-md text-data">\${{ avgUnitCost() | number:'1.2-2' }}</span>
        </div>
      </div>

      <div class="card">
        <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">FACILITY CAPITAL DISTRIBUTION</span>
        <app-data-table
          [data]="nodeValuations()"
          [allColumns]="columns"
          [total]="nodeValuations().length"
          [searchable]="false"
          [exportable]="true"
        />
      </div>
    </div>
  `
})
export class ValuationReportComponent {
  mockData = inject(MockDataService);

  enterpriseTotal = computed(() => {
    return this.mockData.stockLevels().reduce((sum, s) => sum + s.totalValue, 0);
  });

  totalUnitsOnHand = computed(() => {
    return this.mockData.stockLevels().reduce((sum, s) => sum + s.quantityOnHand, 0);
  });

  avgUnitCost = computed(() => {
    const units = this.totalUnitsOnHand();
    return units === 0 ? 0 : this.enterpriseTotal() / units;
  });

  nodeValuations = computed(() => {
    const total = this.enterpriseTotal() || 1;
    return this.mockData.locations().map(loc => {
      const locStocks = this.mockData.stockLevels().filter(s => s.locationId === loc.id);
      const locUnits = locStocks.reduce((sum, s) => sum + s.quantityOnHand, 0);
      const locVal = locStocks.reduce((sum, s) => sum + s.totalValue, 0);
      return {
        locationId: loc.id,
        locationName: loc.name,
        type: loc.type,
        totalSKUs: locStocks.length,
        totalUnits: locUnits,
        totalValue: locVal,
        percentOfTotal: Number(((locVal / total) * 100).toFixed(1))
      };
    });
  });

  columns: TableColumn[] = [
    { key: 'locationName', label: 'LOGISTICS NODE', sortable: true },
    { key: 'type', label: 'NODE TYPE', sortable: true },
    { key: 'totalSKUs', label: 'ACTIVE SKUS', sortable: true, type: 'number', align: 'right' },
    { key: 'totalUnits', label: 'ON HAND UNITS', sortable: true, type: 'number', align: 'right' },
    { key: 'totalValue', label: 'VALUATION (USD)', sortable: true, type: 'currency', align: 'right' },
    {
      key: 'percentOfTotal',
      label: 'SHARE OF ASSETS',
      sortable: true,
      format: (val) => `${val}%`
    }
  ];
}
