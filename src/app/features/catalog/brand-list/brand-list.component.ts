import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Brand } from '../../../core/models';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">BRAND REPOSITORY</h1>
          <p class="page__subtitle">MANUFACTURERS & ORIGINAL HARDWARE VENDORS</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <button class="btn btn--primary btn--sm" (click)="showNewBrand.set(true)">
            [ + REGISTER BRAND ]
          </button>
        </div>
      </div>

      @if (showNewBrand()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">REGISTER BRAND PARTNER</span>
          <div class="layout-row layout-gap-md" style="margin-top: 12px;">
            <input
              type="text"
              class="form-field__input form-field__input--boxed"
              placeholder="Brand name (e.g. Teenage Engineering)"
              [(ngModel)]="brandName"
              style="max-width: 360px;"
            />
            <button class="btn btn--primary btn--sm" (click)="saveBrand()">SAVE</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewBrand.set(false)">CANCEL</button>
          </div>
        </div>
      }

      <div class="grid grid--3">
        @for (brand of brands(); track brand.id) {
          <div class="card card--raised">
            <div class="layout-between">
              <span class="text-label text-muted">BRAND ID: {{ brand.id }}</span>
              <span class="chip chip--technical">{{ brand.productCount }} SKUS</span>
            </div>
            <h2 class="text-heading" style="margin-top: 8px;">{{ brand.name }}</h2>
            <div class="meta-row" style="margin-top: 16px;">
              <span class="text-caption text-secondary">Authorized Retail Vendor</span>
              <button class="btn btn--ghost btn--sm text-error" (click)="removeBrand(brand.id)">
                DELETE
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border);
      padding-top: var(--space-sm);
    }
  `]
})
export class BrandListComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  brands = this.mockData.brands;
  showNewBrand = signal(false);
  brandName = '';

  saveBrand(): void {
    if (!this.brandName.trim()) return;
    const newBrand: Brand = {
      id: `br-0${this.brands().length + 1}`,
      name: this.brandName.trim(),
      productCount: 0
    };
    this.mockData.brands.update(list => [...list, newBrand]);
    this.notifications.success(`[SAVED] Brand ${newBrand.name} registered.`);
    this.brandName = '';
    this.showNewBrand.set(false);
  }

  removeBrand(id: string): void {
    this.mockData.brands.update(list => list.filter(b => b.id !== id));
    this.notifications.show('[DELETED] Brand removed.', 'warning');
  }
}
