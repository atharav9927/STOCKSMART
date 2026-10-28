import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, StatusChipComponent } from '../../../shared';
import { User, UserRole, TableColumn, ROLE_LABELS } from '../../../core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent, StatusChipComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">OPERATOR ACCESS & ROLES</h1>
          <p class="page__subtitle">IDENTITY MANAGEMENT, ROLE CLEARANCE & FACILITY ASSIGNMENTS</p>
        </div>
        <button class="btn btn--primary btn--sm" (click)="showNewModal.set(true)">
          [ + ONBOARD OPERATOR ]
        </button>
      </div>

      @if (showNewModal()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">CREATE OPERATOR ACCOUNT</span>
          <div class="grid grid--3" style="margin-top: 16px;">
            <input type="email" class="form-field__input form-field__input--boxed" placeholder="Email Address" [(ngModel)]="newEmail" />
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="First Name" [(ngModel)]="newFirst" />
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="Last Name" [(ngModel)]="newLast" />
          </div>
          <div class="layout-row layout-gap-md" style="margin-top: 16px;">
            <div style="max-width: 240px;">
              <label class="text-label">CLEARANCE ROLE *</label>
              <select class="form-field__input form-field__input--boxed" [(ngModel)]="newRole">
                <option value="admin">Administrator</option>
                <option value="inventory_manager">Inventory Manager</option>
                <option value="buyer">Buyer</option>
                <option value="store_clerk">Store Clerk</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div class="layout-row layout-gap-sm" style="margin-top: 16px;">
            <button class="btn btn--primary btn--sm" (click)="saveUser()">CREATE ACCOUNT</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewModal.set(false)">CANCEL</button>
          </div>
        </div>
      }

      <app-data-table
        [data]="mockData.users()"
        [allColumns]="columns"
        [total]="mockData.users().length"
        [searchable]="true"
      />
    </div>
  `
})
export class UserListComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  showNewModal = signal(false);
  newEmail = '';
  newFirst = '';
  newLast = '';
  newRole: UserRole = 'store_clerk';

  columns: TableColumn[] = [
    { key: 'email', label: 'OPERATOR EMAIL', sortable: true, width: '220px' },
    {
      key: 'name',
      label: 'FULL NAME',
      sortable: true,
      format: (val, row: any) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'role',
      label: 'ROLE CLEARANCE',
      sortable: true,
      format: (val: any) => ROLE_LABELS[val as UserRole] || val
    },
    { key: 'lastLogin', label: 'LAST ACTIVE', sortable: true, type: 'date' },
    {
      key: 'isActive',
      label: 'STATUS',
      format: (val) => val ? '● ACTIVE' : '○ DISABLED'
    }
  ];

  saveUser(): void {
    if (!this.newEmail || !this.newFirst) return;
    const newUser: User = {
      id: `usr-00${this.mockData.users().length + 1}`,
      email: this.newEmail,
      firstName: this.newFirst,
      lastName: this.newLast || '',
      role: this.newRole,
      assignedLocationIds: [],
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    this.mockData.users.update(list => [...list, newUser]);
    this.notifications.success(`[ONBOARDED] Created account for ${newUser.email}`);
    this.showNewModal.set(false);
    this.newEmail = '';
    this.newFirst = '';
    this.newLast = '';
  }
}
