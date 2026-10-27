import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [ngClass]="layoutClass">
      @if (type === 'table') {
        <div class="skeleton-table">
          <div class="skeleton-row skeleton-header"></div>
          @for (row of rowsArray; track $index) {
            <div class="skeleton-row"></div>
          }
        </div>
      } @else if (type === 'card') {
        <div class="skeleton-card">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-metric"></div>
          <div class="skeleton-line skeleton-sub"></div>
        </div>
      } @else {
        <div class="skeleton-lines">
          @for (row of rowsArray; track $index) {
            <div class="skeleton-line" [style.width]="getWidth($index)"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      width: 100%;
      display: block;
    }
    .skeleton-table {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .skeleton-row {
      height: 36px;
      background: var(--surface-raised);
      border-radius: var(--radius-sm);
      animation: pulse 1.5s infinite ease-in-out;
    }
    .skeleton-header {
      height: 28px;
      opacity: 0.6;
    }
    .skeleton-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .skeleton-line {
      height: 14px;
      background: var(--surface-raised);
      border-radius: var(--radius-sm);
      animation: pulse 1.5s infinite ease-in-out;
    }
    .skeleton-title {
      width: 40%;
      height: 12px;
    }
    .skeleton-metric {
      width: 70%;
      height: 32px;
    }
    .skeleton-sub {
      width: 50%;
      height: 12px;
    }
    .skeleton-lines {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 0.8; }
      100% { opacity: 0.4; }
    }
    @media (prefers-reduced-motion: reduce) {
      .skeleton-row, .skeleton-line {
        animation: none;
        opacity: 0.6;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'card' | 'lines' = 'lines';
  @Input() rows = 4;
  @Input() layoutClass = '';

  get rowsArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }

  getWidth(index: number): string {
    const widths = ['100%', '85%', '92%', '70%', '60%'];
    return widths[index % widths.length];
  }
}
