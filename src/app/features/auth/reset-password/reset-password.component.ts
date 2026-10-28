import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-card__header">
          <div class="auth-card__brand">
            <span class="auth-card__badge">SS</span>
            <span class="text-heading">STOCKSMART</span>
          </div>
          <span class="text-caption text-muted">CONFIGURE NEW SYSTEM PASSWORD</span>
        </div>

        <form (ngSubmit)="resetPassword()" class="auth-form">
          <div class="form-field">
            <label class="form-field__label">RECOVERY TOKEN</label>
            <input
              type="text"
              class="form-field__input form-field__input--boxed text-data"
              placeholder="e.g. 849-210"
              [(ngModel)]="token"
              name="token"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-field__label">NEW PASSWORD</label>
            <input
              type="password"
              class="form-field__input form-field__input--boxed"
              placeholder="••••••••"
              [(ngModel)]="newPassword"
              name="newPassword"
              required
            />
          </div>

          <button type="submit" class="btn btn--primary auth-submit" [disabled]="!token || !newPassword">
            UPDATE CREDENTIALS
          </button>
        </form>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; text-align: center;">
          <a routerLink="/login" class="text-caption text-secondary">← RETURN TO OPERATOR LOGIN</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
      background: var(--black);
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      background: var(--surface);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }
    .auth-card__header {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .auth-card__brand {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .auth-card__badge {
      font-family: var(--font-data);
      font-size: 14px;
      font-weight: 700;
      background: var(--text-display);
      color: var(--black);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .auth-submit {
      width: 100%;
    }
  `]
})
export class ResetPasswordComponent {
  private notifications = inject(NotificationService);
  private router = inject(Router);

  token = '';
  newPassword = '';

  resetPassword(): void {
    if (!this.token || !this.newPassword) return;
    this.notifications.success('[AUTHENTICATED] System password updated. Please log in.');
    this.router.navigate(['/login']);
  }
}
