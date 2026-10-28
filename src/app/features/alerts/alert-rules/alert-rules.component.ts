import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { AlertRule } from '../../../core/models';

@Component({
  selector: 'app-alert-rules',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">TELEMETRY & ALERT THRESHOLD RULES</h1>
          <p class="page__subtitle">SYSTEM TRIGGERS, ANOMALY DETECTORS & ESCALATION POLICIES</p>
        </div>
        <a routerLink="/alerts" class="btn btn--secondary btn--sm">← ALERTS CENTER</a>
      </div>

      <div class="card">
        <table class="dt__table">
          <thead>
            <tr>
              <th class="dt__th">RULE SPECIFICATION</th>
              <th class="dt__th">CATEGORY</th>
              <th class="dt__th">SEVERITY</th>
              <th class="dt__th">NOTIFICATION TARGET</th>
              <th class="dt__th" style="text-align: right;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            @for (rule of rules; track rule.id) {
              <tr class="dt__row">
                <td class="dt__td">
                  <span class="font-medium">{{ rule.name }}</span>
                  <p class="text-caption text-secondary">{{ rule.description }}</p>
                </td>
                <td class="dt__td text-caption text-muted">{{ rule.category | uppercase }}</td>
                <td class="dt__td">
                  <span class="chip chip--technical" [class.chip--error]="rule.severity === 'critical'" [class.chip--warning]="rule.severity === 'warning'">
                    {{ rule.severity | uppercase }}
                  </span>
                </td>
                <td class="dt__td text-data">{{ rule.notifyRoles.join(', ') }}</td>
                <td class="dt__td" style="text-align: right;">
                  <button class="btn btn--secondary btn--sm" (click)="toggleRule(rule)">
                    {{ rule.isActive ? 'ACTIVE ●' : 'PAUSED ○' }}
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
export class AlertRulesComponent {
  private notifications = inject(NotificationService);

  rules: AlertRule[] = [
    { id: 'ar-1', name: 'Zero Stock Outage Trigger', description: 'Fires when quantityAvailable hits 0 units at any facility', category: 'stock', severity: 'critical', isActive: true, conditions: { metric: 'available', op: '==', val: 0 }, notifyRoles: ['admin', 'inventory_manager', 'store_clerk'], createdBy: 'usr-001', createdAt: '2024-01-01' },
    { id: 'ar-2', name: 'Reorder Point Breach', description: 'Fires when quantityOnHand <= reorderPoint', category: 'stock', severity: 'warning', isActive: true, conditions: { metric: 'onHand', op: '<=', val: 'reorderPoint' }, notifyRoles: ['buyer', 'inventory_manager'], createdBy: 'usr-001', createdAt: '2024-01-01' },
    { id: 'ar-3', name: 'Dock Receipt Discrepancy', description: 'Triggered when received != expected on incoming goods receipt', category: 'procurement', severity: 'warning', isActive: true, conditions: { metric: 'variance', op: '!=', val: 0 }, notifyRoles: ['inventory_manager', 'buyer'], createdBy: 'usr-001', createdAt: '2024-01-01' }
  ];

  toggleRule(rule: AlertRule): void {
    rule.isActive = !rule.isActive;
    this.notifications.show(`[RULE] ${rule.name} is now ${rule.isActive ? 'ACTIVE' : 'PAUSED'}`, 'info');
  }
}
