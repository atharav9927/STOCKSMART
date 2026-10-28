import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ScanInputComponent, StatusChipComponent } from '../../../shared';
import { StockCount, CountItem } from '../../../core/models';

@Component({
  selector: 'app-count-session',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScanInputComponent, StatusChipComponent],
  template: `
    @if (count(); as cnt) {
      <div class="page">
        <div class="page__header">
          <div>
            <div class="layout-row layout-gap-xs">
              <span class="text-data text-subheading text-muted">{{ cnt.countNumber }}</span>
              <app-status-chip [status]="cnt.status" />
            </div>
            <h1 class="page__title">COUNT SESSION • {{ cnt.locationName }}</h1>
            <p class="page__subtitle">TYPE: {{ cnt.type | uppercase }} • PROGRESS: {{ cnt.countedItems }} / {{ cnt.totalItems }} SKUS</p>
          </div>
          <div class="layout-row layout-gap-sm">
            @if (cnt.status === 'in_progress') {
              <button class="btn btn--primary btn--sm" (click)="finalizeCount()">
                [ REVISE & POST VARIANCES ]
              </button>
            }
            <a routerLink="/inventory/counts" class="btn btn--secondary btn--sm">← AUDIT SESSIONS</a>
          </div>
        </div>

        <!-- Scanning Terminal -->
        @if (cnt.status === 'in_progress') {
          <div class="card card--raised" style="margin-bottom: 24px;">
            <app-scan-input
              label="RAPID HARDWARE WEDGE SCANNER"
              placeholder="Scan SKU barcode to increment count tally..."
              (scanned)="onBarcodeScanned($event)"
            />
          </div>
        }

        <!-- Count Sheet Matrix -->
        <div class="card">
          <div class="layout-between" style="margin-bottom: 16px;">
            <span class="text-label text-muted">AUDIT VERIFICATION LEDGER</span>
            <span class="text-caption text-secondary">Identified Variances: {{ varianceCount() }}</span>
          </div>

          <table class="dt__table">
            <thead>
              <tr>
                <th class="dt__th">SKU</th>
                <th class="dt__th">DESIGNATION</th>
                <th class="dt__th" style="text-align: right;">EXPECTED</th>
                <th class="dt__th" style="text-align: right; width: 140px;">COUNTED TALLY</th>
                <th class="dt__th" style="text-align: right;">VARIANCE</th>
                <th class="dt__th">STATE</th>
              </tr>
            </thead>
            <tbody>
              @for (item of cnt.items; track item.id) {
                <tr class="dt__row" [class.dt__row--active]="item.variance !== null && item.variance !== 0">
                  <td class="dt__td text-data">{{ item.productSku }}</td>
                  <td class="dt__td">{{ item.productName }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ item.expectedQuantity }}</td>
                  <td class="dt__td" style="text-align: right;">
                    @if (cnt.status === 'in_progress') {
                      <input
                        type="number"
                        class="form-field__input form-field__input--boxed text-data"
                        style="width: 100px; text-align: right; padding: 4px;"
                        [ngModel]="item.countedQuantity"
                        (ngModelChange)="updateCount(item, $event)"
                        placeholder="Tally"
                      />
                    } @else {
                      <span class="text-data">{{ item.countedQuantity ?? '—' }}</span>
                    }
                  </td>
                  <td class="dt__td text-data" style="text-align: right;" [class.text-error]="item.variance && item.variance < 0" [class.text-success]="item.variance && item.variance > 0">
                    {{ item.variance !== null ? (item.variance > 0 ? '+' : '') + item.variance : '—' }}
                  </td>
                  <td class="dt__td">
                    <span class="chip chip--technical" [class.chip--warning]="item.variance !== 0 && item.variance !== null">
                      {{ item.status }}
                    </span>
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
export class CountSessionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  mockData = inject(MockDataService);
  private notifications = inject(NotificationService);

  count = signal<StockCount | null>(null);

  varianceCount = computed(() => {
    const c = this.count();
    if (!c) return 0;
    return c.items.filter(i => i.variance !== null && i.variance !== 0).length;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.mockData.counts().find(c => c.id === id);
      if (found) this.count.set(found);
    }
  }

  onBarcodeScanned(code: string): void {
    const c = this.count();
    if (!c) return;

    const trimmed = code.trim().toLowerCase();
    const item = c.items.find(i => i.productSku.toLowerCase() === trimmed);

    if (item) {
      const newTally = (item.countedQuantity || 0) + 1;
      this.updateCount(item, newTally);
      this.notifications.success(`[TALLY: +1] ${item.productSku} count: ${newTally}`);
    } else {
      this.notifications.error(`[UNEXPECTED ITEM] ${code} is not on this count sheet`);
    }
  }

  updateCount(item: CountItem, qty: number): void {
    const c = this.count();
    if (!c) return;

    item.countedQuantity = Number(qty);
    item.variance = item.countedQuantity - item.expectedQuantity;
    item.variancePercent = Number(((item.variance / item.expectedQuantity) * 100).toFixed(1));
    item.status = 'counted';
    item.countedAt = new Date().toISOString();

    const countedCount = c.items.filter(i => i.countedQuantity !== null).length;
    const varCount = c.items.filter(i => i.variance !== null && i.variance !== 0).length;

    c.countedItems = countedCount;
    c.varianceItems = varCount;
    this.count.set({ ...c });
  }

  finalizeCount(): void {
    const c = this.count();
    if (!c) return;

    c.status = 'completed';
    c.completedAt = new Date().toISOString();
    this.count.set({ ...c });
    this.notifications.success(`[FINALIZED] Audit session ${c.countNumber} reconciled. Variances logged.`);
  }
}
