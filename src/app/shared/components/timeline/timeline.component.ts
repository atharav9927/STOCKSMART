import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

export interface TimelineEvent {
  id: string;
  status: string;
  label: string;
  timestamp: string;
  user: string;
  notes?: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="timeline" role="list" [attr.aria-label]="ariaLabel">
      @for (event of events; track event.id; let first = $first; let last = $last) {
        <div class="timeline__item" role="listitem" [class.timeline__item--active]="first">
          <div class="timeline__indicator">
            <span class="timeline__dot" [class.timeline__dot--active]="first" aria-hidden="true">{{ first ? '●' : '○' }}</span>
            @if (!last) {
              <span class="timeline__line" aria-hidden="true"></span>
            }
          </div>
          <div class="timeline__content">
            <div class="layout-between">
              <span class="text-label">{{ event.label }}</span>
              <span class="text-caption">{{ event.timestamp | date:'MMM d, y HH:mm' }}</span>
            </div>
            <span class="text-body-sm">{{ event.user }}</span>
            @if (event.notes) {
              <span class="text-caption text-muted">{{ event.notes }}</span>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline {
      display: flex;
      flex-direction: column;
    }
    .timeline__item {
      display: flex;
      gap: var(--space-md);
      min-height: 64px;
    }
    .timeline__indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 20px;
      flex-shrink: 0;
    }
    .timeline__dot {
      font-size: var(--caption);
      color: var(--text-disabled);
      line-height: 1;
    }
    .timeline__dot--active {
      color: var(--success);
    }
    .timeline__line {
      width: 1px;
      flex: 1;
      background: var(--border);
      margin-top: var(--space-xs);
    }
    .timeline__content {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xs);
      padding-bottom: var(--space-md);
      flex: 1;
    }
    .timeline__item--active .timeline__content {
      color: var(--text-display);
    }
  `],
})
export class TimelineComponent {
  @Input() events: TimelineEvent[] = [];
  @Input() ariaLabel = 'Status history';
}
