import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent } from '../../../shared';
import { TableColumn } from '../../../core/models';

interface AbcRow {
  sku: string;
  name: string;
  annualUnits: number;
  revenue: number;
  cumShare: number;
  classType: 'A' | 'B' | 'C';
}

@Component({
  selector: 'app-abc-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">ABC PARETO ANALYSIS</h1>
          <p class="page__subtitle">REVENUE CONCENTRATION & REORDER PRIORITY CLASSIFICATION</p>
        </div>
        <a routerLink="/reports" class="btn btn--secondary btn--sm">← REPORTS</a>
      </div>

      <div class="grid grid--3" style="margin-bottom: 24px;">
        <div class="card card--compact" style="border-left: 3px solid var(--accent);">
          <span class="text-label text-muted">CLASS A (HIGH IMPACT)</span>
          <span class="text-display-md text-data">78.4% REV</span>
          <span class="text-caption text-secondary">20% of SKUs • Strict daily monitoring</span>
        </div>
        <div class="card card--compact" style="border-left: 3px solid var(--warning);">
          <span class="text-label text-muted">CLASS B (MODERATE)</span>
          <span class="text-display-md text-data">15.8% REV</span>
          <span class="text-caption text-secondary">30% of SKUs • Weekly cycle audit</span>
        </div>
        <div class="card card--compact" style="border-left: 3px solid var(--interactive);">
          <span class="text-label text-muted">CLASS C (LOW IMPACT)</span>
          <span class="text-display-md text-data">5.8% REV</span>
          <span class="text-caption text-secondary">50% of SKUs • Automated bulk ordering</span>
        </div>
      </div>

      <div class="card">
        <app-data-table
          [data]="abcData()"
          [allColumns]="columns"
          [total]="abcData().length"
          [searchable]="true"
          [exportable]="true"
        />
      </div>
    </div>
  `
})
export class AbcAnalysisComponent {
  mockData = inject(MockDataService);

  abcData = computed(() => {
    const prods = this.mockData.products().slice(0, 40);
    return prods.map((p, idx) => {
      const cls: AbcRow['classType'] = idx < 8 ? 'A' : idx < 20 ? 'B' : 'C';
      return {
        sku: p.sku,
        name: p.name,
        annualUnits: (40 - idx) * 120,
        revenue: (40 - idx) * 120 * p.unitPrice,
        cumShare: Math.min(100, Math.round(15 + idx * 2.2)),
        classType: cls
      };
    });
  });

  columns: TableColumn[] = [
    {
      key: 'classType',
      label: 'CLASS',
      sortable: true,
      width: '100px',
      format: (val) => `CLASS ${val}`
    },
    { key: 'sku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'name', label: 'PRODUCT DESIGNATION', sortable: true },
    { key: 'annualUnits', label: 'ANNUAL VOLUME', sortable: true, type: 'number', align: 'right' },
    { key: 'revenue', label: 'ANNUAL REVENUE', sortable: true, type: 'currency', align: 'right' },
    {
      key: 'cumShare',
      label: 'CUMULATIVE %',
      sortable: true,
      align: 'right',
      format: (val) => `${val}%`
    }
  ];
}
