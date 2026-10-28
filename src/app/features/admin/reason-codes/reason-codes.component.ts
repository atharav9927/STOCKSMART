import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ReasonCode } from '../../../core/models';

@Component({
  selector: 'app-reason-codes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">REASON CODES CLASSIFICATION</h1>
          <p class="page__subtitle">STANDARDIZED DISPOSITION & ADJUSTMENT JUSTIFICATION CODES</p>
        </div>
        <button class="btn btn--primary btn--sm" (click)="showNewModal.set(true)">
          [ + NEW REASON CODE ]
        </button>
      </div>

      @if (showNewModal()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">REGISTER REASON CODE</span>
          <div class="grid grid--3" style="margin-top: 16px;">
            <input type="text" class="form-field__input form-field__input--boxed text-data" placeholder="Code (e.g. DMG-WATER)" [(ngModel)]="newCode" />
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="Description" [(ngModel)]="newDesc" />
            <select class="form-field__input form-field__input--boxed" [(ngModel)]="newCat">
              <option value="adjustment">Stock Adjustment</option>
              <option value="damage">Damage / Scrap</option>
              <option value="return">Customer Return</option>
              <option value="write_off">Accounting Write-off</option>
            </select>
          </div>
          <div class="layout-row layout-gap-sm" style="margin-top: 16px;">
            <button class="btn btn--primary btn--sm" (click)="saveCode()">SAVE CODE</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewModal.set(false)">CANCEL</button>
          </div>
        </div>
      }

      <div class="card">
        <table class="dt__table">
          <thead>
            <tr>
              <th class="dt__th">CODE IDENTIFIER</th>
              <th class="dt__th">DESCRIPTION</th>
              <th class="dt__th">CATEGORY GROUP</th>
              <th class="dt__th" style="text-align: right;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            @for (rc of mockData.reasonCodes(); track rc.id) {
              <tr class="dt__row">
                <td class="dt__td text-data text-subheading">{{ rc.code }}</td>
                <td class="dt__td">{{ rc.description }}</td>
                <td class="dt__td">
                  <span class="chip chip--technical">{{ rc.category | uppercase }}</span>
                </td>
                <td class="dt__td" style="text-align: right;">
                  <button class="btn btn--secondary btn--sm" (click)="rc.isActive = !rc.isActive">
                    {{ rc.isActive ? 'ACTIVE ●' : 'PAUSED ○' }}
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
export class ReasonCodesComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  showNewModal = signal(false);
  newCode = '';
  newDesc = '';
  newCat: ReasonCode['category'] = 'adjustment';

  saveCode(): void {
    if (!this.newCode || !this.newDesc) return;
    const item: ReasonCode = {
      id: `rc-${Date.now()}`,
      code: this.newCode.toUpperCase(),
      description: this.newDesc,
      category: this.newCat,
      isActive: true,
      sortOrder: this.mockData.reasonCodes().length + 1
    };
    this.mockData.reasonCodes.update(list => [...list, item]);
    this.notifications.success(`[REGISTERED] Reason Code ${item.code} created.`);
    this.showNewModal.set(false);
    this.newCode = '';
    this.newDesc = '';
  }
}
