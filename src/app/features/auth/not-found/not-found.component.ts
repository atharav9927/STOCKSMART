import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="empty">
      <span class="text-display-xl text-disabled">404</span>
      <h1 class="text-subheading">[ENDPOINT NOT FOUND]</h1>
      <p class="text-caption text-disabled">The requested resource or location ledger does not exist.</p>
      <a routerLink="/dashboard" class="btn btn--secondary btn--sm" style="margin-top: 16px;">
        RETURN TO OPERATIONS
      </a>
    </div>
  `,
  styles: [`
    .empty {
      min-height: 70vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: var(--space-sm);
    }
  `]
})
export class NotFoundComponent {}
