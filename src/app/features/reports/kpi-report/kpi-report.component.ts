import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { KpiCardComponent } from '../../../shared';

@Component({
  selector: 'app-kpi-report',
  standalone: true,
  imports: [CommonModule, RouterModule, KpiCardComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">EXECUTIVE PERFORMANCE & KPIS</h1>
          <p class="page__subtitle">INVENTORY TURNOVER, CARRYING EFFICIENCY & FULFILLMENT VELOCITY</p>
        </div>
        <button class="btn btn--secondary btn--sm" (click)="notifications.success('[EXPORT] KPI report dispatched to PDF.')">
          [ EXPORT EXECUTIVE SUMMARY ]
        </button>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid--4" style="margin-bottom: 24px;">
        <app-kpi-card
          label="INVENTORY TURNOVER RATIO"
          [value]="6.8"
          [previousValue]="6.2"
          format="number"
          suffix="TURNS / YR"
          icon="↺"
          [trend]="[5.8, 6.0, 6.1, 6.3, 6.5, 6.8]"
        />

        <app-kpi-card
          label="SERVICE LEVEL / FILL RATE"
          [value]="98.4"
          [previousValue]="97.9"
          format="percent"
          icon="●"
          [trend]="[96.5, 97.0, 97.4, 97.8, 97.9, 98.4]"
        />

        <app-kpi-card
          label="GROSS MARGIN ROI (GMROI)"
          [value]="242"
          [previousValue]="228"
          format="percent"
          icon="▲"
          [trend]="[210, 218, 225, 230, 228, 242]"
        />

        <app-kpi-card
          label="DAYS SALES OF INVENTORY (DSI)"
          [value]="53.7"
          [previousValue]="58.9"
          format="number"
          suffix="DAYS"
          icon="⏱"
          [invertChange]="true"
          [trend]="[64, 62, 60, 59, 58.9, 53.7]"
        />
      </div>

      <div class="grid grid--2">
        <div class="card">
          <span class="text-label text-muted">OPERATIONAL EXCELLENCE METRICS</span>
          <div class="spec-list" style="margin-top: 16px;">
            <div class="spec-row">
              <span class="text-label">CYCLE COUNT ACCURACY</span>
              <span class="text-data text-success">99.2% (Tolerance ± 1 unit)</span>
            </div>
            <div class="spec-row">
              <span class="text-label">ORDER PICK ACCURACY</span>
              <span class="text-data text-success">99.8%</span>
            </div>
            <div class="spec-row">
              <span class="text-label">ORDER LEAD TIME (CLICK TO SHIP)</span>
              <span class="text-data">2.8 HOURS</span>
            </div>
            <div class="spec-row">
              <span class="text-label">DAMAGED STOCK RATIO</span>
              <span class="text-data text-warning">0.24% of received volume</span>
            </div>
          </div>
        </div>

        <div class="card">
          <span class="text-label text-muted">CAPITAL ALLOCATION EFFICIENCY</span>
          <div class="spec-list" style="margin-top: 16px;">
            <div class="spec-row">
              <span class="text-label">TOTAL CAPITAL EMPLOYED</span>
              <span class="text-data text-display-md">\${{ totalCapital() | number:'1.0-0' }}</span>
            </div>
            <div class="spec-row">
              <span class="text-label">ANNUAL CARRYING COST (18%)</span>
              <span class="text-data text-error">\${{ (totalCapital() * 0.18) | number:'1.0-0' }}</span>
            </div>
            <div class="spec-row">
              <span class="text-label">SAFETY STOCK BUFFER RATIO</span>
              <span class="text-data">14.2% of total inventory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spec-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .spec-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--space-xs);
    }
  `]
})
export class KpiReportComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  totalCapital = computed(() => {
    return this.mockData.stockLevels().reduce((sum, s) => sum + s.totalValue, 0);
  });
}
