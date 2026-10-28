import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-supplier-compare',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">VENDOR COMMERCIAL BENCHMARKING</h1>
          <p class="page__subtitle">SIDE-BY-SIDE SLA COMPARISON • PAYMENT TERMS & LEAD TIME ANALYSIS</p>
        </div>
        <a routerLink="/suppliers" class="btn btn--secondary btn--sm">← SUPPLIERS</a>
      </div>

      <div class="card" style="overflow-x: auto;">
        <table class="dt__table compare-table">
          <thead>
            <tr>
              <th class="dt__th" style="width: 220px;">METRIC BENCHMARK</th>
              @for (sup of mockData.suppliers(); track sup.id) {
                <th class="dt__th" style="text-align: center;">{{ sup.name }}</th>
              }
            </tr>
          </thead>
          <tbody>
            <tr class="dt__row">
              <td class="dt__td text-label">VENDOR CODE</td>
              @for (sup of mockData.suppliers(); track sup.id) {
                <td class="dt__td text-data" style="text-align: center;">{{ sup.code }}</td>
              }
            </tr>
            <tr class="dt__row">
              <td class="dt__td text-label">SLA RATING</td>
              @for (sup of mockData.suppliers(); track sup.id) {
                <td class="dt__td text-data text-success" style="text-align: center;">★ {{ sup.rating }} / 5.0</td>
              }
            </tr>
            <tr class="dt__row">
              <td class="dt__td text-label">LEAD TIME</td>
              @for (sup of mockData.suppliers(); track sup.id) {
                <td class="dt__td text-data" style="text-align: center;">{{ sup.leadTimeDays }} DAYS</td>
              }
            </tr>
            <tr class="dt__row">
              <td class="dt__td text-label">PAYMENT TERMS</td>
              @for (sup of mockData.suppliers(); track sup.id) {
                <td class="dt__td" style="text-align: center;">{{ sup.paymentTerms }}</td>
              }
            </tr>
            <tr class="dt__row">
              <td class="dt__td text-label">MINIMUM ORDER</td>
              @for (sup of mockData.suppliers(); track sup.id) {
                <td class="dt__td text-data" style="text-align: center;">\${{ sup.minimumOrder | number }}</td>
              }
            </tr>
            <tr class="dt__row">
              <td class="dt__td text-label">ON-TIME DELIVERY</td>
              @for (sup of mockData.suppliers(); track sup.id) {
                <td class="dt__td text-data text-success" style="text-align: center;">{{ sup.onTimeDeliveryRate }}%</td>
              }
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .compare-table {
      min-width: 800px;
    }
  `]
})
export class SupplierCompareComponent {
  mockData = inject(MockDataService);
}
