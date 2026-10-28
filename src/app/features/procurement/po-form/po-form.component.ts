import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SupplierPickerComponent, LocationPickerComponent, ProductPickerComponent } from '../../../shared';
import { Supplier, Location, Product, PurchaseOrder, POItem } from '../../../core/models';

@Component({
  selector: 'app-po-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SupplierPickerComponent, LocationPickerComponent, ProductPickerComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">DRAFT PURCHASE ORDER</h1>
          <p class="page__subtitle">VENDOR REQUISITION SPECIFICATION & CARRIER DETAILS</p>
        </div>
        <a routerLink="/procurement/orders" class="btn btn--secondary btn--sm">← PURCHASE ORDERS</a>
      </div>

      <div class="card" style="max-width: 900px;">
        <span class="text-label text-muted">HEADER DATA & PARTIES</span>
        <div class="grid grid--2" style="margin-top: 16px;">
          <app-supplier-picker
            label="SUPPLIER / VENDOR *"
            [selectedId]="supplierId"
            (supplierSelected)="supplierId = $event.id"
          />
          <app-location-picker
            label="DESTINATION WAREHOUSE / DOCK *"
            [selectedId]="locationId"
            (locationSelected)="locationId = $event.id"
          />
        </div>

        <div class="grid grid--2" style="margin-top: 16px;">
          <div>
            <label class="text-label">ESTIMATED DELIVERY DATE *</label>
            <input type="date" class="form-field__input form-field__input--boxed" [(ngModel)]="deliveryDate" />
          </div>
          <div>
            <label class="text-label">INTERNAL REFERENCE / NOTES</label>
            <input type="text" class="form-field__input form-field__input--boxed" [(ngModel)]="notes" placeholder="e.g. Q4 Stock replenishment" />
          </div>
        </div>

        <hr class="divider" />

        <!-- Line Item Builder -->
        <span class="text-label text-muted">LINE ITEMS INVENTORY</span>
        <div class="layout-row layout-gap-md" style="margin-top: 12px; align-items: flex-end;">
          <div style="flex: 2;">
            <app-product-picker
              label="SELECT SKU TO ORDER"
              [selectedId]="selectedProdId"
              (productSelected)="selectedProdId = $event.id"
            />
          </div>
          <div style="width: 120px;">
            <label class="text-label">ORDER QTY</label>
            <input type="number" class="form-field__input form-field__input--boxed text-data" min="1" [(ngModel)]="itemQty" />
          </div>
          <button class="btn btn--secondary" (click)="addLineItem()">+ ADD ITEM</button>
        </div>

        @if (lineItems.length > 0) {
          <table class="dt__table" style="margin-top: 24px;">
            <thead>
              <tr>
                <th class="dt__th">SKU</th>
                <th class="dt__th">DESIGNATION</th>
                <th class="dt__th" style="text-align: right;">QTY</th>
                <th class="dt__th" style="text-align: right;">UNIT COST</th>
                <th class="dt__th" style="text-align: right;">EXTENDED TOTAL</th>
                <th class="dt__th"></th>
              </tr>
            </thead>
            <tbody>
              @for (item of lineItems; track item.productId; let idx = $index) {
                <tr class="dt__row">
                  <td class="dt__td text-data">{{ item.productSku }}</td>
                  <td class="dt__td">{{ item.productName }}</td>
                  <td class="dt__td text-data" style="text-align: right;">{{ item.quantityOrdered }}</td>
                  <td class="dt__td text-data" style="text-align: right;">\${{ item.unitCost }}</td>
                  <td class="dt__td text-data" style="text-align: right;">\${{ item.totalCost }}</td>
                  <td class="dt__td" style="text-align: center;">
                    <button class="btn btn--ghost btn--sm text-error" (click)="removeLineItem(idx)">✕</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <div class="layout-between" style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px;">
            <span class="text-subheading">TOTAL REQUISITION VALUE</span>
            <span class="text-display-md text-data">\${{ calculateSubtotal() }}</span>
          </div>
        }

        <div class="layout-row layout-gap-sm" style="margin-top: 24px;">
          <button
            class="btn btn--primary"
            [disabled]="lineItems.length === 0"
            (click)="submitPO()"
          >
            AUTHORIZE & ISSUE PURCHASE ORDER
          </button>
        </div>
      </div>
    </div>
  `
})
export class PoFormComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  supplierId = 'sup-002';
  locationId = 'loc-001';
  deliveryDate = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
  notes = '';

  selectedProdId = 'prod-1';
  itemQty = 100;
  lineItems: POItem[] = [];

  addLineItem(): void {
    const p = this.mockData.products().find(prod => prod.id === this.selectedProdId);
    if (!p) return;

    this.lineItems.push({
      id: `poi-${Date.now()}`,
      productId: p.id,
      productSku: p.sku,
      productName: p.name,
      quantityOrdered: Number(this.itemQty),
      quantityReceived: 0,
      unitCost: p.unitCost,
      totalCost: Number(this.itemQty) * p.unitCost,
      receiptStatus: 'pending'
    });
  }

  removeLineItem(idx: number): void {
    this.lineItems.splice(idx, 1);
  }

  calculateSubtotal(): number {
    return this.lineItems.reduce((sum, item) => sum + item.totalCost, 0);
  }

  submitPO(): void {
    const sup = this.mockData.suppliers().find(s => s.id === this.supplierId);
    const loc = this.mockData.locations().find(l => l.id === this.locationId);

    if (!sup || !loc) return;

    const po = this.mockData.createPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      locationId: loc.id,
      locationName: loc.name,
      expectedDeliveryDate: this.deliveryDate,
      notes: this.notes,
      items: this.lineItems,
      subtotal: this.calculateSubtotal()
    });

    this.notifications.success(`[ISSUED] Purchase Order ${po.poNumber} created and dispatched.`);
    this.router.navigate(['/procurement/orders', po.id]);
  }
}
