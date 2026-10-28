import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';

interface RfidRead {
  epc: string;
  sku: string;
  name: string;
  rssi: number;
  readCount: number;
  antenna: number;
  timestamp: string;
}

@Component({
  selector: 'app-rfid-simulator',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">UHF RFID ANTENNA PORTAL SIMULATOR</h1>
          <p class="page__subtitle">EPC GEN-2 FIXED GATEWAY • DOCK DOOR 4 ANTENNA ARRAY</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <button class="btn btn--primary btn--sm" (click)="triggerPulseRead()" [disabled]="scanning()">
            {{ scanning() ? '[ READING ANTENNA ARRAY... ]' : '[ TRIGGER RFID BURST READ ]' }}
          </button>
          <button class="btn btn--secondary btn--sm" (click)="reads.set([])" [disabled]="reads().length === 0">
            CLEAR
          </button>
        </div>
      </div>

      <!-- Antenna Status Cards -->
      <div class="grid grid--4" style="margin-bottom: 24px;">
        <div class="card card--compact">
          <span class="text-label text-muted">ANTENNA 01 (LEFT DOCK)</span>
          <span class="text-data text-success">● CONNECTED (30 dBm)</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">ANTENNA 02 (RIGHT DOCK)</span>
          <span class="text-data text-success">● CONNECTED (30 dBm)</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">TAG INGESTION RATE</span>
          <span class="text-display-md text-data">{{ reads().length }} / sec</span>
        </div>
        <div class="card card--compact">
          <span class="text-label text-muted">GATEWAY FIRMWARE</span>
          <span class="text-data">ZEBRA FX9600 v3.8</span>
        </div>
      </div>

      <div class="card">
        <span class="text-label text-muted" style="margin-bottom: 16px; display: block;">TRANSPONDER CAPTURE JOURNAL</span>
        <table class="dt__table">
          <thead>
            <tr>
              <th class="dt__th">EPC TRANSPONDER ID</th>
              <th class="dt__th">RESOLVED SKU</th>
              <th class="dt__th">DESIGNATION</th>
              <th class="dt__th" style="text-align: right;">RSSI (dBm)</th>
              <th class="dt__th" style="text-align: right;">READS</th>
              <th class="dt__th" style="text-align: right;">ANTENNA</th>
            </tr>
          </thead>
          <tbody>
            @for (read of reads(); track read.epc) {
              <tr class="dt__row">
                <td class="dt__td text-data">{{ read.epc }}</td>
                <td class="dt__td text-data">{{ read.sku }}</td>
                <td class="dt__td">{{ read.name }}</td>
                <td class="dt__td text-data text-success" style="text-align: right;">{{ read.rssi }} dBm</td>
                <td class="dt__td text-data" style="text-align: right;">{{ read.readCount }}</td>
                <td class="dt__td text-data" style="text-align: right;">#{{ read.antenna }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="empty text-caption text-disabled" style="padding: 32px; text-align: center;">
                  No tags in gateway RF field. Click "TRIGGER RFID BURST READ" to simulate dock pallet passage.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RfidSimulatorComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  scanning = signal(false);
  reads = signal<RfidRead[]>([]);

  triggerPulseRead(): void {
    this.scanning.set(true);
    setTimeout(() => {
      const prods = this.mockData.products().slice(0, 12);
      const simulated: RfidRead[] = prods.map((p, idx) => ({
        epc: `3034${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        sku: p.sku,
        name: p.name,
        rssi: -42 - (idx % 15),
        readCount: 14 + (idx * 3),
        antenna: (idx % 2) + 1,
        timestamp: new Date().toISOString()
      }));
      this.reads.set(simulated);
      this.scanning.set(false);
      this.notifications.success(`[RFID PULSE] Captured ${simulated.length} transponders on dock array.`);
    }, 700);
  }
}
