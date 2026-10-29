import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';

interface PermissionRule {
  resource: string;
  category: string;
  admin: boolean;
  inventory_manager: boolean;
  buyer: boolean;
  store_clerk: boolean;
  viewer: boolean;
}

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  template: `
    <div class="page">
      <app-breadcrumbs
        [items]="[
          { label: 'ADMINISTRATION', url: '/admin/users' },
          { label: 'ROLES & PERMISSIONS MATRIX' }
        ]"
      />

      <div class="page__header">
        <div>
          <span class="text-label text-secondary">SECURITY & ACCESS CONTROL</span>
          <h1 class="text-display">ROLE PERMISSION MATRIX</h1>
        </div>
        <div class="header-actions">
          <button class="btn btn--outline" (click)="resetDefaults()">RESET TO DEFAULTS</button>
          <button class="btn btn--primary" (click)="savePolicy()">SAVE ACCESS POLICY</button>
        </div>
      </div>

      <!-- Role Overview Cards -->
      <div class="roles-grid">
        <div class="role-card">
          <div class="role-card__header">
            <span class="badge badge--danger">ADMIN</span>
            <span class="text-caption text-secondary">3 USERS</span>
          </div>
          <span class="text-body font-bold">System Administrator</span>
          <p class="text-caption text-secondary">
            Unrestricted access to tenant settings, audit logs, user provisioning, and financial valuation.
          </p>
        </div>

        <div class="role-card">
          <div class="role-card__header">
            <span class="badge badge--warning">MANAGER</span>
            <span class="text-caption text-secondary">8 USERS</span>
          </div>
          <span class="text-body font-bold">Inventory Manager</span>
          <p class="text-caption text-secondary">
            Approval authority for stock adjustments, inter-hub transfers, cycle count reconciliation, and PO releases.
          </p>
        </div>

        <div class="role-card">
          <div class="role-card__header">
            <span class="badge badge--info">BUYER</span>
            <span class="text-caption text-secondary">5 USERS</span>
          </div>
          <span class="text-body font-bold">Procurement Specialist</span>
          <p class="text-caption text-secondary">
            Supplier negotiations, PO generation, replenishment rule configuration, and vendor return claims.
          </p>
        </div>

        <div class="role-card">
          <div class="role-card__header">
            <span class="badge badge--transit">CLERK</span>
            <span class="text-caption text-secondary">24 USERS</span>
          </div>
          <span class="text-body font-bold">Store & Dock Clerk</span>
          <p class="text-caption text-secondary">
            Strictly scoped to assigned facilities. Barcode wedge scan, pick-pack-ship fulfilment, and blind cycle counting.
          </p>
        </div>

        <div class="role-card">
          <div class="role-card__header">
            <span class="badge badge--neutral">VIEWER</span>
            <span class="text-caption text-secondary">12 USERS</span>
          </div>
          <span class="text-body font-bold">Read-Only Stakeholder</span>
          <p class="text-caption text-secondary">
            Read-only access across inventory stock matrix, catalog master, and executive dashboard reports.
          </p>
        </div>
      </div>

      <!-- Matrix Table -->
      <div class="matrix-card">
        <div class="matrix-header">
          <span class="text-label text-display">POLICY GRIDS & RESOURCE CLEARANCE</span>
          <span class="text-caption text-secondary">Toggle individual permissions or apply role baselines</span>
        </div>

        <div class="matrix-wrapper">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="th-resource">RESOURCE / CAPABILITY</th>
                <th class="th-role">ADMIN</th>
                <th class="th-role">MANAGER</th>
                <th class="th-role">BUYER</th>
                <th class="th-role">CLERK</th>
                <th class="th-role">VIEWER</th>
              </tr>
            </thead>
            <tbody>
              @for (rule of permissions(); track rule.resource) {
                <tr>
                  <td class="td-resource">
                    <span class="text-label font-bold text-display">{{ rule.resource }}</span>
                    <span class="text-caption text-secondary">{{ rule.category }}</span>
                  </td>
                  <td class="td-role">
                    <input type="checkbox" [(ngModel)]="rule.admin" [disabled]="true" class="matrix-checkbox" />
                  </td>
                  <td class="td-role">
                    <input type="checkbox" [(ngModel)]="rule.inventory_manager" class="matrix-checkbox" />
                  </td>
                  <td class="td-role">
                    <input type="checkbox" [(ngModel)]="rule.buyer" class="matrix-checkbox" />
                  </td>
                  <td class="td-role">
                    <input type="checkbox" [(ngModel)]="rule.store_clerk" class="matrix-checkbox" />
                  </td>
                  <td class="td-role">
                    <input type="checkbox" [(ngModel)]="rule.viewer" class="matrix-checkbox" />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }
    .page__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header-actions {
      display: flex;
      gap: var(--space-sm);
    }
    .roles-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--space-md);
    }
    .role-card {
      background: var(--surface);
      border: 1px solid var(--border-visible);
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .role-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xs);
    }
    .matrix-card {
      background: var(--surface);
      border: 1px solid var(--border-visible);
      display: flex;
      flex-direction: column;
    }
    .matrix-header {
      padding: var(--space-md);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .matrix-wrapper {
      overflow-x: auto;
    }
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--font-body);
    }
    .matrix-table th {
      padding: var(--space-sm) var(--space-md);
      background: var(--surface-raised);
      border-bottom: 1px solid var(--border-visible);
      font-family: var(--font-data);
      font-size: 11px;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      text-align: center;
    }
    .matrix-table th.th-resource {
      text-align: left;
    }
    .matrix-table td {
      padding: var(--space-sm) var(--space-md);
      border-bottom: 1px solid var(--border);
    }
    .td-resource {
      display: flex;
      flex-direction: column;
    }
    .td-role {
      text-align: center;
    }
    .matrix-checkbox {
      width: 18px;
      height: 18px;
      accent-color: var(--text-display);
      cursor: pointer;
    }
    @media (max-width: 1200px) {
      .roles-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 768px) {
      .roles-grid { grid-template-columns: 1fr; }
      .page__header { flex-direction: column; align-items: flex-start; gap: var(--space-md); }
    }
  `]
})
export class AdminRolesComponent {
  readonly permissions = signal<PermissionRule[]>([
    { resource: 'Catalog: Create & Edit SKUs', category: 'Master Data', admin: true, inventory_manager: true, buyer: false, store_clerk: false, viewer: false },
    { resource: 'Catalog: Category Reordering', category: 'Master Data', admin: true, inventory_manager: true, buyer: false, store_clerk: false, viewer: false },
    { resource: 'Inventory: Stock Matrix View', category: 'Warehouse Ops', admin: true, inventory_manager: true, buyer: true, store_clerk: true, viewer: true },
    { resource: 'Inventory: Discrepancy Adjustments', category: 'Warehouse Ops', admin: true, inventory_manager: true, buyer: false, store_clerk: false, viewer: false },
    { resource: 'Inventory: Inter-Hub Transfer Dispatch', category: 'Logistics', admin: true, inventory_manager: true, buyer: false, store_clerk: true, viewer: false },
    { resource: 'Inventory: Transfer Approval', category: 'Logistics', admin: true, inventory_manager: true, buyer: false, store_clerk: false, viewer: false },
    { resource: 'Inventory: Cycle Count Execution', category: 'Auditing', admin: true, inventory_manager: true, buyer: false, store_clerk: true, viewer: false },
    { resource: 'Procurement: Requisition Generation', category: 'Purchasing', admin: true, inventory_manager: true, buyer: true, store_clerk: false, viewer: false },
    { resource: 'Procurement: Goods Receipt Check-in', category: 'Inbound Dock', admin: true, inventory_manager: true, buyer: false, store_clerk: true, viewer: false },
    { resource: 'Orders: Pick-Pack-Ship Fulfilment', category: 'Outbound Dock', admin: true, inventory_manager: true, buyer: false, store_clerk: true, viewer: false },
    { resource: 'Orders: POS Cashier Register', category: 'Retail Storefront', admin: true, inventory_manager: true, buyer: false, store_clerk: true, viewer: false },
    { resource: 'Reports: Valuation & Lost Revenue Risk', category: 'Financials', admin: true, inventory_manager: true, buyer: true, store_clerk: false, viewer: false },
    { resource: 'Admin: User Provisioning & Password Reset', category: 'System Governance', admin: true, inventory_manager: false, buyer: false, store_clerk: false, viewer: false },
    { resource: 'Admin: Audit Log State Inspection', category: 'System Governance', admin: true, inventory_manager: false, buyer: false, store_clerk: false, viewer: false }
  ]);

  savePolicy(): void {
    alert('Security Access Policy updated across all active tenant nodes.');
  }

  resetDefaults(): void {
    this.permissions.update(list => list.map(r => ({ ...r })));
  }
}
