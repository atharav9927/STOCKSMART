import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi card">
      <div class="kpi__header">
        <span class="text-label">{{ label }}</span>
        @if (icon) {
          <span class="kpi__icon" aria-hidden="true">{{ icon }}</span>
        }
      </div>
      <div class="kpi__body">
        <span class="kpi__value text-display-lg">{{ formattedValue() }}</span>
        @if (suffix) {
          <span class="kpi__suffix text-label">{{ suffix }}</span>
        }
      </div>
      @if (showChange) {
        <div class="kpi__change" [ngClass]="changeClass()">
          <span class="kpi__arrow" aria-hidden="true">{{ changeArrow() }}</span>
          <span class="text-caption">{{ formattedChange() }}</span>
          <span class="text-label kpi__period">vs last period</span>
        </div>
      }
      @if (trend.length > 0) {
        <div class="kpi__sparkline">
          <svg [attr.viewBox]="'0 0 ' + trend.length * 8 + ' 24'" preserveAspectRatio="none">
            <polyline
              [attr.points]="sparklinePoints()"
              fill="none"
              [attr.stroke]="sparklineColor()"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      }
    </div>
  `,
  styles: [`
    .kpi {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .kpi__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .kpi__icon {
      font-size: var(--body);
      color: var(--text-disabled);
    }
    .kpi__body {
      display: flex;
      align-items: baseline;
      gap: var(--space-xs);
    }
    .kpi__value {
      font-family: var(--font-display);
      font-size: var(--display-lg);
      line-height: var(--lh-display-lg);
      letter-spacing: var(--ls-display-lg);
      color: var(--text-display);
      font-variant-numeric: tabular-nums;
    }
    .kpi__suffix {
      color: var(--text-secondary);
    }
    .kpi__change {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }
    .kpi__arrow {
      font-size: var(--caption);
    }
    .kpi__period {
      color: var(--text-disabled);
    }
    .kpi__change--up {
      color: var(--success);
    }
    .kpi__change--down {
      color: var(--accent);
    }
    .kpi__change--flat {
      color: var(--text-secondary);
    }
    .kpi__sparkline {
      margin-top: var(--space-xs);
      height: 24px;
    }
    .kpi__sparkline svg {
      width: 100%;
      height: 24px;
    }
  `],
})
export class KpiCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() previousValue: number = 0;
  @Input() format: 'number' | 'currency' | 'percent' = 'number';
  @Input() suffix: string = '';
  @Input() icon: string = '';
  @Input() trend: number[] = [];
  @Input() showChange = true;
  @Input() invertChange = false;

  formattedValue = computed(() => {
    switch (this.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: this.value >= 1_000_000 ? 'compact' : 'standard',
          maximumFractionDigits: this.value >= 1_000_000 ? 1 : 0,
        }).format(this.value);
      case 'percent':
        return `${this.value.toFixed(1)}%`;
      default:
        return this.value >= 10000
          ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(this.value)
          : this.value.toLocaleString();
    }
  });

  changePercent = computed(() => {
    if (this.previousValue === 0) return 0;
    return ((this.value - this.previousValue) / this.previousValue) * 100;
  });

  formattedChange = computed(() => {
    const pct = this.changePercent();
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(1)}%`;
  });

  changeArrow = computed(() => {
    const pct = this.changePercent();
    if (pct > 0) return '↑';
    if (pct < 0) return '↓';
    return '→';
  });

  changeClass = computed(() => {
    const pct = this.changePercent();
    const isPositive = this.invertChange ? pct < 0 : pct > 0;
    const isNegative = this.invertChange ? pct > 0 : pct < 0;
    if (isPositive) return 'kpi__change--up';
    if (isNegative) return 'kpi__change--down';
    return 'kpi__change--flat';
  });

  sparklinePoints = computed(() => {
    if (this.trend.length === 0) return '';
    const max = Math.max(...this.trend);
    const min = Math.min(...this.trend);
    const range = max - min || 1;
    return this.trend
      .map((v, i) => `${i * 8},${24 - ((v - min) / range) * 20 - 2}`)
      .join(' ');
  });

  sparklineColor = computed(() => {
    const pct = this.changePercent();
    const isPositive = this.invertChange ? pct < 0 : pct > 0;
    if (isPositive) return 'var(--success)';
    if (pct === 0) return 'var(--text-secondary)';
    return 'var(--accent)';
  });
}
