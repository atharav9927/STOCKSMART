import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { MockDataService } from '../core/services/mock-data.service';
import { InlineNotificationComponent } from '../shared/components/inline-notification/inline-notification.component';
import { BreadcrumbsComponent } from '../shared/components/breadcrumbs/breadcrumbs.component';
import { HasRoleDirective } from '../core/directives/has-role.directive';
import { UserRole, ROLE_LABELS, Breadcrumb } from '../core/models';

interface NavItem {
  label: string;
  icon?: string;
  route: string;
  roles?: UserRole[];
  children?: NavItem[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InlineNotificationComponent,
    BreadcrumbsComponent,
    HasRoleDirective
  ],
  template: `
    <!-- Top Bar -->
    <header class="topbar">
      <div class="topbar__left">
        <button
          class="topbar__toggle btn btn--ghost"
          (click)="sidebarOpen.set(!sidebarOpen())"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <a class="topbar__brand" routerLink="/dashboard">
          <span class="topbar__logo">SS</span>
          <span class="topbar__name text-subheading">STOCKSMART</span>
        </a>

        <!-- Location Switcher -->
        <div class="topbar__location-switcher">
          <span class="topbar__location-icon text-caption" aria-hidden="true">⌖</span>
          <select
            class="topbar__location-select form-field__input"
            [ngModel]="mockData.selectedLocationId()"
            (ngModelChange)="onLocationChange($event)"
            aria-label="Select active location scope"
          >
            <option value="all">ALL LOCATIONS (ENTERPRISE)</option>
            @for (loc of accessibleLocations(); track loc.id) {
              <option [value]="loc.id">{{ loc.code }} — {{ loc.name }}</option>
            }
          </select>
        </div>
      </div>

      <div class="topbar__center">
        <div class="topbar__search">
          <span class="topbar__search-icon text-caption" aria-hidden="true">⊞</span>
          <input
            class="topbar__search-input form-field__input"
            type="text"
            placeholder="SCAN BARCODE OR SEARCH SKU / ORDER..."
            [(ngModel)]="globalSearch"
            (keydown.enter)="onGlobalSearch()"
            aria-label="Global search or scan"
          />
        </div>
      </div>

      <div class="topbar__right">
        <!-- Theme Toggle -->
        <button
          class="topbar__action btn btn--ghost"
          (click)="themeService.toggle()"
          [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          title="Toggle Theme"
        >
          {{ themeService.isDark() ? '☼ LIGHT' : '☽ DARK' }}
        </button>

        <!-- Notification Bell -->
        <button
          class="topbar__action btn btn--ghost topbar__bell"
          aria-label="Notifications"
          routerLink="/alerts"
        >
          ◎
          @if (unreadAlerts() > 0) {
            <span class="topbar__badge text-label" [attr.aria-label]="unreadAlerts() + ' unread alerts'">
              {{ unreadAlerts() }}
            </span>
          }
        </button>

        <!-- User Menu -->
        <div class="topbar__user">
          <button
            class="topbar__avatar"
            (click)="userMenuOpen.set(!userMenuOpen())"
            [attr.aria-expanded]="userMenuOpen()"
            aria-haspopup="true"
          >
            <span class="topbar__initials text-label">{{ auth.userInitials() }}</span>
          </button>

          @if (userMenuOpen()) {
            <div class="topbar__backdrop" (click)="userMenuOpen.set(false)"></div>
            <div class="topbar__dropdown" role="menu">
              <div class="topbar__dropdown-header">
                <span class="text-body-sm font-medium">{{ auth.userName() }}</span>
                <span class="text-caption text-muted">{{ roleLabel() }}</span>
              </div>
              <hr class="divider" />
              <a class="topbar__dropdown-item text-caption" routerLink="/profile" role="menuitem" (click)="userMenuOpen.set(false)">
                [ PROFILE & SETTINGS ]
              </a>
              <button class="topbar__dropdown-item text-caption text-error" role="menuitem" (click)="logout()">
                [ SIGN OUT ]
              </button>
            </div>
          }
        </div>
      </div>
    </header>

    <!-- Sidebar Navigation -->
    <aside
      class="sidebar"
      [class.sidebar--open]="sidebarOpen()"
      [class.sidebar--collapsed]="!sidebarOpen()"
      role="navigation"
      aria-label="Main navigation"
    >
      <nav class="sidebar__nav">
        @for (item of filteredNav(); track item.route) {
          @if (!item.children) {
            <a
              class="sidebar__link"
              [routerLink]="item.route"
              routerLinkActive="sidebar__link--active"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              [title]="item.label"
            >
              <span class="sidebar__icon" aria-hidden="true">{{ item.icon }}</span>
              @if (sidebarOpen()) {
                <span class="sidebar__label text-caption">{{ item.label }}</span>
              }
            </a>
          } @else {
            <div class="sidebar__group">
              <button
                class="sidebar__link sidebar__link--group"
                (click)="toggleGroup(item.route)"
                [attr.aria-expanded]="isGroupOpen(item.route)"
              >
                <span class="sidebar__icon" aria-hidden="true">{{ item.icon }}</span>
                @if (sidebarOpen()) {
                  <span class="sidebar__label text-caption">{{ item.label }}</span>
                  <span class="sidebar__chevron text-caption" aria-hidden="true">{{ isGroupOpen(item.route) ? '−' : '+' }}</span>
                }
              </button>
              @if (isGroupOpen(item.route) && sidebarOpen()) {
                <div class="sidebar__children">
                  @for (child of item.children; track child.route) {
                    <a
                      class="sidebar__link sidebar__link--child"
                      [routerLink]="child.route"
                      routerLinkActive="sidebar__link--active"
                    >
                      <span class="sidebar__label text-caption">{{ child.label }}</span>
                    </a>
                  }
                </div>
              }
            </div>
          }
        }
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="main" [class.main--sidebar-open]="sidebarOpen()">
      <div class="main__header-bar">
        <app-breadcrumbs [items]="breadcrumbs()" />
      </div>
      <div class="main__content">
        <router-outlet />
      </div>
    </main>

    <!-- Real-time Status Notification Feed -->
    <app-inline-notification />
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--black);
      color: var(--text-primary);
    }

    /* === Top Bar === */
    .topbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--topbar-height);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-md);
      z-index: var(--z-sticky);
    }

    .topbar__left {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .topbar__toggle {
      font-size: 16px;
      padding: var(--space-xs) var(--space-sm);
      color: var(--text-secondary);
      min-height: 36px;
    }

    .topbar__brand {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      text-decoration: none;
    }

    .topbar__logo {
      font-family: var(--font-data);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.1em;
      background: var(--text-display);
      color: var(--black);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
    }

    .topbar__name {
      color: var(--text-display);
      font-family: var(--font-data);
      font-size: 13px;
      letter-spacing: 0.12em;
    }

    .topbar__location-switcher {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      background: var(--surface-raised);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-pill);
      padding: 2px 10px;
    }

    .topbar__location-icon {
      color: var(--text-secondary);
    }

    .topbar__location-select {
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-family: var(--font-data);
      font-size: 11px;
      letter-spacing: 0.06em;
      outline: none;
      cursor: pointer;
      padding: 4px 0;
    }

    .topbar__center {
      flex: 1;
      max-width: 480px;
      padding: 0 var(--space-md);
    }

    .topbar__search {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      background: var(--surface-raised);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-pill);
      padding: 0 var(--space-md);
    }

    .topbar__search-icon {
      color: var(--text-secondary);
    }

    .topbar__search-input {
      width: 100%;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-family: var(--font-data);
      font-size: 12px;
      letter-spacing: 0.04em;
      padding: 6px 0;
      outline: none;
    }

    .topbar__right {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .topbar__action {
      font-family: var(--font-data);
      font-size: 11px;
      letter-spacing: 0.06em;
      padding: 6px 12px;
      min-height: 36px;
      color: var(--text-secondary);
    }

    .topbar__bell {
      position: relative;
      font-size: 16px;
    }

    .topbar__badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: var(--accent);
      color: var(--text-display);
      font-size: 9px;
      min-width: 15px;
      height: 15px;
      border-radius: var(--radius-pill);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 3px;
    }

    .topbar__user {
      position: relative;
    }

    .topbar__avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-pill);
      background: var(--surface-raised);
      border: 1px solid var(--border-visible);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .topbar__initials {
      color: var(--text-display);
      font-size: 11px;
      font-weight: 700;
    }

    .topbar__backdrop {
      position: fixed;
      inset: 0;
      z-index: var(--z-dropdown);
    }

    .topbar__dropdown {
      position: absolute;
      top: calc(100% + var(--space-xs));
      right: 0;
      background: var(--surface-raised);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-md);
      min-width: 220px;
      z-index: calc(var(--z-dropdown) + 1);
      overflow: hidden;
    }

    .topbar__dropdown-header {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-2xs);
    }

    .topbar__dropdown-item {
      display: block;
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      background: none;
      border: none;
      text-align: left;
      color: var(--text-primary);
      cursor: pointer;
      text-decoration: none;
      font-family: var(--font-data);
      font-size: var(--caption);
      letter-spacing: var(--ls-label);
      text-transform: uppercase;
    }

    .topbar__dropdown-item:hover {
      background: var(--surface);
    }

    /* === Sidebar === */
    .sidebar {
      position: fixed;
      top: var(--topbar-height);
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--surface);
      border-right: 1px solid var(--border);
      overflow-y: auto;
      z-index: var(--z-sticky);
      transition: width var(--duration-normal) var(--ease-out);
    }

    .sidebar--collapsed {
      width: var(--sidebar-collapsed);
    }

    .sidebar__nav {
      padding: var(--space-sm) 0;
    }

    .sidebar__link {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      color: var(--text-secondary);
      text-decoration: none;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      min-height: 40px;
      transition: color var(--duration-micro) var(--ease-out);
    }

    .sidebar__link:hover {
      color: var(--text-primary);
    }

    .sidebar__link--active {
      color: var(--text-display);
      border-left: 2px solid var(--accent);
      background: var(--surface-raised);
    }

    .sidebar__link--group {
      font-family: var(--font-data);
    }

    .sidebar__link--child {
      padding-left: calc(var(--space-md) + 24px);
    }

    .sidebar__icon {
      width: 20px;
      text-align: center;
      flex-shrink: 0;
      font-size: 14px;
    }

    .sidebar__label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sidebar__chevron {
      font-size: var(--caption);
      color: var(--text-disabled);
    }

    .sidebar__children {
      display: flex;
      flex-direction: column;
    }

    .sidebar__group {
      display: flex;
      flex-direction: column;
    }

    /* === Main Content === */
    .main {
      margin-top: var(--topbar-height);
      margin-left: var(--sidebar-collapsed);
      min-height: calc(100vh - var(--topbar-height));
      transition: margin-left var(--duration-normal) var(--ease-out);
      display: flex;
      flex-direction: column;
    }

    .main--sidebar-open {
      margin-left: var(--sidebar-width);
    }

    .main__header-bar {
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--border);
      background: var(--black);
    }

    .main__content {
      padding: var(--space-lg);
      flex: 1;
    }

    @media (max-width: 1024px) {
      .topbar__center {
        display: none;
      }
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar--open {
        transform: translateX(0);
        width: var(--sidebar-width);
      }
      .main {
        margin-left: 0;
      }
      .main--sidebar-open {
        margin-left: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .sidebar,
      .main {
        transition: none;
      }
    }
  `]
})
export class AppShellComponent {
  auth = inject(AuthService);
  themeService = inject(ThemeService);
  mockData = inject(MockDataService);
  private router = inject(Router);

  sidebarOpen = signal(true);
  userMenuOpen = signal(false);
  globalSearch = '';

  unreadAlerts = computed(() => {
    return this.mockData.alerts().filter(a => !a.isRead).length;
  });

  breadcrumbs = signal<Breadcrumb[]>([
    { label: 'STOCKSMART', url: '/dashboard' },
    { label: 'OPERATIONS' }
  ]);

  private openGroups = signal<Set<string>>(new Set(['/catalog', '/inventory']));

  private readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: '◈', route: '/dashboard' },
    {
      label: 'Catalog', icon: '▤', route: '/catalog',
      children: [
        { label: 'Products', route: '/catalog/products' },
        { label: 'Categories', route: '/catalog/categories' },
        { label: 'Brands', route: '/catalog/brands' },
      ],
    },
    {
      label: 'Inventory', icon: '▦', route: '/inventory',
      roles: ['admin', 'inventory_manager', 'store_clerk'],
      children: [
        { label: 'Stock Matrix', route: '/inventory/stock' },
        { label: 'Locations', route: '/inventory/locations' },
        { label: 'Movements', route: '/inventory/movements' },
        { label: 'Adjustments', route: '/inventory/adjustments' },
        { label: 'Transfers', route: '/inventory/transfers' },
        { label: 'Counts', route: '/inventory/counts' },
      ],
    },
    {
      label: 'Procurement', icon: '⬡', route: '/procurement',
      roles: ['admin', 'inventory_manager', 'buyer'],
      children: [
        { label: 'Purchase Orders', route: '/procurement/orders' },
        { label: 'Suggestions', route: '/procurement/suggestions' },
      ],
    },
    {
      label: 'Suppliers', icon: '◇', route: '/suppliers',
      roles: ['admin', 'inventory_manager', 'buyer'],
    },
    {
      label: 'Orders', icon: '⬜', route: '/orders',
      roles: ['admin', 'inventory_manager', 'store_clerk'],
    },
    { label: 'Scan Lookup', icon: '⊞', route: '/scan' },
    { label: 'Barcodes & RFID', icon: '⦀', route: '/identification/barcodes' },
    {
      label: 'Reports', icon: '▨', route: '/reports',
      roles: ['admin', 'inventory_manager', 'buyer'],
      children: [
        { label: 'Executive KPIs', route: '/reports/kpis' },
        { label: 'Stock Valuation', route: '/reports/valuation' },
        { label: 'Stockouts & Depletion', route: '/reports/stockouts' },
      ],
    },
    { label: 'Alerts', icon: '◎', route: '/alerts' },
    {
      label: 'Admin', icon: '⚙', route: '/admin',
      roles: ['admin'],
      children: [
        { label: 'Users', route: '/admin/users' },
        { label: 'Audit Log', route: '/admin/audit' },
        { label: 'Reason Codes', route: '/admin/reason-codes' },
      ],
    },
  ];

  accessibleLocations = computed(() => {
    const all = this.mockData.locations();
    const user = this.auth.currentUser();
    if (!user || user.role === 'admin' || user.role === 'inventory_manager') {
      return all;
    }
    return all.filter(l => user.assignedLocationIds.includes(l.id));
  });

  filteredNav = computed(() => {
    return this.navItems
      .filter(item => !item.roles || this.auth.hasRole(...item.roles))
      .map(item => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(child => !child.roles || this.auth.hasRole(...child.roles)),
          };
        }
        return item;
      });
  });

  roleLabel = computed(() => {
    const role = this.auth.userRole();
    return role ? ROLE_LABELS[role] : '';
  });

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  isGroupOpen(route: string): boolean {
    return this.openGroups().has(route);
  }

  toggleGroup(route: string): void {
    this.openGroups.update(groups => {
      const newGroups = new Set(groups);
      if (newGroups.has(route)) {
        newGroups.delete(route);
      } else {
        newGroups.add(route);
      }
      return newGroups;
    });
  }

  onLocationChange(id: string): void {
    this.mockData.setSelectedLocation(id);
  }

  onGlobalSearch(): void {
    if (this.globalSearch.trim()) {
      this.router.navigate(['/scan'], { queryParams: { q: this.globalSearch.trim() } });
      this.globalSearch = '';
    }
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.auth.logout();
  }

  private updateBreadcrumbs(): void {
    const url = this.router.url.split('?')[0];
    const parts = url.split('/').filter(p => !!p);
    const crumbs: Breadcrumb[] = [{ label: 'STOCKSMART', url: '/dashboard' }];

    let currentUrl = '';
    for (const part of parts) {
      currentUrl += `/${part}`;
      crumbs.push({
        label: part.replace(/-/g, ' ').toUpperCase(),
        url: currentUrl
      });
    }

    if (crumbs.length > 1) {
      this.breadcrumbs.set(crumbs);
    }
  }
}
