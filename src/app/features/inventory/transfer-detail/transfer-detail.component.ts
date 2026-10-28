import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusChipComponent } from '../../../shared';
import { StockTransfer } from '../../../core/models';

@Component({
  selector: 'app-transfer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusChipComponent],
  template: `
    @if (transfer(); as tr) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ tr.transferNumber }}</span>
              <app-status-chip [status]="tr.status" />
            </div>
            <h1 class="page__title">{{ tr.fromLocationName }} → {{ tr.toLocationName }}</h1>
            <p class="page__subtitle">CREATED: {{ tr.createdAt | date:'yyyy-MM-dd HH:mm' }} • REQUESTOR: {{ tr.requestedByName }}</p>
          </div>

          <!-- Workflow Action Triggers -->
          <div class="layout-row layout-gap-sm">
            @if (tr.status === 'pending_approval') {
              <button class="btn btn--primary btn--sm" (click)="updateStatus('approved')">
                [ APPROVE TRANSFER ]
              </button>
            }
            @if (tr.status === 'approved') {
              <button class="btn btn--primary btn--sm" (click)="updateStatus('dispatched')">
                [ DISPATCH PALLET / SHIP ]
              </button>
            }
            @if (tr.status === 'dispatched' || tr.status === 'in_transit') {
              <button class="btn btn--primary btn--sm" (click)="updateStatus('received')">
                [ CONFIRM DOCK RECEIPT ]
              </button>
            }
            <a routerLink="/inventory/transfers" class="btn btn--secondary btn--sm">← TRANSFERS</a>
          </div>
        </div>

        <!-- Transfer Progression Stepper -->
        <div class="card card--compact" style="margin-bottom: 24px;">
          <div class="stepper">
            <div class="step" [class.step--active]="tr.status === 'pending_approval' || isPast('pending_approval', tr.status)">
              <span class="step-num">01</span>
              <span class="text-label">REQUESTED</span>
            </div>
            <div class="step-line"></div>
            <div class="step" [class.step--active]="tr.status === 'approved' || isPast('approved', tr.status)">
              <span class="step-num">02</span>
              <span class="text-label">APPROVED</span>
            </div>
            <div class="step-line"></div>
            <div class="step" [class.step--active]="tr.status === 'dispatched' || isPast('dispatched', tr.status)">
              <span class="step-num">03</span>
              <span class="text-label">DISPATCHED</span>
            </div>
            <div class="step-line"></div>
            <div class="step" [class.step--active]="tr.status === 'received'">
              <span class="step-num">04</span>
              <span class="text-label">RECEIVED</span>
            </div>
          </div>
        </div>

        <!-- Manifest Table -->
        <div class="card">
          <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">TRANSFER MANIFEST & BILL OF LADING</span>
          <table class="dt__table">
            <thead>
              <tr>
                <th class="dt__th">SKU</th>
                <th class="dt__th">DESIGNATION</th>
                <th class="dt__th" style="text-align: right;">QTY REQUESTED</th>
                <th class="dt__th" style="text-align: right;">QTY DISPATCHED</th>
                <th class="dt__th" style="text-align: right;">QTY RECEIVED</th>
              </tr>
            </thead>
            <tbody>
              @for (item of tr.items; track item.id) {
                <tr class="dt__row">
                  <td class="dt__td text-data">{{ item.productSku }}</td>
                  <td class="dt__td">{{ item.productName }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ item.quantityRequested }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ tr.status === 'dispatched' || tr.status === 'received' ? item.quantityRequested : 0 }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ tr.status === 'received' ? item.quantityRequested : 0 }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
  styles: [`
    .stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-sm) var(--space-md);
    }
    .step {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      opacity: 0.4;
    }
    .step--active {
      opacity: 1;
    }
    .step-num {
      font-family: var(--font-data);
      font-size: 11px;
      font-weight: 700;
      background: var(--surface);
      border: 1px solid var(--border-visible);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
    }
    .step--active .step-num {
      background: var(--text-display);
      color: var(--black);
    }
    .step-line {
      flex: 1;
      height: 1px;
      background: var(--border);
      margin: 0 var(--space-md);
    }
  `]
})
export class TransferDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);
  private notifications = inject(NotificationService);

  transfer = signal<StockTransfer | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.transfers().find(t => t.id === id);
      if (found) this.transfer.set(found);
    }
  }

  updateStatus(status: StockTransfer['status']): void {
    const tr = this.transfer();
    if (tr) {
      this.mockData.updateTransferStatus(tr.id, status);
      const updated = this.mockData.transfers().find(t => t.id === tr.id);
      if (updated) this.transfer.set(updated);
      this.notifications.success(`[STATUS] Transfer transitioned to ${status.toUpperCase()}`);
    }
  }

  isPast(target: string, current: string): boolean {
    const order = ['pending_approval', 'approved', 'dispatched', 'in_transit', 'received'];
    return order.indexOf(current) > order.indexOf(target);
  }
}
