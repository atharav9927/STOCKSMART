import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">SYSTEM ARCHITECTURE & GLOBAL SETTINGS</h1>
          <p class="page__subtitle">ENTERPRISE ERP CONNECTIONS, LOCALIZATION & TELEMETRY INTERVALS</p>
        </div>
        <button class="btn btn--primary btn--sm" (click)="saveSettings()">
          [ COMMIT CONFIGURATION ]
        </button>
      </div>

      <div class="grid grid--2">
        <div class="card">
          <span class="text-label text-muted">ENTERPRISE TELEMETRY INTERVALS</span>
          <div class="setting-list" style="margin-top: 16px;">
            <div class="setting-item">
              <div>
                <span class="text-body-sm font-medium">RFID Portal Antenna Sweep Rate</span>
                <p class="text-caption text-secondary">Polling frequency for fixed dock portals</p>
              </div>
              <input type="text" class="form-field__input form-field__input--boxed text-data" style="width: 100px;" [(ngModel)]="rfidRate" />
            </div>

            <div class="setting-item">
              <div>
                <span class="text-body-sm font-medium">Automated Stockout Alert Throttle</span>
                <p class="text-caption text-secondary">Minimum time window between duplicate alarms</p>
              </div>
              <input type="text" class="form-field__input form-field__input--boxed text-data" style="width: 100px;" [(ngModel)]="alertThrottle" />
            </div>
          </div>
        </div>

        <div class="card">
          <span class="text-label text-muted">DATA RETENTION & COMPLIANCE</span>
          <div class="setting-list" style="margin-top: 16px;">
            <div class="setting-item">
              <div>
                <span class="text-body-sm font-medium">Audit Trail Immutability Period</span>
                <p class="text-caption text-secondary">Cryptographic ledger retention period</p>
              </div>
              <span class="text-data text-success">7 YEARS (COMPLIANT)</span>
            </div>

            <div class="setting-item">
              <div>
                <span class="text-body-sm font-medium">Database Backup Snapshot Interval</span>
                <p class="text-caption text-secondary">Automated offsite backup schedule</p>
              </div>
              <span class="text-data">HOURLY (RPO &lt; 60m)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .setting-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--space-sm);
    }
  `]
})
export class SystemSettingsComponent {
  themeService = inject(ThemeService);
  private notifications = inject(NotificationService);

  rfidRate = '500 ms';
  alertThrottle = '15 mins';

  saveSettings(): void {
    this.notifications.success('[COMMITTED] System architecture settings persisted.');
  }
}
