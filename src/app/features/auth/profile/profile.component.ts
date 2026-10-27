import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ROLE_LABELS } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">OPERATOR PROFILE</h1>
          <p class="page__subtitle">SYSTEM CREDENTIALS & WORKSTATION CONFIGURATION</p>
        </div>
      </div>

      <div class="profile-grid">
        <div class="card">
          <span class="text-label text-muted">AUTHENTICATED IDENTITY</span>
          <div class="profile-info">
            <div class="profile-avatar text-display-md">
              {{ auth.userInitials() }}
            </div>
            <div>
              <h2 class="text-heading">{{ auth.userName() }}</h2>
              <span class="text-data text-caption text-secondary">{{ user()?.email }}</span>
            </div>
          </div>

          <div class="profile-details">
            <div class="profile-row">
              <span class="text-label">ROLE CLASSIFICATION</span>
              <span class="chip chip--active">{{ roleLabel }}</span>
            </div>
            <div class="profile-row">
              <span class="text-label">OPERATOR ID</span>
              <span class="text-data">{{ user()?.id }}</span>
            </div>
            <div class="profile-row">
              <span class="text-label">LAST ACTIVE SESSION</span>
              <span class="text-data">{{ user()?.lastLogin | date:'yyyy-MM-dd HH:mm:ss' }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <span class="text-label text-muted">INTERFACE PREFERENCES</span>
          <div class="profile-preferences">
            <div class="profile-row">
              <div>
                <span class="text-body-sm font-medium">Visual Mode</span>
                <p class="text-caption text-disabled">High-contrast OLED Dark or Technical Light</p>
              </div>
              <button class="btn btn--secondary btn--sm" (click)="themeService.toggle()">
                {{ themeService.isDark() ? 'CURRENT: DARK' : 'CURRENT: LIGHT' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: var(--space-lg);
    }
    .profile-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin: var(--space-md) 0;
    }
    .profile-avatar {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-pill);
      background: var(--surface-raised);
      border: 1px solid var(--border-visible);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .profile-details, .profile-preferences {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);
    }
    .profile-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `]
})
export class ProfileComponent {
  auth = inject(AuthService);
  themeService = inject(ThemeService);

  user = this.auth.currentUser;

  get roleLabel(): string {
    const r = this.auth.userRole();
    return r ? ROLE_LABELS[r] : '';
  }
}
