import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductPickerComponent, LocationPickerComponent, DataTableComponent, FormWrapperComponent, FormFieldComponent } from '../../../shared';
import { Product, Location, StockAdjustment, TableColumn } from '../../../core/models';

@Component({
  selector: 'app-adjustment-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductPickerComponent,
    LocationPickerComponent,
    DataTableComponent,
    FormWrapperComponent,
    FormFieldComponent
  ],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">STOCK LEVEL ADJUSTMENTS</h1>
          <p class="page__subtitle">DISCREPANCY CORRECTIONS, DAMAGE WRITEOFFS & SHRINKAGE JOURNAL</p>
        </div>
      </div>

      <!-- Two column operational split -->
      <div class="adj-split">
        <!-- New Adjustment Form -->
        <div class="adj-form-pane">
          <app-form-wrapper
            [formGroup]="adjForm"
            formTitle="EXECUTE STOCK CORRECTION"
            formSubtitle="Immediately recalculates on-hand levels and registers movement record"
            submitLabel="AUTHORIZE ADJUSTMENT"
            [showCancel]="false"
            (formSubmit)="onSubmit()"
          >
            <div class="form-field">
              <app-product-picker
                label="TARGET PRODUCT SKU *"
                [selectedId]="selectedProductId()"
                (productSelected)="onProductSelect($event)"
              />
            </div>

            <div class="form-field">
              <app-location-picker
                label="FACILITY NODE *"
                [selectedId]="selectedLocationId()"
                (locationSelected)="onLocationSelect($event)"
              />
            </div>

            @if (currentStockLevel(); as stock) {
              <div class="stock-readout card card--compact">
                <span class="text-label text-muted">CURRENT ON-HAND BAL:</span>
                <span class="text-data text-subheading">{{ stock.quantityOnHand }} PCS</span>
              </div>
            }

            <div class="grid grid--2">
              <app-form-field label="QUANTITY CHANGE (±) *" [control]="adjForm.get('quantityChange')" [required]="true">
                <input
                  type="number"
                  formControlName="quantityChange"
                  class="form-field__input form-field__input--boxed text-data"
                  placeholder="e.g. -3 or +10"
                />
              </app-form-field>

              <app-form-field label="REASON CODE *" [control]="adjForm.get('reason')" [required]="true">
                <select formControlName="reason" class="form-field__input form-field__input--boxed">
                  @for (rc of mockData.reasonCodes(); track rc.id) {
                    <option [value]="rc.code">{{ rc.code }} — {{ rc.description }}</option>
                  }
                </select>
              </app-form-field>
            </div>

            <app-form-field label="OPERATOR JUSTIFICATION & AUDIT NOTES" [control]="adjForm.get('notes')">
              <textarea
                formControlName="notes"
                class="form-field__input form-field__input--boxed"
                rows="2"
                placeholder="Cycle count variance, damaged pallet during unloading, etc."
              ></textarea>
            </app-form-field>
          </app-form-wrapper>
        </div>

        <!-- History Ledger -->
        <div class="adj-history-pane">
          <div class="card">
            <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">
              RECENT ADJUSTMENTS JOURNAL ({{ mockData.adjustments().length }})
            </span>
            <app-data-table
              [data]="mockData.adjustments()"
              [allColumns]="historyColumns"
              [total]="mockData.adjustments().length"
              [searchable]="false"
              [showDensityToggle]="false"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .adj-split {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: var(--space-lg);
    }
    @media (max-width: 1100px) {
      .adj-split {
        grid-template-columns: 1fr;
      }
    }
    .stock-readout {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: var(--surface-raised);
    }
  `]
})
export class AdjustmentFormComponent {
  private fb = inject(FormBuilder);
  mockData = inject(MockDataService);
  private notifications = inject(NotificationService);

  selectedProductId = signal<string>('prod-1');
  selectedLocationId = signal<string>('loc-001');

  currentStockLevel = signal<{ quantityOnHand: number; unitCost: number } | null>(null);

  adjForm = this.fb.group({
    quantityChange: [null, [Validators.required]],
    reason: ['CNT-CORR', Validators.required],
    notes: ['']
  });

  historyColumns: TableColumn[] = [
    { key: 'createdAt', label: 'DATE', sortable: true, type: 'date', width: '110px' },
    { key: 'adjustmentNumber', label: 'ADJ NO', sortable: true, width: '120px' },
    { key: 'productSku', label: 'SKU', sortable: true, width: '110px' },
    { key: 'quantityChange', label: 'DELTA', sortable: true, type: 'number', align: 'right' },
    { key: 'reason', label: 'REASON', sortable: true },
    { key: 'createdByName', label: 'OPERATOR', sortable: true }
  ];

  constructor() {
    this.updateCurrentStock();
  }

  onProductSelect(p: Product): void {
    this.selectedProductId.set(p.id);
    this.updateCurrentStock();
  }

  onLocationSelect(l: Location): void {
    this.selectedLocationId.set(l.id);
    this.updateCurrentStock();
  }

  updateCurrentStock(): void {
    const sl = this.mockData.stockLevels().find(
      s => s.productId === this.selectedProductId() && s.locationId === this.selectedLocationId()
    );
    if (sl) {
      this.currentStockLevel.set({ quantityOnHand: sl.quantityOnHand, unitCost: sl.unitCost });
    } else {
      this.currentStockLevel.set({ quantityOnHand: 0, unitCost: 50 });
    }
  }

  onSubmit(): void {
    if (this.adjForm.invalid) return;

    const prod = this.mockData.products().find(p => p.id === this.selectedProductId());
    const loc = this.mockData.locations().find(l => l.id === this.selectedLocationId());
    const current = this.currentStockLevel();

    if (!prod || !loc) return;

    const change = Number(this.adjForm.value.quantityChange);

    const adj = this.mockData.createAdjustment({
      locationId: loc.id,
      locationName: loc.name,
      productId: prod.id,
      productSku: prod.sku,
      productName: prod.name,
      reason: this.adjForm.value.reason as any,
      quantityBefore: current ? current.quantityOnHand : 0,
      quantityChange: change,
      unitCost: prod.unitCost,
      notes: this.adjForm.value.notes || ''
    });

    this.notifications.success(`[AUTHORIZED] Adjustment ${adj.adjustmentNumber} executed.`);
    this.adjForm.reset({ reason: 'CNT-CORR' });
    this.updateCurrentStock();
  }
}
