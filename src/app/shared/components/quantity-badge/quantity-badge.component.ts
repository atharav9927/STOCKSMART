import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="qty" [ngClass]="statusClass()">
      <span class="qty__value text-data">{{ formattedValue() }}</span>
      @if (unit) {
        <span class="qty__unit text-label">{{ unit }}</span>
      }
      @if (showStatus()) {
        <span class="qty__indicator" aria-hidden="true">{{ statusIcon() }}</span>
      }
    </span>
  `,
  styles: [`
    .qty {
      display: inline-flex;
      align-items: baseline;
      gap: var(--space-xs);
      font-family: var(--font-data);
      font-variant-numeric: tabular-nums;
    }
    .qty__value {
      font-size: var(--body-sm);
    }
    .qty__unit {
      font-size: var(--label);
      color: var(--text-secondary);
    }
    .qty__indicator {
      font-size: var(--caption);
    }
    .qty--success .qty__value { color: var(--success); }
    .qty--warning .qty__value,
    .qty--warning .qty__indicator { color: var(--warning); }
    .qty--error .qty__value,
    .qty--error .qty__indicator { color: var(--accent); }
  `],
})
export class QuantityBadgeComponent {
  @Input() value: number = 0;
  @Input() unit: string = '';
  @Input() reorderPoint: number = 0;
  @Input() showReorderStatus = false;

  formattedValue = computed(() => {
    return this.value.toLocaleString();
  });

  showStatus = computed(() => this.showReorderStatus && this.reorderPoint > 0);

  statusClass = computed(() => {
    if (!this.showReorderStatus) return '';
    if (this.value <= 0) return 'qty--error';
    if (this.value <= this.reorderPoint) return 'qty--warning';
    return 'qty--success';
  });

  statusIcon = computed(() => {
    if (this.value <= 0) return '✕';
    if (this.value <= this.reorderPoint) return '▼';
    return '●';
  });
}
