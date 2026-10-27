import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-over',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="slide-overlay" (click)="close.emit()" (keydown.escape)="close.emit()"></div>
      <aside class="slide-panel" [class.slide-panel--wide]="wide" role="dialog" [attr.aria-label]="title">
        <div class="slide-panel__header">
          <h2 class="text-subheading">{{ title }}</h2>
          <button class="btn btn--ghost btn--sm" (click)="close.emit()" aria-label="Close panel">[ X ]</button>
        </div>
        <div class="slide-panel__body">
          <ng-content></ng-content>
        </div>
      </aside>
    }
  `,
  styles: [`
    .slide-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: var(--z-overlay);
      animation: fadeIn var(--duration-fast) var(--ease-out);
    }
    .slide-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      max-width: 100vw;
      background: var(--surface);
      border-left: 1px solid var(--border-visible);
      z-index: var(--z-modal);
      display: flex;
      flex-direction: column;
      animation: slideIn var(--duration-normal) var(--ease-out);
    }
    .slide-panel--wide {
      width: 640px;
    }
    .slide-panel__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--border);
    }
    .slide-panel__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-lg);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .slide-overlay,
      .slide-panel {
        animation: none;
      }
    }
  `],
})
export class SlideOverComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() wide = false;
  @Output() close = new EventEmitter<void>();
}
