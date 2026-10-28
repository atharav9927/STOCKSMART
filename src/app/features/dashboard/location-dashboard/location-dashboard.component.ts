import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { KpiCardComponent, DataTableComponent, StatusChipComponent } from '../../../shared';
import { Location, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-location-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, KpiCardComponent, DataTableComponent, StatusChipComponent],
  template: `
    @if (location(); as loc) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ loc.code }}</span>
              <span class="chip chip--technical">{{ loc.type }}</span>
            </div>
            <h1 class="page__title">{{ loc.name }} • OPERATIONS</h1>
            <p class="page__subtitle">{{ loc.address }} • SUPERVISOR: {{ loc.managerName }}</p>
          </div>
          <div class="layout-row layout-gap-sm">
            <a routerLink="/dashboard" class="btn btn--secondary btn--sm">← ENTERPRISE COMMAND</a>
          </div>
        </div>

        <div class="grid grid--4" style="margin-bottom: 24px;">
          <app-kpi-card
            label="FACILITY STOCK VALUE"
            [value]="totalVal()"
            [previousValue]="totalVal() * 0.95"
            format="currency"
            icon="◆"
            [trend]="[totalVal() * 0.9, totalVal() * 0.92, totalVal() * 0.94, totalVal() * 0.95, totalVal()]"
          />

          <app-kpi-card
            label="LOW STOCK ITEMS"
            [value]="lowCount()"
            [previousValue]="8"
            format="number"
            suffix="SKUS"
            icon="▼"
            [invertChange]="true"
            [trend]="[12, 10, 9, 8, lowCount()]"
          />

          <app-kpi-card
            label="STOCKOUT CRITICAL"
            [value]="outCount()"
            [previousValue]="3"
            format="number"
            suffix="SKUS"
            icon="✕"
            [invertChange]="true"
            [trend]="[5, 4, 4, 3, outCount()]"
          />

          <app-kpi-card
            label="ACTIVE SKUS"
            [value]="localStocks().length"
            [previousValue]="localStocks().length"
            format="number"
            suffix="SKUS"
            icon="▤"
            [trend]="[localStocks().length, localStocks().length]"
          />
        </div>

        <!-- Inventory List -->
        <div class="card">
          <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">LOCAL SITE INVENTORY</span>
          <app-data-table
            [data]="localStocks()"
            [allColumns]="columns"
            [total]="localStocks().length"
            [searchable]="true"
            [exportable]="true"
          />
        </div>
      </div>
    }
  `
})
export class LocationDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);

  location = signal<Location | null>(null);

  localStocks = computed(() => {
    const l = this.location();
    if (!l) return [];
    return this.mockData.stockLevels().filter(s => s.locationId === l.id);
  });

  totalVal = computed(() => {
    return this.localStocks().reduce((sum, s) => sum + s.totalValue, 0);
  });

  lowCount = computed(() => {
    return this.localStocks().filter(s => s.status === 'low_stock').length;
  });

  outCount = computed(() => {
    return this.localStocks().filter(s => s.status === 'out_of_stock').length;
  });

  columns: TableColumn[] = [
    { key: 'productSku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'DESIGNATION', sortable: true },
    { key: 'quantityOnHand', label: 'ON HAND', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityAvailable', label: 'AVAILABLE', sortable: true, type: 'number', align: 'right' },
    { key: 'totalValue', label: 'VALUE', sortable: true, type: 'currency', align: 'right' },
    { key: 'status', label: 'STATUS', sortable: true, type: 'status' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.locations().find(l => l.id === id);
      if (found) this.location.set(found);
    }
  }
}
