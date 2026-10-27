import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-state" role="alert">
      <span class="error-state__prefix text-label text-error">[ERROR]</span>
      <span class="error-state__message text-body-sm">{{ message }}</span>
      @if (retryable) {
        <button class="btn btn--secondary btn--sm" (click)="retry.emit()">
          RETRY
        </button>
      }
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border: 1px solid var(--accent);
      border-radius: var(--radius-md);
    }
    .error-state__prefix {
      flex-shrink: 0;
    }
  `],
})
export class ErrorStateComponent {
  @Input() message = 'Something went wrong';
  @Input() retryable = true;
  @Output() retry = new EventEmitter<void>();
}
