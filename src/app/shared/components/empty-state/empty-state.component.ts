import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty" role="status">
      @if (showDotGrid) {
        <div class="empty__grid dot-grid-subtle" aria-hidden="true"></div>
      }
      <span class="empty__title text-subheading text-muted">{{ title }}</span>
      @if (message) {
        <span class="empty__message text-caption text-disabled">{{ message }}</span>
      }
      <div class="empty__actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-4xl) var(--space-xl);
      gap: var(--space-sm);
    }
    .empty__grid {
      width: 80px;
      height: 80px;
      margin-bottom: var(--space-md);
      border-radius: var(--radius-md);
      opacity: 0.5;
    }
    .empty__actions {
      margin-top: var(--space-md);
    }
  `],
})
export class EmptyStateComponent {
  @Input() title = 'No data';
  @Input() message = '';
  @Input() showDotGrid = true;
}
