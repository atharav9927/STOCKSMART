import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { DataTableComponent } from '../../../shared';
import { TableColumn } from '../../../core/models';

interface FlatBarcode {
  id: string;
  code: string;
  type: string;
  isPrimary: boolean;
  productSku: string;
  productName: string;
}

@Component({
  selector: 'app-barcode-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">REGISTERED BARCODES & TRANSPONDERS</h1>
          <p class="page__subtitle">EAN-13, CODE 128, DATAMATRIX & EPC RFID IDENTIFIERS</p>
        </div>
        <a routerLink="/catalog/labels" class="btn btn--secondary btn--sm">[ PRINT LABELS ]</a>
      </div>

      <app-data-table
        [data]="allBarcodes()"
        [allColumns]="columns"
        [total]="allBarcodes().length"
        [searchable]="true"
        [exportable]="true"
      />
    </div>
  `
})
export class BarcodeListComponent {
  mockData = inject(MockDataService);

  allBarcodes = computed(() => {
    const list: FlatBarcode[] = [];
    this.mockData.products().forEach(p => {
      p.barcodes.forEach(bc => {
        list.push({
          id: bc.id,
          code: bc.code,
          type: bc.type,
          isPrimary: bc.isPrimary,
          productSku: p.sku,
          productName: p.name
        });
      });
    });
    return list;
  });

  columns: TableColumn[] = [
    { key: 'code', label: 'BARCODE / TAG VALUE', sortable: true, width: '220px' },
    { key: 'type', label: 'SYMBOLOGY TYPE', sortable: true, width: '140px' },
    { key: 'productSku', label: 'ASSOCIATED SKU', sortable: true, width: '130px' },
    { key: 'productName', label: 'PRODUCT DESIGNATION', sortable: true },
    {
      key: 'isPrimary',
      label: 'PRIMARY TAG',
      format: (val) => val ? '● YES' : '○ NO'
    }
  ];
}
