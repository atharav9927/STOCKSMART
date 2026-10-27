import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

const TYPE_LABELS: Record<string, string> = {
  success: 'SAVED',
  error: 'ERROR',
  warning: 'WARNING',
  info: 'INFO',
};

@Component({
  selector: 'app-inline-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (notif of notificationService.notifications(); track notif.id) {
      <div
        class="inline-notif"
        [ngClass]="'inline-notif--' + notif.type"
        role="status"
        [attr.aria-live]="notif.type === 'error' ? 'assertive' : 'polite'"
      >
        <span class="inline-notif__label text-label">[{{ getLabel(notif.type) }}]</span>
        <span class="inline-notif__message text-caption">{{ notif.message }}</span>
        <button
          class="inline-notif__dismiss"
          (click)="notificationService.dismiss(notif.id)"
          aria-label="Dismiss"
        >✕</button>
      </div>
    }
  `,
  styles: [`
    :host {
      position: fixed;
      bottom: var(--space-lg);
      right: var(--space-lg);
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      max-width: 400px;
    }
    .inline-notif {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: var(--surface);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-md);
      animation: fadeIn var(--duration-fast) var(--ease-out);
    }
    .inline-notif--success .inline-notif__label { color: var(--success); }
    .inline-notif--error .inline-notif__label { color: var(--accent); }
    .inline-notif--warning .inline-notif__label { color: var(--warning); }
    .inline-notif--info .inline-notif__label { color: var(--text-secondary); }
    .inline-notif__message {
      flex: 1;
      color: var(--text-primary);
    }
    .inline-notif__dismiss {
      background: none;
      border: none;
      color: var(--text-disabled);
      cursor: pointer;
      font-size: var(--caption);
      padding: var(--space-xs);
    }
    .inline-notif__dismiss:hover {
      color: var(--text-primary);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .inline-notif { animation: none; }
    }
  `],
})
export class InlineNotificationComponent {
  notificationService = inject(NotificationService);

  getLabel(type: string): string {
    return TYPE_LABELS[type] ?? 'INFO';
  }
}
