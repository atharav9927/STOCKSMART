import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { StatusChipComponent, TimelineComponent, TimelineEvent } from '../../../shared';
import { PurchaseOrder } from '../../../core/models';

@Component({
  selector: 'app-po-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusChipComponent, TimelineComponent],
  template: `
    @if (po(); as order) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ order.poNumber }}</span>
              <app-status-chip [status]="order.status" />
            </div>
            <h1 class="page__title">{{ order.supplierName }}</h1>
            <p class="page__subtitle">DESTINATION DOCK: {{ order.locationName }} • TOTAL: \${{ order.totalAmount | number:'1.0-0' }}</p>
          </div>
          <div class="layout-row layout-gap-sm">
            @if (order.status !== 'received' && order.status !== 'cancelled') {
              <a [routerLink]="['/procurement/orders', order.id, 'receive']" class="btn btn--primary btn--sm">
                [ DOCK GOODS RECEIPT ]
              </a>
            }
            <a routerLink="/procurement/orders" class="btn btn--secondary btn--sm">← ALL ORDERS</a>
          </div>
        </div>

        <div class="grid grid--3" style="margin-bottom: 24px;">
          <!-- Timeline -->
          <div class="card" style="grid-column: span 1;">
            <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">AUDIT TIMELINE</span>
            <app-timeline [events]="timelineEvents()" />
          </div>

          <!-- Items Manifest -->
          <div class="card" style="grid-column: span 2;">
            <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">PURCHASE MANIFEST</span>
            <table class="dt__table">
              <thead>
                <tr>
                  <th class="dt__th">SKU</th>
                  <th class="dt__th">DESIGNATION</th>
                  <th class="dt__th" style="text-align: right;">ORDERED</th>
                  <th class="dt__th" style="text-align: right;">RECEIVED</th>
                  <th class="dt__th" style="text-align: right;">UNIT COST</th>
                  <th class="dt__th" style="text-align: right;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                @for (item of order.items; track item.id) {
                  <tr class="dt__row">
                    <td class="dt__td text-data">{{ item.productSku }}</td>
                    <td class="dt__td">{{ item.productName }}</td>
                    <td class="dt__td text-data" style="text-align: right;">{{ item.quantityOrdered }}</td>
                    <td class="dt__td text-data" style="text-align: right;">{{ item.quantityReceived }}</td>
                    <td class="dt__td text-data" style="text-align: right;">\${{ item.unitCost }}</td>
                    <td class="dt__td text-data" style="text-align: right;">\${{ item.totalCost }}</td>
                  </tr>
                }
              </tbody>
            </table>

            <div class="financial-summary">
              <div class="layout-between">
                <span class="text-caption text-secondary">SUBTOTAL:</span>
                <span class="text-data">\${{ order.subtotal | number:'1.2-2' }}</span>
              </div>
              <div class="layout-between">
                <span class="text-caption text-secondary">TAX (8%):</span>
                <span class="text-data">\${{ order.taxAmount | number:'1.2-2' }}</span>
              </div>
              <div class="layout-between">
                <span class="text-caption text-secondary">AIR FREIGHT:</span>
                <span class="text-data">\${{ order.shippingCost | number:'1.2-2' }}</span>
              </div>
              <div class="layout-between" style="border-top: 1px solid var(--border); padding-top: 8px;">
                <span class="text-subheading">TOTAL BILL:</span>
                <span class="text-display-md text-data text-success">\${{ order.totalAmount | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .financial-summary {
      margin-top: var(--space-xl);
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      max-width: 320px;
      margin-left: auto;
    }
  `]
})
export class PoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);

  po = signal<PurchaseOrder | null>(null);

  timelineEvents = signal<TimelineEvent[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.purchaseOrders().find(p => p.id === id);
      if (found) {
        this.po.set(found);
        this.timelineEvents.set(
          found.statusHistory.map(sh => ({
            id: sh.id,
            status: sh.status,
            label: sh.status.replace(/_/g, ' ').toUpperCase(),
            timestamp: sh.changedAt,
            user: sh.changedByName,
            notes: sh.notes
          }))
        );
      }
    }
  }
}
