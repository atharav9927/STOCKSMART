import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';

interface CsvRow {
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  unitPrice: number;
  reorderPoint: number;
  isValid: boolean;
  errors: string[];
}

@Component({
  selector: 'app-catalog-import',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">CSV CATALOG IMPORT & RECONCILIATION</h1>
          <p class="page__subtitle">BATCH INGESTION WITH SCHEMA VALIDATION & INTEGRITY CHECKS</p>
        </div>
        <a routerLink="/catalog/products" class="btn btn--secondary btn--sm">← CATALOG</a>
      </div>

      <!-- Step 1: File Ingestion Area -->
      <div class="card import-dropzone" (click)="loadSampleCsv()">
        <span class="text-display-md text-interactive">⇪</span>
        <h2 class="text-subheading">CLICK TO LOAD SAMPLE CSV OR DROP FILE</h2>
        <p class="text-caption text-disabled">Supported schema: SKU, Product Name, Category, Unit Cost, Retail Price, Reorder Point</p>
      </div>

      @if (rows().length > 0) {
        <!-- Step 2: Validation Summary Strip -->
        <div class="grid grid--3" style="margin-top: 24px;">
          <div class="card card--compact">
            <span class="text-label text-muted">TOTAL DETECTED ROWS</span>
            <span class="text-display-md text-data">{{ rows().length }}</span>
          </div>
          <div class="card card--compact">
            <span class="text-label text-muted">VALID FOR INGESTION</span>
            <span class="text-display-md text-data text-success">{{ validCount() }}</span>
          </div>
          <div class="card card--compact">
            <span class="text-label text-muted">SCHEMA VIOLATIONS</span>
            <span class="text-display-md text-data" [class.text-error]="errorCount() > 0">{{ errorCount() }}</span>
          </div>
        </div>

        <!-- Step 3: Data Validation Preview Table -->
        <div class="card" style="margin-top: 24px;">
          <div class="layout-between" style="margin-bottom: 16px;">
            <span class="text-label text-muted">PARSED ROWS VALIDATION AUDIT</span>
            <button
              class="btn btn--primary btn--sm"
              [disabled]="validCount() === 0"
              (click)="executeImport()"
            >
              [ COMMIT {{ validCount() }} VALID SKUS ]
            </button>
          </div>

          <table class="dt__table">
            <thead>
              <tr>
                <th class="dt__th">VALIDATION</th>
                <th class="dt__th">SKU</th>
                <th class="dt__th">NAME</th>
                <th class="dt__th">CATEGORY</th>
                <th class="dt__th" style="text-align: right;">UNIT COST</th>
                <th class="dt__th" style="text-align: right;">UNIT PRICE</th>
                <th class="dt__th">STATUS / ERRORS</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows(); track row.sku) {
                <tr class="dt__row">
                  <td class="dt__td">
                    <span class="chip" [class.chip--success]="row.isValid" [class.chip--error]="!row.isValid">
                      {{ row.isValid ? '● PASS' : '✕ FAIL' }}
                    </span>
                  </td>
                  <td class="dt__td text-data">{{ row.sku }}</td>
                  <td class="dt__td">{{ row.name }}</td>
                  <td class="dt__td">{{ row.category }}</td>
                  <td class="dt__td text-data" style="text-align: right;">\${{ row.unitCost }}</td>
                  <td class="dt__td text-data" style="text-align: right;">\${{ row.unitPrice }}</td>
                  <td class="dt__td text-caption">
                    @if (row.isValid) {
                      <span class="text-success">[READY FOR COMMIT]</span>
                    } @else {
                      <span class="text-error">{{ row.errors.join(', ') }}</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .import-dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl) var(--space-xl);
      border: 2px dashed var(--border-visible);
      border-radius: var(--radius-lg);
      cursor: pointer;
      gap: var(--space-sm);
      text-align: center;
      transition: border-color var(--duration-micro) var(--ease-out);
    }
    .import-dropzone:hover {
      border-color: var(--text-primary);
      background: var(--surface-raised);
    }
  `]
})
export class CatalogImportComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);
  private router = inject(Router);

  rows = signal<CsvRow[]>([]);

  validCount = computed(() => this.rows().filter(r => r.isValid).length);
  errorCount = computed(() => this.rows().filter(r => !r.isValid).length);

  loadSampleCsv(): void {
    const sample: CsvRow[] = [
      { sku: 'SKU-9011', name: 'Nothing Ear (open) White', category: 'Wireless Headphones', unitCost: 89, unitPrice: 149, reorderPoint: 25, isValid: true, errors: [] },
      { sku: 'SKU-9012', name: 'Teenage Engineering EP-133 K.O. II', category: 'Audio Gear', unitCost: 199, unitPrice: 299, reorderPoint: 15, isValid: true, errors: [] },
      { sku: 'SKU-9013', name: 'Braun BC02 Classic Alarm Clock', category: 'Home IoT', unitCost: 18, unitPrice: 35, reorderPoint: 40, isValid: true, errors: [] },
      { sku: 'SKU-INVALID', name: '', category: 'General', unitCost: -10, unitPrice: 0, reorderPoint: 0, isValid: false, errors: ['Missing designation', 'Negative unit cost'] }
    ];
    this.rows.set(sample);
    this.notifications.show('[PARSED] 4 CSV records evaluated against catalog schema', 'info');
  }

  executeImport(): void {
    const valid = this.rows().filter(r => r.isValid);
    valid.forEach(r => {
      this.mockData.addProduct({
        sku: r.sku,
        name: r.name,
        unitCost: r.unitCost,
        unitPrice: r.unitPrice,
        reorderPoint: r.reorderPoint
      });
    });
    this.notifications.success(`[COMMITTED] Successfully ingested ${valid.length} SKUs into catalog.`);
    this.router.navigate(['/catalog/products']);
  }
}
