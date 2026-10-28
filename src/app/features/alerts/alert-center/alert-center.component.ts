import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Alert } from '../../../core/models';

@Component({
  selector: 'app-alert-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">OPERATIONAL TELEMETRY & ALERTS</h1>
          <p class="page__subtitle">SYSTEM NOTIFICATION CENTER • REAL-TIME HARDWARE & INVENTORY ANOMALIES</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <a routerLink="/alerts/rules" class="btn btn--secondary btn--sm">[ CONFIGURE RULES ]</a>
          <button class="btn btn--secondary btn--sm" (click)="markAllRead()" [disabled]="unreadCount() === 0">
            [ MARK ALL ACKNOWLEDGED ]
          </button>
        </div>
      </div>

      <!-- Severity Filter Buttons -->
      <div class="card card--compact" style="margin-bottom: 24px;">
        <div class="layout-row layout-gap-xs">
          <button class="btn btn--sm" [class.btn--primary]="severityFilter() === 'all'" [class.btn--ghost]="severityFilter() !== 'all'" (click)="severityFilter.set('all')">
            ALL ({{ alerts().length }})
          </button>
          <button class="btn btn--sm" [class.btn--destructive]="severityFilter() === 'critical'" [class.btn--ghost]="severityFilter() !== 'critical'" (click)="severityFilter.set('critical')">
            CRITICAL
          </button>
          <button class="btn btn--sm" [class.btn--secondary]="severityFilter() === 'warning'" [class.btn--ghost]="severityFilter() !== 'warning'" (click)="severityFilter.set('warning')">
            WARNING
          </button>
          <button class="btn btn--sm" [class.btn--secondary]="severityFilter() === 'info'" [class.btn--ghost]="severityFilter() !== 'info'" (click)="severityFilter.set('info')">
            INFO
          </button>
        </div>
      </div>

      <!-- Alerts Feed List -->
      <div class="alerts-feed-wrapper">
        @for (alert of filteredAlerts(); track alert.id) {
          <div class="card card--raised alert-card" [class.alert-card--unread]="!alert.isRead" [class.alert-card--critical]="alert.severity === 'critical'">
            <div class="alert-card__top">
              <div class="layout-row layout-gap-xs">
                <span class="chip chip--technical" [class.chip--error]="alert.severity === 'critical'" [class.chip--warning]="alert.severity === 'warning'">
                  {{ alert.severity | uppercase }}
                </span>
                <span class="text-label text-muted">{{ alert.category | uppercase }}</span>
                @if (!alert.isRead) {
                  <span class="text-label text-interactive">[NEW]</span>
                }
              </div>
              <span class="text-data text-caption text-disabled">{{ alert.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}</span>
            </div>

            <h2 class="text-heading" style="margin-top: 8px;">{{ alert.title }}</h2>
            <p class="text-body-sm text-secondary" style="margin: 6px 0 16px 0;">{{ alert.message }}</p>

            <div class="alert-card__actions layout-between">
              <div>
                @if (alert.actionUrl) {
                  <a [routerLink]="alert.actionUrl" class="btn btn--primary btn--sm">
                    {{ alert.actionLabel || 'INVESTIGATE EVENT' }} →
                  </a>
                }
              </div>
              <div class="layout-row layout-gap-xs">
                @if (!alert.isRead) {
                  <button class="btn btn--ghost btn--sm" (click)="markRead(alert.id)">
                    ACKNOWLEDGE
                  </button>
                }
                <button class="btn btn--ghost btn--sm text-error" (click)="dismiss(alert.id)">
                  DISMISS
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty text-caption text-disabled" style="padding: 48px; text-align: center;">
            No telemetry alerts matching selected filter. All facilities operating normally.
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .alerts-feed-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .alert-card {
      border-left: 2px solid transparent;
      display: flex;
      flex-direction: column;
      transition: background var(--duration-micro) var(--ease-out);
    }
    .alert-card--unread {
      background: var(--surface-raised);
    }
    .alert-card--critical {
      border-left-color: var(--accent);
    }
    .alert-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .alert-card__actions {
      border-top: 1px solid var(--border);
      padding-top: var(--space-sm);
    }
  `]
})
export class AlertCenterComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  alerts = this.mockData.alerts;
  severityFilter = signal<string>('all');

  unreadCount = computed(() => this.alerts().filter(a => !a.isRead).length);

  filteredAlerts = computed(() => {
    const filter = this.severityFilter();
    const list = this.alerts();
    if (filter === 'all') return list;
    return list.filter(a => a.severity === filter);
  });

  markRead(id: string): void {
    this.mockData.markAlertRead(id);
    this.notifications.show('[ACKNOWLEDGED] Alert recorded as reviewed', 'info');
  }

  dismiss(id: string): void {
    this.mockData.dismissAlert(id);
    this.notifications.show('[DISMISSED] Alert removed from active feed', 'info');
  }

  markAllRead(): void {
    this.mockData.markAllAlertsRead();
    this.notifications.success('[CLEARED] All telemetry alerts acknowledged.');
  }
}
