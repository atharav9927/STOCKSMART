import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ScanInputComponent, StatusChipComponent, QuantityBadgeComponent } from '../../../shared';
import { Product, StockLevel } from '../../../core/models';

@Component({
  selector: 'app-scan-lookup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScanInputComponent, StatusChipComponent, QuantityBadgeComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">INSTANT HARDWARE SCANNER TERMINAL</h1>
          <p class="page__subtitle">KEYBOARD-WEDGE & OPTICAL BARCODE INTERCEPT • RAPID SKU TELEMETRY</p>
        </div>
      </div>

      <div class="card card--raised" style="margin-bottom: 24px;">
        <app-scan-input
          label="HARDWARE SCANNER INGESTION"
          placeholder="Scan barcode, SKU, UPC, EAN-13, or RFID transponder..."
          (scanned)="performLookup($event)"
        />
      </div>

      @if (lookupResult(); as res) {
        <div class="card card--raised lookup-result-card">
          <div class="layout-between">
            <span class="text-data text-heading text-muted">{{ res.product.sku }}</span>
            <span class="chip chip--success">● LOCATED IN REPOSITORY</span>
          </div>
          <h2 class="text-display-md" style="margin-top: 8px;">{{ res.product.name }}</h2>
          <p class="text-body-sm text-secondary">{{ res.product.description }}</p>

          <div class="grid grid--3" style="margin: 24px 0;">
            <div class="card card--compact">
              <span class="text-label text-muted">UNIT COST</span>
              <span class="text-display-md text-data">\${{ res.product.unitCost }}</span>
            </div>
            <div class="card card--compact">
              <span class="text-label text-muted">RETAIL PRICE</span>
              <span class="text-display-md text-data text-success">\${{ res.product.unitPrice }}</span>
            </div>
            <div class="card card--compact">
              <span class="text-label text-muted">REORDER POINT</span>
              <span class="text-display-md text-data">{{ res.product.reorderPoint }} PCS</span>
            </div>
          </div>

          <span class="text-label text-muted" style="margin-bottom: 12px; display: block;">INVENTORY BY FACILITY</span>
          <table class="dt__table">
            <thead>
              <tr>
                <th class="dt__th">FACILITY NODE</th>
                <th class="dt__th" style="text-align: right;">ON HAND</th>
                <th class="dt__th" style="text-align: right;">AVAILABLE</th>
                <th class="dt__th" style="text-align: right;">IN TRANSIT</th>
                <th class="dt__th">HEALTH STATUS</th>
              </tr>
            </thead>
            <tbody>
              @for (st of res.stock; track st.locationId) {
                <tr class="dt__row">
                  <td class="dt__td">{{ st.locationName }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ st.quantityOnHand }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ st.quantityAvailable }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ st.quantityInTransit }}</td>
                  <td class="dt__td"><app-status-chip [status]="st.status" /></td>
                </tr>
              }
            </tbody>
          </table>

          <div class="layout-row layout-gap-sm" style="margin-top: 24px;">
            <a [routerLink]="['/catalog/products', res.product.id]" class="btn btn--primary btn--sm">
              VIEW COMPLETE SKU PROFILE →
            </a>
          </div>
        </div>
      }
    </div>
  `
})
export class ScanLookupComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);
  private notifications = inject(NotificationService);

  lookupResult = signal<{ product: Product; stock: StockLevel[] } | null>(null);

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) {
      this.performLookup(q);
    }
  }

  performLookup(code: string): void {
    const res = this.mockData.lookupBarcode(code);
    if (res) {
      this.lookupResult.set(res);
      this.notifications.success(`[MATCHED] ${res.product.sku} — ${res.product.name}`);
    } else {
      this.lookupResult.set(null);
      this.notifications.error(`[UNRECOGNIZED CODE] ${code} was not found in catalog.`);
    }
  }
}
