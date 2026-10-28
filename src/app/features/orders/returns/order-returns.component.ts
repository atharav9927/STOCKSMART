import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

interface ReturnRequest {
  id: string;
  orderNumber: string;
  customer: string;
  sku: string;
  reason: string;
  condition: 'sealed' | 'opened' | 'defective';
  status: 'pending_inspection' | 'restocked' | 'scrapped';
}

@Component({
  selector: 'app-order-returns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">RETURNS & REVERSE LOGISTICS (RMA)</h1>
          <p class="page__subtitle">INSPECTION, RESTOCKING AUTHORIZATION & DEFECTIVE QUARANTINE</p>
        </div>
        <a routerLink="/orders" class="btn btn--secondary btn--sm">← ORDERS</a>
      </div>

      <div class="card">
        <table class="dt__table">
          <thead>
            <tr>
              <th class="dt__th">RMA ID</th>
              <th class="dt__th">ORDER REF</th>
              <th class="dt__th">CLIENT</th>
              <th class="dt__th">SKU</th>
              <th class="dt__th">RETURN REASON</th>
              <th class="dt__th">CONDITION</th>
              <th class="dt__th" style="text-align: right;">DISPOSITION ACTION</th>
            </tr>
          </thead>
          <tbody>
            @for (ret of returns; track ret.id) {
              <tr class="dt__row">
                <td class="dt__td text-data">{{ ret.id }}</td>
                <td class="dt__td text-data">{{ ret.orderNumber }}</td>
                <td class="dt__td">{{ ret.customer }}</td>
                <td class="dt__td text-data">{{ ret.sku }}</td>
                <td class="dt__td">{{ ret.reason }}</td>
                <td class="dt__td">
                  <span class="chip chip--technical">{{ ret.condition }}</span>
                </td>
                <td class="dt__td" style="text-align: right;">
                  <button class="btn btn--secondary btn--sm" (click)="restock(ret)">
                    RESTOCK TO DC
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
export class OrderReturnsComponent {
  private notifications = inject(NotificationService);

  returns: ReturnRequest[] = [
    { id: 'RMA-901', orderNumber: 'ORD-89420', customer: 'Alice Wong', sku: 'SKU-1001', reason: 'Ordered incorrect variant', condition: 'sealed', status: 'pending_inspection' },
    { id: 'RMA-902', orderNumber: 'ORD-89419', customer: 'Brian Miller', sku: 'SKU-1002', reason: 'Unopened customer return', condition: 'sealed', status: 'pending_inspection' }
  ];

  restock(ret: ReturnRequest): void {
    ret.status = 'restocked';
    this.notifications.success(`[RESTOCKED] Item ${ret.sku} authorized and returned to active inventory.`);
  }
}
