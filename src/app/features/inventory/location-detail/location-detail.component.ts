import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent, QuantityBadgeComponent, StatusChipComponent } from '../../../shared';
import { Location, StockLevel, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, QuantityBadgeComponent, StatusChipComponent],
  template: `
    @if (location(); as loc) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ loc.code }}</span>
              <span class="chip chip--technical">{{ loc.type }}</span>
            </div>
            <h1 class="page__title">{{ loc.name }}</h1>
            <p class="page__subtitle">{{ loc.address }} • {{ loc.city }}, {{ loc.state }} {{ loc.zipCode }}</p>
          </div>
          <div class="layout-row layout-gap-sm">
            <a routerLink="/inventory/locations" class="btn btn--secondary btn--sm">← ALL LOCATIONS</a>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid--3" style="margin-bottom: 24px;">
          <div class="card card--compact">
            <span class="text-label text-muted">ACTIVE SKUS HELD</span>
            <span class="text-display-md text-data">{{ stockItems().length }}</span>
          </div>
          <div class="card card--compact">
            <span class="text-label text-muted">LOCAL INVENTORY VALUE</span>
            <span class="text-display-md text-data text-success">\${{ totalVal() | number:'1.0-0' }}</span>
          </div>
          <div class="card card--compact">
            <span class="text-label text-muted">FACILITY MANAGER</span>
            <span class="text-subheading" style="margin-top: 8px;">{{ loc.managerName }}</span>
          </div>
        </div>

        <!-- Stocks Table for this location -->
        <div class="card">
          <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">INVENTORY ON PREMISES</span>
          <app-data-table
            [data]="stockItems()"
            [allColumns]="columns"
            [total]="stockItems().length"
            [searchable]="true"
            [exportable]="true"
          />
        </div>
      </div>
    }
  `
})
export class LocationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);

  location = signal<Location | null>(null);

  stockItems = computed(() => {
    const l = this.location();
    if (!l) return [];
    return this.mockData.stockLevels().filter(s => s.locationId === l.id);
  });

  totalVal = computed(() => {
    return this.stockItems().reduce((sum, s) => sum + s.totalValue, 0);
  });

  columns: TableColumn[] = [
    { key: 'productSku', label: 'SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'PRODUCT DESIGNATION', sortable: true },
    { key: 'quantityOnHand', label: 'ON HAND', sortable: true, type: 'number', align: 'right' },
    { key: 'quantityAvailable', label: 'AVAILABLE', sortable: true, type: 'number', align: 'right' },
    { key: 'totalValue', label: 'VALUATION', sortable: true, type: 'currency', align: 'right' },
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
