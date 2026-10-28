import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ScanInputComponent } from '../../../shared';
import { Order, OrderItem } from '../../../core/models';

type FulfilStep = 'picking' | 'packing' | 'shipping';

@Component({
  selector: 'app-order-fulfilment',
  standalone: true,
  imports: [CommonModule, RouterModule, ScanInputComponent],
  template: `
    @if (order(); as ord) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ ord.orderNumber }}</span>
              <span class="chip chip--warning">[WORKFLOW: {{ currentStep() | uppercase }}]</span>
            </div>
            <h1 class="page__title">PICK-PACK-SHIP WORKFLOW</h1>
            <p class="page__subtitle">OPERATOR FULFILLMENT DESK • CLIENT: {{ ord.customerName }}</p>
          </div>
          <a [routerLink]="['/orders', ord.id]" class="btn btn--secondary btn--sm">← EXIT WORKFLOW</a>
        </div>

        <!-- Progress Stepper -->
        <div class="card card--compact" style="margin-bottom: 24px;">
          <div class="workflow-stepper">
            <div class="wf-step" [class.wf-step--active]="currentStep() === 'picking'">
              <span class="step-badge">STEP 1</span>
              <span class="text-label">BARCODE VERIFIED PICKING</span>
            </div>
            <div class="wf-step" [class.wf-step--active]="currentStep() === 'packing'">
              <span class="step-badge">STEP 2</span>
              <span class="text-label">BOX PACKING & DOCKET</span>
            </div>
            <div class="wf-step" [class.wf-step--active]="currentStep() === 'shipping'">
              <span class="step-badge">STEP 3</span>
              <span class="text-label">CARRIER DISPATCH / WAYBILL</span>
            </div>
          </div>
        </div>

        <!-- STEP 1: PICKING -->
        @if (currentStep() === 'picking') {
          <div class="card card--raised" style="margin-bottom: 24px;">
            <app-scan-input
              label="SCAN HARDWARE ITEM TO VERIFY PICK"
              placeholder="Scan SKU barcode..."
              (scanned)="verifyPickScan($event)"
            />
          </div>

          <div class="card">
            <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">PICK WAVE CHECKLIST</span>
            <table class="dt__table">
              <thead>
                <tr>
                  <th class="dt__th">VERIFICATION</th>
                  <th class="dt__th">SKU</th>
                  <th class="dt__th">DESIGNATION</th>
                  <th class="dt__th" style="text-align: right;">QUANTITY</th>
                  <th class="dt__th" style="text-align: center;">MANUAL OVERRIDE</th>
                </tr>
              </thead>
              <tbody>
                @for (item of ord.items; track item.id) {
                  <tr class="dt__row">
                    <td class="dt__td">
                      <span class="chip" [class.chip--success]="item.fulfilmentStatus === 'picked'">
                        {{ item.fulfilmentStatus === 'picked' ? '● PICKED' : '○ PENDING' }}
                      </span>
                    </td>
                    <td class="dt__td text-data">{{ item.productSku }}</td>
                    <td class="dt__td">{{ item.productName }}</td>
                    <td class="dt__td text-data" style="text-align: right;">{{ item.quantity }}</td>
                    <td class="dt__td" style="text-align: center;">
                      <button class="btn btn--secondary btn--sm" (click)="item.fulfilmentStatus = 'picked'">
                        FORCE PICK
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <div class="layout-row layout-gap-sm" style="margin-top: 24px; justify-content: flex-end;">
              <button class="btn btn--primary" (click)="advanceTo('packing')">
                ADVANCE TO PACKING STATION →
              </button>
            </div>
          </div>
        }

        <!-- STEP 2: PACKING -->
        @if (currentStep() === 'packing') {
          <div class="card">
            <h2 class="text-subheading">BOX PACKING VERIFICATION</h2>
            <p class="text-caption text-secondary" style="margin: 8px 0 24px 0;">All items verified. Prepare protective packaging and insert packing slip.</p>
            <div class="layout-row layout-gap-sm">
              <button class="btn btn--primary" (click)="advanceTo('shipping')">
                SEAL CARTON & GENERATE SHIPPING LABEL →
              </button>
              <button class="btn btn--secondary" (click)="currentStep.set('picking')">← BACK</button>
            </div>
          </div>
        }

        <!-- STEP 3: SHIPPING -->
        @if (currentStep() === 'shipping') {
          <div class="card">
            <h2 class="text-subheading">CARRIER DISPATCH CONFIRMATION</h2>
            <p class="text-caption text-secondary" style="margin: 8px 0 24px 0;">Shipping destination: {{ ord.shippingAddress }}</p>
            <div class="layout-row layout-gap-sm">
              <button class="btn btn--primary" (click)="completeShipment()">
                [ CONFIRM HANDOVER TO CARRIER ]
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .workflow-stepper {
      display: flex;
      justify-content: space-around;
      padding: var(--space-sm);
    }
    .wf-step {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      opacity: 0.4;
    }
    .wf-step--active {
      opacity: 1;
    }
    .step-badge {
      font-family: var(--font-data);
      font-size: 10px;
      font-weight: 700;
      background: var(--text-display);
      color: var(--black);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
    }
  `]
})
export class OrderFulfilmentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  mockData = inject(MockDataService);
  private notifications = inject(NotificationService);

  order = signal<Order | null>(null);
  currentStep = signal<FulfilStep>('picking');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.orders().find(o => o.id === id);
      if (found) this.order.set(found);
    }
  }

  verifyPickScan(code: string): void {
    const o = this.order();
    if (!o) return;

    const trimmed = code.trim().toLowerCase();
    const item = o.items.find(i => i.productSku.toLowerCase() === trimmed);

    if (item) {
      item.fulfilmentStatus = 'picked';
      this.notifications.success(`[PICK VERIFIED] ${item.productSku}`);
    } else {
      this.notifications.error(`[MISMATCH] SKU ${code} not in this pick list`);
    }
  }

  advanceTo(step: FulfilStep): void {
    this.currentStep.set(step);
    this.notifications.show(`[WORKFLOW] Advanced to ${step.toUpperCase()}`, 'info');
  }

  completeShipment(): void {
    const o = this.order();
    if (o) {
      o.status = 'shipped';
      o.shippedAt = new Date().toISOString();
      this.notifications.success(`[DISPATCHED] Order ${o.orderNumber} handed over to carrier.`);
      this.router.navigate(['/orders', o.id]);
    }
  }
}
