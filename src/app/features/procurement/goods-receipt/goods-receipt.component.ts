import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ScanInputComponent } from '../../../shared';
import { PurchaseOrder } from '../../../core/models';

interface ReceiptLine {
  productId: string;
  sku: string;
  name: string;
  expected: number;
  received: number;
  damaged: number;
  notes: string;
}

@Component({
  selector: 'app-goods-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScanInputComponent],
  template: `
    @if (po(); as order) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ order.poNumber }}</span>
              <span class="chip chip--warning">DOCK RECEIPT ACTIVE</span>
            </div>
            <h1 class="page__title">INBOUND GOODS RECEIPT DOCKET</h1>
            <p class="page__subtitle">VENDOR: {{ order.supplierName }} • DESTINATION: {{ order.locationName }}</p>
          </div>
          <div class="layout-row layout-gap-sm">
            <button class="btn btn--primary btn--sm" (click)="confirmReceipt()">
              [ POST RECEIPT & UPDATE LEDGER ]
            </button>
            <a [routerLink]="['/procurement/orders', order.id]" class="btn btn--secondary btn--sm">CANCEL</a>
          </div>
        </div>

        <div class="card card--raised" style="margin-bottom: 24px;">
          <app-scan-input
            label="DOCK SCANNER INGESTION"
            placeholder="Scan incoming pallet barcode or SKU..."
            (scanned)="onScanned($event)"
          />
        </div>

        <div class="card">
          <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">
            RECEIVED GOODS TALLY (RECORD OVER / SHORT / DAMAGED)
          </span>

          <table class="dt__table">
            <thead>
              <tr>
                <th class="dt__th">SKU</th>
                <th class="dt__th">DESIGNATION</th>
                <th class="dt__th" style="text-align: right;">EXPECTED</th>
                <th class="dt__th" style="text-align: right; width: 120px;">ACTUAL REC'D</th>
                <th class="dt__th" style="text-align: right; width: 120px;">DAMAGED</th>
                <th class="dt__th" style="text-align: right;">VARIANCE</th>
                <th class="dt__th">DISCREPANCY NOTES</th>
              </tr>
            </thead>
            <tbody>
              @for (line of lines; track line.productId) {
                <tr class="dt__row">
                  <td class="dt__td text-data">{{ line.sku }}</td>
                  <td class="dt__td">{{ line.name }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ line.expected }}</td>
                  <td class="dt__td" style="text-align: right;">
                    <input
                      type="number"
                      class="form-field__input form-field__input--boxed text-data"
                      style="width: 90px; text-align: right; padding: 4px;"
                      [(ngModel)]="line.received"
                    />
                  </td>
                  <td class="dt__td" style="text-align: right;">
                    <input
                      type="number"
                      class="form-field__input form-field__input--boxed text-data text-error"
                      style="width: 90px; text-align: right; padding: 4px;"
                      [(ngModel)]="line.damaged"
                    />
                  </td>
                  <td class="dt__td text-data" style="text-align: right;" [class.text-error]="calculateVariance(line) < 0" [class.text-warning]="calculateVariance(line) > 0">
                    {{ calculateVariance(line) > 0 ? '+' : '' }}{{ calculateVariance(line) }}
                  </td>
                  <td class="dt__td">
                    <input
                      type="text"
                      class="form-field__input form-field__input--boxed"
                      [(ngModel)]="line.notes"
                      placeholder="e.g. crushed box on skid 2"
                    />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class GoodsReceiptComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  mockData = inject(MockDataService);
  private notifications = inject(NotificationService);

  po = signal<PurchaseOrder | null>(null);
  lines: ReceiptLine[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.purchaseOrders().find(p => p.id === id);
      if (found) {
        this.po.set(found);
        this.lines = found.items.map(item => ({
          productId: item.productId,
          sku: item.productSku,
          name: item.productName,
          expected: item.quantityOrdered,
          received: item.quantityOrdered,
          damaged: 0,
          notes: ''
        }));
      }
    }
  }

  calculateVariance(line: ReceiptLine): number {
    return line.received - line.expected;
  }

  onScanned(code: string): void {
    const line = this.lines.find(l => l.sku.toLowerCase() === code.trim().toLowerCase());
    if (line) {
      line.received += 1;
      this.notifications.success(`[MATCHED: +1] ${line.sku} tally updated`);
    } else {
      this.notifications.error(`[UNEXPECTED SKU] ${code} was not in this PO manifest`);
    }
  }

  confirmReceipt(): void {
    const order = this.po();
    if (!order) return;

    this.mockData.receiveGoods(
      order.id,
      this.lines.map(l => ({
        productId: l.productId,
        qtyReceived: Number(l.received),
        damaged: Number(l.damaged),
        notes: l.notes
      }))
    );

    this.notifications.success(`[ACCEPTED] Goods receipt posted for ${order.poNumber}. Stock ledger updated.`);
    this.router.navigate(['/procurement/orders', order.id]);
  }
}
