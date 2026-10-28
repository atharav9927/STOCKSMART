import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuditLogEntry } from '../../../core/models';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">IMMUTABLE SYSTEM AUDIT LOG</h1>
          <p class="page__subtitle">CRYPTOGRAPHIC TRAIL OF ENTITY MUTATIONS • BEFORE/AFTER PROPERTY DIFFS</p>
        </div>
        <button class="btn btn--secondary btn--sm" (click)="notifications.success('[EXPORT] Audit trail exported.')">
          [ EXPORT COMPLIANCE LEDGER ]
        </button>
      </div>

      <div class="card">
        <table class="dt__table">
          <thead>
            <tr>
              <th class="dt__th" style="width: 170px;">TIMESTAMP</th>
              <th class="dt__th">OPERATOR</th>
              <th class="dt__th">ACTION</th>
              <th class="dt__th">TARGET ENTITY</th>
              <th class="dt__th">PROPERTY MUTATIONS (BEFORE → AFTER)</th>
              <th class="dt__th" style="text-align: right;">IP ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            @for (log of mockData.auditLogs(); track log.id) {
              <tr class="dt__row">
                <td class="dt__td text-data">{{ log.performedAt | date:'yyyy-MM-dd HH:mm:ss' }}</td>
                <td class="dt__td">
                  <span class="font-medium">{{ log.performedByName }}</span>
                  <span class="text-caption text-secondary" style="display: block;">{{ log.performedBy }}</span>
                </td>
                <td class="dt__td">
                  <span class="chip chip--technical" [class.chip--warning]="log.action === 'update'" [class.chip--success]="log.action === 'create'">
                    {{ log.action | uppercase }}
                  </span>
                </td>
                <td class="dt__td">
                  <span class="text-label">{{ log.entityType }}</span>
                  <p class="text-body-sm font-medium">{{ log.entityName }}</p>
                </td>
                <td class="dt__td">
                  @for (diff of log.changes; track diff.field) {
                    <div class="diff-chip">
                      <span class="text-label text-muted">{{ diff.field }}:</span>
                      <span class="diff-before text-data">{{ diff.before }}</span>
                      <span class="text-caption">→</span>
                      <span class="diff-after text-data text-success">{{ diff.after }}</span>
                    </div>
                  }
                </td>
                <td class="dt__td text-data" style="text-align: right;">{{ log.ipAddress }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .diff-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 3px 8px;
      font-size: 11px;
    }
    .diff-before {
      color: var(--accent);
      text-decoration: line-through;
    }
  `]
})
export class AuditLogComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
}
