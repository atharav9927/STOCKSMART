import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ScanInputComponent } from '../../../shared';
import { Product } from '../../../core/models';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-pos-simulator',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScanInputComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">RETAIL STORE POINT-OF-SALE SIMULATOR</h1>
          <p class="page__subtitle">FRONT-DESK REGISTER • BARCODE SCAN & INSTANT INVENTORY DEPLETION</p>
        </div>
        <a routerLink="/orders" class="btn btn--secondary btn--sm">← ORDERS</a>
      </div>

      <div class="pos-grid">
        <!-- Scan Terminal -->
        <div class="pos-scan-pane">
          <div class="card card--raised">
            <app-scan-input
              label="SCAN PRODUCT BARCODE / EAN"
              placeholder="Scan SKU barcode to add to cart..."
              (scanned)="scanItem($event)"
            />
          </div>

          <!-- Fast Touch Buttons -->
          <div class="card" style="margin-top: 16px;">
            <span class="text-label text-muted">QUICK-TAP SPEED PRESETS</span>
            <div class="grid grid--3" style="margin-top: 12px;">
              @for (p of quickPresets(); track p.id) {
                <button class="btn btn--secondary btn--sm" (click)="addToCart(p)">
                  + {{ p.name }} (\${{ p.unitPrice }})
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Receipt Tape / Register Cart -->
        <div class="pos-cart-pane">
          <div class="card card--raised">
            <div class="layout-between" style="border-bottom: 1px solid var(--border); padding-bottom: 8px;">
              <span class="text-subheading">REGISTER CART ({{ cartItems().length }})</span>
              <button class="btn btn--ghost btn--sm text-error" (click)="clearCart()" [disabled]="cartItems().length === 0">
                CLEAR
              </button>
            </div>

            <div class="cart-items-list" style="margin: 16px 0;">
              @for (item of cartItems(); track item.product.id) {
                <div class="layout-between" style="padding: 8px 0; border-bottom: 1px solid var(--border);">
                  <div>
                    <span class="text-body-sm font-medium">{{ item.product.name }}</span>
                    <p class="text-data text-caption text-secondary">{{ item.quantity }} × \${{ item.product.unitPrice }}</p>
                  </div>
                  <span class="text-data text-subheading">\${{ item.quantity * item.product.unitPrice }}</span>
                </div>
              } @empty {
                <div class="empty text-caption text-disabled" style="padding: 32px 0;">
                  Cart is empty. Scan an item barcode.
                </div>
              }
            </div>

            <div class="cart-totals" style="border-top: 2px solid var(--border-visible); padding-top: 16px;">
              <div class="layout-between">
                <span class="text-subheading">TOTAL DUE:</span>
                <span class="text-display-md text-data text-success">\${{ cartTotal() }}</span>
              </div>
              <button
                class="btn btn--primary"
                style="width: 100%; margin-top: 16px;"
                [disabled]="cartItems().length === 0"
                (click)="checkout()"
              >
                COMPLETE SALE & DEDUCT STOCK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pos-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: var(--space-lg);
    }
    @media (max-width: 900px) {
      .pos-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PosSimulatorComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  cartItems = signal<CartItem[]>([]);

  quickPresets = computed(() => this.mockData.products().slice(0, 6));

  cartTotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.quantity * item.product.unitPrice), 0);
  });

  scanItem(code: string): void {
    const res = this.mockData.lookupBarcode(code);
    if (res) {
      this.addToCart(res.product);
      this.notifications.success(`[ADDED] ${res.product.name} (\${${res.product.unitPrice}})`);
    } else {
      this.notifications.error(`[UNKNOWN] Barcode ${code} not in catalog`);
    }
  }

  addToCart(prod: Product): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === prod.id);
      if (existing) {
        return items.map(i => i.product.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { product: prod, quantity: 1 }];
    });
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  checkout(): void {
    const total = this.cartTotal();
    const count = this.cartItems().length;

    // Deduct stock for store location
    this.cartItems().forEach(item => {
      const sl = this.mockData.stockLevels().find(s => s.productId === item.product.id && s.locationId === 'loc-003');
      if (sl) {
        this.mockData.addMovement({
          type: 'sale',
          productId: item.product.id,
          productSku: item.product.sku,
          productName: item.product.name,
          locationId: 'loc-003',
          locationName: 'Downtown Flagship Store',
          quantity: item.quantity,
          previousQuantity: sl.quantityOnHand,
          newQuantity: Math.max(0, sl.quantityOnHand - item.quantity),
          unitCost: item.product.unitCost,
          referenceType: 'POS_RECEIPT',
          referenceId: `POS-${Date.now()}`
        });
      }
    });

    this.notifications.success(`[TENDERED] Sale complete: \${${total}} for ${count} items. Stock adjusted.`);
    this.clearCart();
  }
}
