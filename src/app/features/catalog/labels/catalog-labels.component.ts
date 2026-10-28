import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-catalog-labels',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">INDUSTRIAL BARCODE & RFID LABEL GENERATOR</h1>
          <p class="page__subtitle">PRINT COMPLIANT ASSET TAGS • THERMAL 203 DPI / 300 DPI RENDERER</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <button class="btn btn--primary btn--sm" (click)="printAll()">
            [ PRINT 12-UP SHEET ]
          </button>
          <a routerLink="/catalog/products" class="btn btn--secondary btn--sm">← CATALOG</a>
        </div>
      </div>

      <div class="label-settings card card--compact">
        <div class="layout-row layout-gap-md layout-wrap">
          <div>
            <label class="text-label">LABEL FORMAT</label>
            <select class="form-field__input form-field__input--boxed" [(ngModel)]="labelFormat">
              <option value="4x2">Standard Shelf (4" × 2")</option>
              <option value="2x1">Compact Asset (2" × 1")</option>
              <option value="rfid">Zebra RFID Smart Label</option>
            </select>
          </div>
          <div>
            <label class="text-label">SYMBOLOGY</label>
            <select class="form-field__input form-field__input--boxed" [(ngModel)]="symbology">
              <option value="ean13">EAN-13 (Standard Retail)</option>
              <option value="code128">Code 128 (Logistics)</option>
              <option value="datamatrix">DataMatrix 2D</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Live Printable Label Grid Preview -->
      <div class="label-grid" style="margin-top: 24px;">
        @for (prod of sampleProducts(); track prod.id) {
          <div class="label-card">
            <div class="label-card__header">
              <span class="label-card__brand">STOCKSMART LOGISTICS</span>
              <span class="label-card__tag">GEN-2</span>
            </div>
            <span class="label-card__title">{{ prod.name }}</span>
            <div class="label-card__barcode">
              <div class="barcode-graphic"></div>
              <span class="text-data text-caption">{{ prod.barcodes[0].code || prod.sku }}</span>
            </div>
            <div class="label-card__footer">
              <span class="text-data">SKU: {{ prod.sku }}</span>
              <span class="text-data">\${{ prod.unitPrice }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .label-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-md);
    }
    .label-card {
      background: #FFFFFF;
      color: #000000;
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-sm);
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      font-family: var(--font-data);
    }
    .label-card__header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
      font-size: 9px;
      font-weight: 700;
    }
    .label-card__title {
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .label-card__barcode {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 8px 0;
    }
    .barcode-graphic {
      width: 100%;
      height: 38px;
      background: repeating-linear-gradient(
        90deg,
        #000000 0px,
        #000000 2px,
        transparent 2px,
        transparent 4px,
        #000000 4px,
        #000000 7px,
        transparent 7px,
        transparent 9px
      );
    }
    .label-card__footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #000000;
      padding-top: 4px;
      font-size: 11px;
      font-weight: 700;
    }
  `]
})
export class CatalogLabelsComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  labelFormat = '4x2';
  symbology = 'ean13';

  sampleProducts = signal<Product[]>(this.mockData.products().slice(0, 8));

  printAll(): void {
    window.print();
    this.notifications.success('[PRINT] Label spooler dispatched to thermal printer queue.');
  }
}
