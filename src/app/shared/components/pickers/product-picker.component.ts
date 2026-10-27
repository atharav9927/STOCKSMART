import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="picker">
      @if (label) {
        <label class="text-label">{{ label }}</label>
      }
      <div class="picker__field" (click)="isOpen.set(!isOpen())">
        <span class="picker__selected text-body-sm" [class.text-disabled]="!selectedProduct()">
          {{ selectedProduct() ? selectedProduct()!.sku + ' — ' + selectedProduct()!.name : placeholder }}
        </span>
        <span class="picker__arrow text-caption" aria-hidden="true">{{ isOpen() ? '▲' : '▼' }}</span>
      </div>

      @if (isOpen()) {
        <div class="picker__overlay" (click)="isOpen.set(false)"></div>
        <div class="picker__menu">
          <div class="picker__search">
            <input
              type="text"
              class="form-field__input form-field__input--boxed"
              placeholder="Search by SKU or name..."
              [(ngModel)]="searchQuery"
              (click)="$event.stopPropagation()"
              autofocus
            />
          </div>
          <div class="picker__list">
            @for (p of filteredProducts(); track p.id) {
              <div
                class="picker__item"
                [class.picker__item--active]="selectedId === p.id"
                (click)="select(p)"
              >
                <div class="layout-between">
                  <span class="text-data text-subheading">{{ p.sku }}</span>
                  <span class="text-data text-caption">\${{ p.unitPrice }}</span>
                </div>
                <span class="text-body-sm">{{ p.name }}</span>
              </div>
            } @empty {
              <div class="picker__empty text-caption text-muted">No matching products</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .picker {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .picker__field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-md);
      padding: var(--space-sm) var(--space-md);
      background: var(--surface);
      cursor: pointer;
      min-height: 44px;
    }
    .picker__field:hover {
      border-color: var(--text-primary);
    }
    .picker__overlay {
      position: fixed;
      inset: 0;
      z-index: var(--z-dropdown);
    }
    .picker__menu {
      position: absolute;
      top: calc(100% + var(--space-xs));
      left: 0;
      right: 0;
      background: var(--surface-raised);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-md);
      z-index: calc(var(--z-dropdown) + 1);
      max-height: 280px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .picker__search {
      padding: var(--space-sm);
      border-bottom: 1px solid var(--border);
    }
    .picker__search input {
      width: 100%;
      font-size: var(--body-sm);
    }
    .picker__list {
      overflow-y: auto;
      max-height: 220px;
    }
    .picker__item {
      padding: var(--space-sm) var(--space-md);
      cursor: pointer;
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .picker__item:hover {
      background: var(--surface);
    }
    .picker__item--active {
      border-left: 2px solid var(--accent);
      background: var(--surface);
    }
    .picker__empty {
      padding: var(--space-md);
      text-align: center;
    }
  `]
})
export class ProductPickerComponent {
  private mockData = inject(MockDataService);

  @Input() label = '';
  @Input() placeholder = 'Select product...';
  @Input() selectedId: string | null = null;
  @Output() productSelected = new EventEmitter<Product>();

  isOpen = signal(false);
  searchQuery = '';

  selectedProduct = computed(() => {
    return this.mockData.products().find(p => p.id === this.selectedId) || null;
  });

  filteredProducts = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    const all = this.mockData.products();
    if (!q) return all.slice(0, 50);
    return all.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)).slice(0, 50);
  });

  select(product: Product): void {
    this.selectedId = product.id;
    this.isOpen.set(false);
    this.productSelected.emit(product);
  }
}
