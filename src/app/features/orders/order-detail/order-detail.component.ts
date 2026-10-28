import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { StatusChipComponent, TimelineComponent, TimelineEvent } from '../../../shared';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusChipComponent, TimelineComponent],
  template: `
    @if (order(); as ord) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ ord.orderNumber }}</span>
              <app-status-chip [status]="ord.status" />
            </div>
            <h1 class="page__title">{{ ord.customerName }}</h1>
            <p class="page__subtitle">{{ ord.customerEmail }} • FULFILLMENT: {{ ord.locationName }}</p>
          </div>
          <div class="layout-row layout-gap-sm">
            @if (ord.status !== 'shipped' && ord.status !== 'delivered') {
              <a [routerLink]="['/orders', ord.id, 'fulfil']" class="btn btn--primary btn--sm">
                [ LAUNCH PICK-PACK-SHIP ]
              </a>
            }
            <a routerLink="/orders" class="btn btn--secondary btn--sm">← ALL ORDERS</a>
          </div>
        </div>

        <div class="grid grid--3">
          <!-- Shipping / Client Profile -->
          <div class="card">
            <span class="text-label text-muted">SHIPPING DESTINATION</span>
            <p class="text-body-sm" style="margin-top: 12px; line-height: 1.6;">
              {{ ord.shippingAddress }}
            </p>
            <div style="margin-top: 16px; border-top: 1px solid var(--border); padding-top: 12px;">
              <span class="text-label">CONTACT PHONE</span>
              <p class="text-data">{{ ord.customerPhone }}</p>
            </div>
          </div>

          <!-- Items Manifest -->
          <div class="card" style="grid-column: span 2;">
            <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">ORDERED ITEMS</span>
            <table class="dt__table">
              <thead>
                <tr>
                  <th class="dt__th">SKU</th>
                  <th class="dt__th">DESIGNATION</th>
                  <th class="dt__th" style="text-align: right;">QTY</th>
                  <th class="dt__th" style="text-align: right;">UNIT PRICE</th>
                  <th class="dt__th" style="text-align: right;">EXTENDED</th>
                  <th class="dt__th">FULFILMENT</th>
                </tr>
              </thead>
              <tbody>
                @for (item of ord.items; track item.id) {
                  <tr class="dt__row">
                    <td class="dt__td text-data">{{ item.productSku }}</td>
                    <td class="dt__td">{{ item.productName }}</td>
                    <td class="dt__td text-data" style="text-align: right;">{{ item.quantity }}</td>
                    <td class="dt__td text-data" style="text-align: right;">\${{ item.unitPrice }}</td>
                    <td class="dt__td text-data" style="text-align: right;">\${{ item.totalPrice }}</td>
                    <td class="dt__td">
                      <span class="chip chip--technical">{{ item.fulfilmentStatus }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <div class="layout-between" style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px;">
              <span class="text-subheading">TOTAL CHARGED</span>
              <span class="text-display-md text-data text-success">\${{ ord.totalAmount | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);

  order = signal<Order | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.orders().find(o => o.id === id);
      if (found) this.order.set(found);
    }
  }
}
