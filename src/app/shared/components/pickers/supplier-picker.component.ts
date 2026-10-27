import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Supplier } from '../../../core/models';

@Component({
  selector: 'app-supplier-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="picker">
      @if (label) {
        <label class="text-label">{{ label }}</label>
      }
      <div class="picker__field" (click)="isOpen.set(!isOpen())">
        <span class="picker__selected text-body-sm" [class.text-disabled]="!selectedSupplier()">
          {{ selectedSupplier() ? selectedSupplier()!.name + ' (' + selectedSupplier()!.code + ')' : placeholder }}
        </span>
        <span class="picker__arrow text-caption" aria-hidden="true">{{ isOpen() ? '▲' : '▼' }}</span>
      </div>

      @if (isOpen()) {
        <div class="picker__overlay" (click)="isOpen.set(false)"></div>
        <div class="picker__menu">
          <div class="picker__list">
            @for (sup of suppliers(); track sup.id) {
              <div
                class="picker__item"
                [class.picker__item--active]="selectedId === sup.id"
                (click)="select(sup)"
              >
                <div class="layout-between">
                  <span class="text-data text-subheading">{{ sup.name }}</span>
                  <span class="text-label text-success">★ {{ sup.rating }}</span>
                </div>
                <span class="text-caption text-muted">Terms: {{ sup.paymentTerms }} • Lead: {{ sup.leadTimeDays }}d</span>
              </div>
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
      max-height: 260px;
      overflow-y: auto;
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
  `]
})
export class SupplierPickerComponent {
  private mockData = inject(MockDataService);

  @Input() label = '';
  @Input() placeholder = 'Select supplier...';
  @Input() selectedId: string | null = null;
  @Output() supplierSelected = new EventEmitter<Supplier>();

  isOpen = signal(false);
  suppliers = this.mockData.suppliers;

  selectedSupplier = computed(() => {
    return this.suppliers().find(s => s.id === this.selectedId) || null;
  });

  select(sup: Supplier): void {
    this.selectedId = sup.id;
    this.isOpen.set(false);
    this.supplierSelected.emit(sup);
  }
}
