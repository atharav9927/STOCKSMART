import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (inline) {
      <span class="loading-inline text-label" role="status">
        [LOADING{{ dots }}]
      </span>
    } @else {
      <div class="loading" role="status">
        <div class="loading__spinner" aria-hidden="true">
          @for (seg of segments; track seg) {
            <span class="loading__segment" [style.animation-delay]="seg * 100 + 'ms'"></span>
          }
        </div>
        <span class="text-label">[LOADING{{ dots }}]</span>
      </div>
    }
  `,
  styles: [`
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl) var(--space-xl);
      gap: var(--space-md);
      color: var(--text-secondary);
    }
    .loading__spinner {
      display: flex;
      gap: 3px;
    }
    .loading__segment {
      width: 4px;
      height: 16px;
      background: var(--text-secondary);
      animation: segmentPulse 1s ease-out infinite;
    }
    .loading-inline {
      color: var(--text-secondary);
    }
    @keyframes segmentPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .loading__segment {
        animation: none;
        opacity: 0.6;
      }
    }
  `],
})
export class LoadingStateComponent {
  @Input() inline = false;
  readonly segments = [0, 1, 2, 3, 4, 5, 6, 7];
  readonly dots = '...';
}
