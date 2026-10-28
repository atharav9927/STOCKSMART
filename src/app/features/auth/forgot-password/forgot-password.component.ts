import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
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
          <span class="text-caption text-muted">SECURITY & CREDENTIAL RECOVERY</span>
        </div>

        @if (!submitted()) {
          <form (ngSubmit)="sendReset()" class="auth-form">
            <div class="form-field">
              <label class="form-field__label">OPERATOR EMAIL</label>
              <input
                type="email"
                class="form-field__input form-field__input--boxed"
                placeholder="e.g. admin@stocksmart.io"
                [(ngModel)]="email"
                name="email"
                required
              />
            </div>
            <button type="submit" class="btn btn--primary auth-submit" [disabled]="!email">
              DISPATCH RECOVERY CODE
            </button>
          </form>
        } @else {
          <div class="recovery-confirmed">
            <span class="text-label text-success">[DISPATCHED]</span>
            <p class="text-body-sm" style="margin: 8px 0;">
              A cryptographic reset token has been dispatched to <strong>{{ email }}</strong>.
            </p>
            <a routerLink="/reset-password" class="btn btn--primary btn--sm" style="margin-top: 12px;">
              PROCEED TO ENTER TOKEN →
            </a>
          </div>
        }

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
export class ForgotPasswordComponent {
  private notifications = inject(NotificationService);

  email = '';
  submitted = signal(false);

  sendReset(): void {
    if (!this.email) return;
    this.submitted.set(true);
    this.notifications.success('[CODE SENT] Recovery instructions dispatched.');
  }
}
