import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FormWrapperComponent, FormFieldComponent } from '../../../shared';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormWrapperComponent, FormFieldComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">{{ isEdit() ? 'EDIT HARDWARE SPECIFICATION' : 'REGISTER NEW HARDWARE SKU' }}</h1>
          <p class="page__subtitle">{{ isEdit() ? 'MODIFY ATTRIBUTES FOR ' + productSku() : 'ADD NEW CATALOG ENTRY TO CENTRAL REPOSITORY' }}</p>
        </div>
        <button class="btn btn--secondary btn--sm" (click)="navigateBack()">
          ← BACK TO CATALOG
        </button>
      </div>

      <div class="form-container">
        <app-form-wrapper
          [formGroup]="productForm"
          [formTitle]="isEdit() ? 'SKU METADATA & PRICING' : 'INITIAL SKU SPECIFICATION'"
          [formSubtitle]="'All fields marked * are required for ERP synchronization'"
          [submitLabel]="isEdit() ? 'UPDATE SPECIFICATION' : 'CREATE HARDWARE ENTRY'"
          (formSubmit)="onSave($event)"
          (cancel)="navigateBack()"
        >
          <div class="grid grid--2">
            <app-form-field label="SKU IDENTIFIER" [control]="productForm.get('sku')" [required]="true">
              <input
                type="text"
                formControlName="sku"
                class="form-field__input form-field__input--boxed text-data"
                placeholder="e.g. SKU-8842"
              />
            </app-form-field>

            <app-form-field label="HARDWARE DESIGNATION / NAME" [control]="productForm.get('name')" [required]="true">
              <input
                type="text"
                formControlName="name"
                class="form-field__input form-field__input--boxed"
                placeholder="e.g. Ear (2) Transparent White"
              />
            </app-form-field>
          </div>

          <div class="grid grid--2">
            <app-form-field label="HARDWARE CATEGORY" [control]="productForm.get('categoryId')">
              <select formControlName="categoryId" class="form-field__input form-field__input--boxed">
                @for (cat of mockData.categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </app-form-field>

            <app-form-field label="ORIGINAL BRAND" [control]="productForm.get('brandId')">
              <select formControlName="brandId" class="form-field__input form-field__input--boxed">
                @for (brand of mockData.brands(); track brand.id) {
                  <option [value]="brand.id">{{ brand.name }}</option>
                }
              </select>
            </app-form-field>
          </div>

          <app-form-field label="TECHNICAL DESCRIPTION" [control]="productForm.get('description')">
            <textarea
              formControlName="description"
              class="form-field__input form-field__input--boxed"
              rows="3"
              placeholder="Engineering specifications, acoustic drivers, power architecture..."
            ></textarea>
          </app-form-field>

          <div class="grid grid--4">
            <app-form-field label="UNIT COST (USD)" [control]="productForm.get('unitCost')" [required]="true">
              <input
                type="number"
                formControlName="unitCost"
                class="form-field__input form-field__input--boxed text-data"
                min="0"
                step="0.01"
              />
            </app-form-field>

            <app-form-field label="RETAIL PRICE (USD)" [control]="productForm.get('unitPrice')" [required]="true">
              <input
                type="number"
                formControlName="unitPrice"
                class="form-field__input form-field__input--boxed text-data"
                min="0"
                step="0.01"
              />
            </app-form-field>

            <app-form-field label="REORDER POINT" [control]="productForm.get('reorderPoint')" [required]="true">
              <input
                type="number"
                formControlName="reorderPoint"
                class="form-field__input form-field__input--boxed text-data"
                min="1"
              />
            </app-form-field>

            <app-form-field label="REORDER BATCH QTY" [control]="productForm.get('reorderQuantity')" [required]="true">
              <input
                type="number"
                formControlName="reorderQuantity"
                class="form-field__input form-field__input--boxed text-data"
                min="1"
              />
            </app-form-field>
          </div>

          <div class="grid grid--2">
            <app-form-field label="PRIMARY BARCODE (EAN-13)" [control]="productForm.get('barcode')">
              <input
                type="text"
                formControlName="barcode"
                class="form-field__input form-field__input--boxed text-data"
                placeholder="e.g. 735008100124"
              />
            </app-form-field>

            <app-form-field label="RFID TRANSPONDER EPC" [control]="productForm.get('rfidCode')">
              <input
                type="text"
                formControlName="rfidCode"
                class="form-field__input form-field__input--boxed text-data"
                placeholder="e.g. RFID-SKU-8842"
              />
            </app-form-field>
          </div>
        </app-form-wrapper>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 900px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  mockData = inject(MockDataService);
  private notifications = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  productSku = signal('');
  productId = signal<string | null>(null);

  productForm: FormGroup = this.fb.group({
    sku: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    categoryId: ['cat-01-1', Validators.required],
    brandId: ['br-01', Validators.required],
    description: [''],
    unitCost: [50, [Validators.required, Validators.min(0.01)]],
    unitPrice: [99, [Validators.required, Validators.min(0.01)]],
    reorderPoint: [20, [Validators.required, Validators.min(1)]],
    reorderQuantity: [100, [Validators.required, Validators.min(1)]],
    barcode: [''],
    rfidCode: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(id);
      const prod = this.mockData.products().find(p => p.id === id);
      if (prod) {
        this.productSku.set(prod.sku);
        const primaryBarcode = prod.barcodes.find(b => b.isPrimary)?.code || '';
        const rfid = prod.barcodes.find(b => b.type === 'RFID')?.code || '';
        this.productForm.patchValue({
          sku: prod.sku,
          name: prod.name,
          categoryId: prod.categoryId,
          brandId: prod.brandId,
          description: prod.description,
          unitCost: prod.unitCost,
          unitPrice: prod.unitPrice,
          reorderPoint: prod.reorderPoint,
          reorderQuantity: prod.reorderQuantity,
          barcode: primaryBarcode,
          rfidCode: rfid
        });
      }
    }
  }

  onSave(values: any): void {
    if (this.isEdit() && this.productId()) {
      this.mockData.updateProduct(this.productId()!, {
        sku: values.sku,
        name: values.name,
        categoryId: values.categoryId,
        brandId: values.brandId,
        description: values.description,
        unitCost: Number(values.unitCost),
        unitPrice: Number(values.unitPrice),
        reorderPoint: Number(values.reorderPoint),
        reorderQuantity: Number(values.reorderQuantity)
      });
      this.notifications.success(`[UPDATED] Hardware SKU ${values.sku} updated successfully.`);
    } else {
      const newProd = this.mockData.addProduct({
        sku: values.sku,
        name: values.name,
        categoryId: values.categoryId,
        brandId: values.brandId,
        description: values.description,
        unitCost: Number(values.unitCost),
        unitPrice: Number(values.unitPrice),
        reorderPoint: Number(values.reorderPoint),
        reorderQuantity: Number(values.reorderQuantity)
      });
      this.notifications.success(`[REGISTERED] Hardware SKU ${newProd.sku} created.`);
    }
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/catalog/products']);
  }
}
