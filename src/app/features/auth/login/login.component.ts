import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormFieldComponent } from '../../../shared/form-kit/form-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormFieldComponent, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-top-bar">
          <a routerLink="/" class="login-back text-mono text-caption">
            ← [ RETURN TO PRODUCT OVERVIEW ]
          </a>
          <span class="login-status text-mono text-caption text-muted">
            SYS::READY // PORT 4200
          </span>
        </div>

        <div class="login-card">
          <div class="login-card__header">
            <div class="login-card__brand">
              <span class="login-card__badge">SS</span>
              <span class="text-heading">STOCKSMART</span>
              <span class="brand-version text-mono">v1.0</span>
            </div>
            <span class="text-caption text-muted">RETAIL INVENTORY OPTIMIZATION SYSTEM // OPERATOR CLEARANCE</span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <app-form-field label="OPERATOR EMAIL" [control]="loginForm.get('email')">
              <input
                type="email"
                formControlName="email"
                class="form-field__input form-field__input--boxed"
                placeholder="e.g. admin@stocksmart.io"
                autocomplete="username"
              />
            </app-form-field>

            <div class="password-field-wrap">
              <app-form-field label="SYSTEM PASSWORD" [control]="loginForm.get('password')">
                <input
                  type="password"
                  formControlName="password"
                  class="form-field__input form-field__input--boxed"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
              </app-form-field>
              <div class="forgot-wrap">
                <a routerLink="/forgot-password" class="text-caption text-secondary text-mono">
                  [ RECOVER CREDENTIALS ]
                </a>
              </div>
            </div>

            @if (errorMessage()) {
              <div class="login-error text-caption text-error" role="alert">
                [AUTH ERROR] {{ errorMessage() }}
              </div>
            }

            <button
              type="submit"
              class="btn btn--primary login-submit"
              [disabled]="loading()"
            >
              {{ loading() ? '[AUTHENTICATING...]' : 'INITIALIZE SESSION →' }}
            </button>
          </form>

          <!-- Quick Role Switcher for Development / Demo / Evaluation -->
          <div class="login-quick">
            <div class="login-quick__title">
              <span class="text-label text-disabled">ONE-CLICK ROLE DEMO CLEARANCE</span>
              <span class="text-caption text-muted text-mono">PASSWORD: password</span>
            </div>
            <div class="login-quick__buttons">
              <button
                type="button"
                class="btn btn--secondary btn--sm"
                (click)="selectProfile('admin@stocksmart.io')"
              >
                [ ADMIN ]
              </button>
              <button
                type="button"
                class="btn btn--secondary btn--sm"
                (click)="selectProfile('manager@stocksmart.io')"
              >
                [ MANAGER ]
              </button>
              <button
                type="button"
                class="btn btn--secondary btn--sm"
                (click)="selectProfile('buyer@stocksmart.io')"
              >
                [ BUYER ]
              </button>
              <button
                type="button"
                class="btn btn--secondary btn--sm"
                (click)="selectProfile('clerk@stocksmart.io')"
              >
                [ CLERK ]
              </button>
              <button
                type="button"
                class="btn btn--secondary btn--sm"
                (click)="selectProfile('viewer@stocksmart.io')"
              >
                [ VIEWER ]
              </button>
            </div>
          </div>
        </div>

        <div class="login-footer text-caption text-muted text-mono">
          <span>HIGH-CONTRAST OLED THEME // NOTHING OS INDUSTRIAL DESIGN</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl) var(--space-md);
      background: var(--black);
    }
    .login-container {
      width: 100%;
      max-width: 460px;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .login-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .login-back {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);
      &:hover {
        color: var(--text-display);
      }
    }
    .login-card {
      background: var(--surface);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }
    .login-card__header {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .login-card__brand {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .login-card__badge {
      font-family: var(--font-data);
      font-size: 14px;
      font-weight: 700;
      background: var(--text-display);
      color: var(--black);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
    }
    .brand-version {
      font-size: 11px;
      color: var(--text-secondary);
      border: 1px solid var(--border);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .password-field-wrap {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xs);
    }
    .forgot-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
      a {
        text-decoration: none;
        &:hover {
          color: var(--text-display);
          text-decoration: underline;
        }
      }
    }
    .login-submit {
      width: 100%;
      margin-top: var(--space-xs);
    }
    .login-error {
      padding: var(--space-xs) 0;
      font-family: var(--font-data);
    }
    .login-quick {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);
    }
    .login-quick__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .login-quick__buttons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }
    .login-footer {
      text-align: center;
      opacity: 0.6;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['admin@stocksmart.io', [Validators.required, Validators.email]],
    password: ['password', [Validators.required]]
  });

  selectProfile(email: string): void {
    this.loginForm.patchValue({
      email,
      password: 'password'
    });
    this.onSubmit();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const { email, password } = this.loginForm.value;
      await this.auth.login({ email: email!, password: password! });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Authentication rejected');
    } finally {
      this.loading.set(false);
    }
  }
}
