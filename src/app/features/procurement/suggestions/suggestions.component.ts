import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusChipComponent, QuantityBadgeComponent } from '../../../shared';
import { ReorderSuggestion } from '../../../core/models';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusChipComponent, QuantityBadgeComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">PREDICTIVE REORDER REQUISITIONS</h1>
          <p class="page__subtitle">AUTOMATED REPLENISHMENT ALGORITHM • MIN-MAX & LEAD TIME MODEL</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <button class="btn btn--primary btn--sm" (click)="generateBulkPO()">
            [ 1-CLICK BULK PO CONVERSION ]
          </button>
        </div>
      </div>

      <div class="card">
        <div class="layout-between" style="margin-bottom: 16px;">
          <span class="text-label text-muted">FLIGHT-RISK HARDWARE DETECTED ({{ mockData.suggestions().length }})</span>
          <span class="text-caption text-secondary">Ordered by depletion urgency</span>
        </div>

        <table class="dt__table">
          <thead>
            <tr>
              <th class="dt__th">URGENCY</th>
              <th class="dt__th">SKU</th>
              <th class="dt__th">DESIGNATION</th>
              <th class="dt__th">TARGET NODE</th>
              <th class="dt__th" style="text-align: right;">ON HAND</th>
              <th class="dt__th" style="text-align: right;">REORDER PT</th>
              <th class="dt__th" style="text-align: right;">SUGGESTED QTY</th>
              <th class="dt__th">PREFERRED VENDOR</th>
              <th class="dt__th" style="text-align: right;">EST. COST</th>
              <th class="dt__th" style="text-align: center;">ACTION</th>
            </tr>
          </thead>
          <tbody>
            @for (sug of mockData.suggestions(); track sug.id) {
              <tr class="dt__row">
                <td class="dt__td">
                  <span class="chip" [class.chip--error]="sug.urgency === 'critical'" [class.chip--warning]="sug.urgency === 'high' || sug.urgency === 'medium'">
                    {{ sug.urgency | uppercase }}
                  </span>
                </td>
                <td class="dt__td text-data">{{ sug.productSku }}</td>
                <td class="dt__td">{{ sug.productName }}</td>
                <td class="dt__td">{{ sug.locationName }}</td>
                <td class="dt__td text-data" style="text-align: right;">{{ sug.currentStock }}</td>
                <td class="dt__td text-data" style="text-align: right;">{{ sug.reorderPoint }}</td>
                <td class="dt__td text-data" style="text-align: right;">{{ sug.suggestedQuantity }}</td>
                <td class="dt__td">{{ sug.preferredSupplierName }}</td>
                <td class="dt__td text-data" style="text-align: right;">\${{ sug.estimatedCost | number:'1.0-0' }}</td>
                <td class="dt__td" style="text-align: center;">
                  <button class="btn btn--secondary btn--sm" (click)="createSinglePO(sug)">
                    CONVERT TO PO →
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SuggestionsComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  createSinglePO(sug: ReorderSuggestion): void {
    const po = this.mockData.createPurchaseOrder({
      supplierId: sug.preferredSupplierId,
      supplierName: sug.preferredSupplierName,
      locationId: sug.locationId,
      locationName: sug.locationName,
      subtotal: sug.estimatedCost,
      notes: `Generated from automated reorder suggestion (${sug.urgency} urgency)`,
      items: [
        {
          id: `poi-${Date.now()}`,
          productId: sug.productId,
          productSku: sug.productSku,
          productName: sug.productName,
          quantityOrdered: sug.suggestedQuantity,
          quantityReceived: 0,
          unitCost: Math.round(sug.estimatedCost / sug.suggestedQuantity),
          totalCost: sug.estimatedCost,
          receiptStatus: 'pending'
        }
      ]
    });

    this.notifications.success(`[CONVERTED] Purchase Order ${po.poNumber} created for ${sug.productSku}`);
    this.router.navigate(['/procurement/orders', po.id]);
  }

  generateBulkPO(): void {
    this.notifications.success('[BATCH] Generated combined Purchase Orders grouped by vendor.');
  }
}
