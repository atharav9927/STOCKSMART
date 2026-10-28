import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface ProcurementRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  isActive: boolean;
}

@Component({
  selector: 'app-procurement-rules',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">REPLENISHMENT & REORDER POLICIES</h1>
          <p class="page__subtitle">AUTOMATED THRESHOLDS, SAFETY BUFFERS & VENDOR ROUTING</p>
        </div>
        <button class="btn btn--primary btn--sm" (click)="notifications.show('[SAVED] New policy configuration initialized', 'info')">
          [ + NEW POLICY RULE ]
        </button>
      </div>

      <div class="card">
        <table class="dt__table">
          <thead>
            <tr>
              <th class="dt__th">POLICY DIRECTIVE</th>
              <th class="dt__th">TRIGGER CONDITION</th>
              <th class="dt__th">AUTOMATION ACTION</th>
              <th class="dt__th" style="text-align: right;">STATE</th>
            </tr>
          </thead>
          <tbody>
            @for (rule of rules; track rule.id) {
              <tr class="dt__row">
                <td class="dt__td font-medium">{{ rule.name }}</td>
                <td class="dt__td text-caption text-secondary">{{ rule.condition }}</td>
                <td class="dt__td text-data">{{ rule.action }}</td>
                <td class="dt__td" style="text-align: right;">
                  <button
                    class="btn btn--secondary btn--sm"
                    (click)="rule.isActive = !rule.isActive"
                  >
                    {{ rule.isActive ? 'ENABLED ●' : 'PAUSED ○' }}
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
export class ProcurementRulesComponent {
  notifications = inject(NotificationService);

  rules: ProcurementRule[] = [
    { id: 'pr-1', name: 'Auto-Replenish Class A Hardware', condition: 'On-Hand <= ReorderPoint AND OpenPOs == 0', action: 'Draft PO with preferred supplier for 1.5x batch', isActive: true },
    { id: 'pr-2', name: 'Lead Time Buffer Adjuster', condition: 'Supplier leadTimeDays > 14', action: 'Scale ReorderPoint threshold by +25%', isActive: true },
    { id: 'pr-3', name: 'Weekend Order Consolidation', condition: 'Requisitions generated between Fri-Sun', action: 'Bundle into single consolidated Monday PO', isActive: false }
  ];
}
