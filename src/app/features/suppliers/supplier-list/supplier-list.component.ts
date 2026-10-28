import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, StatusChipComponent } from '../../../shared';
import { Supplier, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent, StatusChipComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">VENDORS & SUPPLIER NETWORK</h1>
          <p class="page__subtitle">COMMERCIAL TERMS, LEAD TIMES & VENDOR PERFORMANCE METRICS</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <a routerLink="/suppliers/compare" class="btn btn--secondary btn--sm">[ COMPARE VENDORS ]</a>
          <button class="btn btn--primary btn--sm" (click)="showNewModal.set(true)">[ + REGISTER VENDOR ]</button>
        </div>
      </div>

      <!-- Vendor Cards Grid -->
      <div class="grid grid--3" style="margin-bottom: 24px;">
        @for (sup of mockData.suppliers(); track sup.id) {
          <div class="card card--raised supplier-card" (click)="viewDetail(sup.id)">
            <div class="layout-between">
              <span class="text-data text-subheading text-muted">{{ sup.code }}</span>
              <span class="chip chip--success">★ {{ sup.rating }} RATING</span>
            </div>
            <h2 class="text-heading" style="margin-top: 8px;">{{ sup.name }}</h2>
            <span class="text-caption text-secondary">{{ sup.contactName }} • {{ sup.city }}, {{ sup.country }}</span>

            <div class="supplier-metrics">
              <div class="layout-between">
                <span class="text-label">ON-TIME DELIVERY</span>
                <span class="text-data text-success">{{ sup.onTimeDeliveryRate }}%</span>
              </div>
              <div class="layout-between">
                <span class="text-label">QUALITY RATE</span>
                <span class="text-data text-success">{{ sup.qualityRate }}%</span>
              </div>
              <div class="layout-between">
                <span class="text-label">AVERAGE LEAD TIME</span>
                <span class="text-data">{{ sup.leadTimeDays }} DAYS</span>
              </div>
            </div>
          </div>
        }
      </div>

      @if (showNewModal()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">REGISTER NEW VENDOR</span>
          <div class="grid grid--3" style="margin-top: 16px;">
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="Vendor Code (e.g. SUP-SONY)" [(ngModel)]="newCode" />
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="Company Name" [(ngModel)]="newName" />
            <input type="text" class="form-field__input form-field__input--boxed" placeholder="Contact Person" [(ngModel)]="newContact" />
          </div>
          <div class="layout-row layout-gap-sm" style="margin-top: 16px;">
            <button class="btn btn--primary btn--sm" (click)="saveSupplier()">SAVE VENDOR</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewModal.set(false)">CANCEL</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .supplier-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      transition: border-color var(--duration-micro) var(--ease-out);
    }
    .supplier-card:hover {
      border-color: var(--text-primary);
    }
    .supplier-metrics {
      margin-top: var(--space-md);
      border-top: 1px solid var(--border);
      padding-top: var(--space-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
  `]
})
export class SupplierListComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  showNewModal = signal(false);
  newCode = '';
  newName = '';
  newContact = '';

  viewDetail(id: string): void {
    this.router.navigate(['/suppliers', id]);
  }

  saveSupplier(): void {
    if (!this.newCode || !this.newName) return;
    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      code: this.newCode,
      name: this.newName,
      contactName: this.newContact || 'Operations Lead',
      email: 'orders@vendor.com',
      phone: '+1 800 555 0100',
      address: '100 Supply Ave',
      city: 'Industrial City',
      state: 'IL',
      zipCode: '60001',
      country: 'USA',
      paymentTerms: 'Net 30',
      leadTimeDays: 7,
      minimumOrder: 2500,
      currency: 'USD',
      rating: 4.8,
      isActive: true,
      productCount: 10,
      totalOrders: 0,
      onTimeDeliveryRate: 98.0,
      qualityRate: 99.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockData.suppliers.update(list => [...list, newSup]);
    this.notifications.success(`[SAVED] Supplier ${newSup.name} onboarded.`);
    this.showNewModal.set(false);
    this.newCode = '';
    this.newName = '';
  }
}
