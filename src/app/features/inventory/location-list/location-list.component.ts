import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent } from '../../../shared';
import { Location, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">FACILITIES & LOGISTICS NODES</h1>
          <p class="page__subtitle">DISTRIBUTION CENTERS, WAREHOUSES & RETAIL STORES</p>
        </div>
        <button class="btn btn--primary btn--sm" (click)="showNewModal.set(true)">
          [ + NEW LOCATION NODE ]
        </button>
      </div>

      <!-- Quick Location Node Cards -->
      <div class="grid grid--3" style="margin-bottom: 24px;">
        @for (loc of mockData.locations(); track loc.id) {
          <div class="card card--raised location-card" (click)="viewDetail(loc.id)">
            <div class="layout-between">
              <span class="chip chip--technical">{{ loc.type }}</span>
              <span class="chip" [class.chip--success]="loc.isActive">{{ loc.isActive ? 'OPERATIONAL' : 'OFFLINE' }}</span>
            </div>
            <h2 class="text-heading" style="margin-top: 8px;">{{ loc.name }}</h2>
            <span class="text-data text-subheading text-secondary">{{ loc.code }}</span>
            <div class="location-details">
              <div class="layout-between">
                <span class="text-label">ADDRESS</span>
                <span class="text-caption text-secondary">{{ loc.city }}, {{ loc.state }}</span>
              </div>
              <div class="layout-between">
                <span class="text-label">TOTAL VALUE</span>
                <span class="text-data text-success">\${{ loc.totalValue | number:'1.0-0' }}</span>
              </div>
              <div class="layout-between">
                <span class="text-label">SUPERVISOR</span>
                <span class="text-body-sm">{{ loc.managerName }}</span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- New Location Drawer -->
      @if (showNewModal()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">REGISTER NEW LOGISTICS NODE</span>
          <div class="grid grid--3" style="margin-top: 12px;">
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="Code (e.g. WH-SOUTH)" [(ngModel)]="newCode" />
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="Facility Name" [(ngModel)]="newName" />
            <select class="form-field__input form-field__input--boxed" [(ngModel)]="newType">
              <option value="warehouse">Warehouse</option>
              <option value="distribution_center">Distribution Center</option>
              <option value="store">Retail Store</option>
            </select>
          </div>
          <div class="layout-row layout-gap-sm" style="margin-top: 16px;">
            <button class="btn btn--primary btn--sm" (click)="saveLocation()">CREATE NODE</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewModal.set(false)">CANCEL</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .location-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      transition: border-color var(--duration-micro) var(--ease-out);
    }
    .location-card:hover {
      border-color: var(--text-primary);
    }
    .location-details {
      margin-top: var(--space-md);
      border-top: 1px solid var(--border);
      padding-top: var(--space-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
  `]
})
export class LocationListComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  showNewModal = signal(false);
  newCode = '';
  newName = '';
  newType: Location['type'] = 'warehouse';

  viewDetail(id: string): void {
    this.router.navigate(['/inventory/locations', id]);
  }

  saveLocation(): void {
    if (!this.newCode.trim() || !this.newName.trim()) return;
    const loc = this.mockData.addLocation({
      code: this.newCode.trim(),
      name: this.newName.trim(),
      type: this.newType
    });
    this.notifications.success(`[COMMITTED] Facility node ${loc.code} registered.`);
    this.showNewModal.set(false);
    this.newCode = '';
    this.newName = '';
  }
}
