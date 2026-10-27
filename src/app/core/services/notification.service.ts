import { Injectable, signal, computed } from '@angular/core';

export interface InlineNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSignal = signal<InlineNotification[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();
  readonly latest = computed(() => {
    const all = this.notificationsSignal();
    return all.length > 0 ? all[all.length - 1] : null;
  });

  private counter = 0;

  show(message: string, type: InlineNotification['type'] = 'info', duration = 4000): void {
    const id = `notif-${++this.counter}`;
    const notification: InlineNotification = {
      id,
      message,
      type,
      timestamp: Date.now(),
    };

    this.notificationsSignal.update(list => [...list, notification]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 6000);
  }

  warn(message: string): void {
    this.show(message, 'warning');
  }

  dismiss(id: string): void {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
  }

  dismissAll(): void {
    this.notificationsSignal.set([]);
  }
}
