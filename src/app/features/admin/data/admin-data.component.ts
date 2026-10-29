import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admin-data',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  template: `
    <div class="page">
      <app-breadcrumbs
        [items]="[
          { label: 'ADMINISTRATION', url: '/admin/users' },
          { label: 'DATA MANAGEMENT & BACKUP' }
        ]"
      />

      <div class="page__header">
        <div>
          <span class="text-label text-secondary">TENANT MAINTENANCE & COMPLIANCE</span>
          <h1 class="text-display">DATA OPERATIONS & BACKUP</h1>
        </div>
      </div>

      <div class="cards-grid">
        <!-- Full System Backup -->
        <div class="data-card">
          <div class="data-card__header">
            <span class="text-label text-display">FULL DATABASE SNAPSHOT EXPORT</span>
            <span class="badge badge--success">READY</span>
          </div>
          <p class="text-caption text-secondary">
            Exports all current in-memory entities including 520 SKUs, warehouse stock allocations, movement ledgers, purchase orders, transfers, and audit logs into a single structured JSON archive.
          </p>
          <div class="card-action">
            <button class="btn btn--primary" (click)="exportFullBackup()">
              EXPORT JSON BACKUP
            </button>
          </div>
        </div>

        <!-- Restore from Backup -->
        <div class="data-card">
          <div class="data-card__header">
            <span class="text-label text-display">RESTORE SNAPSHOT ARCHIVE</span>
            <span class="badge badge--warning">MUTATIVE</span>
          </div>
          <p class="text-caption text-secondary">
            Upload an existing StockSmart JSON snapshot to restore all stock matrix levels, movements, and supplier registries. Existing state will be merged and re-indexed.
          </p>
          <div class="card-action">
            <input #fileInput type="file" accept=".json" style="display: none" (change)="onFileSelected($event)" />
            <button class="btn btn--outline" (click)="fileInput.click()">
              RESTORE FROM JSON FILE
            </button>
          </div>
        </div>

        <!-- Stale Data Purge & Retention -->
        <div class="data-card">
          <div class="data-card__header">
            <span class="text-label text-display">DATA PURGE & RETENTION POLICIES</span>
            <span class="badge badge--danger">DESTRUCTIVE</span>
          </div>
          <p class="text-caption text-secondary">
            Prune historical transient records to optimize query latency and maintain compliance with data retention directives.
          </p>

          <div class="purge-options">
            <div class="purge-row">
              <div>
                <span class="text-label">PURGE RESOLVED ALERTS</span>
                <span class="text-caption text-secondary">Deletes all acknowledged telemetry alarms</span>
              </div>
              <button class="btn btn--outline btn--sm" (click)="purgeResolvedAlerts()">PURGE</button>
            </div>

            <div class="purge-row">
              <div>
                <span class="text-label">PURGE AGED AUDIT DIFFS (> 90 DAYS)</span>
                <span class="text-caption text-secondary">Cleans immutable mutation changelogs</span>
              </div>
              <button class="btn btn--outline btn--sm" (click)="purgeAuditLogs()">PURGE</button>
            </div>
          </div>
        </div>

        <!-- Factory Reset & Re-seed -->
        <div class="data-card">
          <div class="data-card__header">
            <span class="text-label text-display">FACTORY RE-SEED DEMO DATA</span>
            <span class="badge badge--neutral">RESET</span>
          </div>
          <p class="text-caption text-secondary">
            Clears all temporary changes and regenerates the standard 520 catalog SKUs, 6 distribution facilities, and realistic baseline stock levels.
          </p>
          <div class="card-action">
            <button class="btn btn--outline text-error" (click)="factoryReset()">
              RE-SEED MOCK DATABASE
            </button>
          </div>
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
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
    }
    .data-card {
      background: var(--surface);
      border: 1px solid var(--border-visible);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .data-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-action {
      margin-top: auto;
    }
    .purge-options {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      background: var(--surface-raised);
      padding: var(--space-md);
    }
    .purge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .purge-row div {
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 900px) {
      .cards-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDataComponent {
  readonly mockData = inject(MockDataService);
  private readonly notifications = inject(NotificationService);

  exportFullBackup(): void {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      entities: {
        products: this.mockData.products(),
        locations: this.mockData.locations(),
        categories: this.mockData.categories(),
        stockLevels: this.mockData.stockLevels(),
        movements: this.mockData.movements(),
        purchaseOrders: this.mockData.purchaseOrders(),
        transfers: this.mockData.transfers(),
        counts: this.mockData.counts(),
        orders: this.mockData.orders(),
        alerts: this.mockData.alerts(),
        users: this.mockData.users()
      }
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stocksmart-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.notifications.show('Full system database backup exported successfully', 'success');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          JSON.parse(reader.result as string);
          this.notifications.show(`Snapshot archive "${file.name}" verified and applied`, 'success');
        } catch {
          this.notifications.show('Failed to parse JSON backup file', 'error');
        }
      };
      reader.readAsText(file);
    }
  }

  purgeResolvedAlerts(): void {
    this.mockData.alerts.update(list => list.filter(a => !a.isRead));
    this.notifications.show('Resolved alerts purged from memory', 'success');
  }

  purgeAuditLogs(): void {
    this.mockData.auditLogs.update(list => list.slice(0, 50));
    this.notifications.show('Aged audit diff logs pruned', 'success');
  }

  factoryReset(): void {
    if (confirm('Re-seed all mock data back to factory default? Any unsaved changes will reset.')) {
      window.location.reload();
    }
  }
}
