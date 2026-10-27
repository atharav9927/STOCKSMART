import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="empty">
      <span class="text-display-xl text-error">403</span>
      <h1 class="text-subheading">[ACCESS RESTRICTED]</h1>
      <p class="text-caption text-disabled">Your operator credentials do not have clearance for this operational zone.</p>
      <a routerLink="/dashboard" class="btn btn--secondary btn--sm" style="margin-top: 16px;">
        RETURN TO OPERATIONS DASHBOARD
      </a>
    </div>
  `,
  styles: [`
    .empty {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: var(--space-sm);
    }
  `]
})
export class ForbiddenComponent {}
