import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Location } from '../../../core/models';

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="picker">
      @if (label) {
        <label class="text-label">{{ label }}</label>
      }
      <div class="picker__field" (click)="isOpen.set(!isOpen())">
        <span class="picker__selected text-body-sm" [class.text-disabled]="!selectedLocation()">
          {{ selectedLocation() ? selectedLocation()!.code + ' — ' + selectedLocation()!.name : placeholder }}
        </span>
        <span class="picker__arrow text-caption" aria-hidden="true">{{ isOpen() ? '▲' : '▼' }}</span>
      </div>

      @if (isOpen()) {
        <div class="picker__overlay" (click)="isOpen.set(false)"></div>
        <div class="picker__menu">
          <div class="picker__list">
            @for (loc of locations(); track loc.id) {
              <div
                class="picker__item"
                [class.picker__item--active]="selectedId === loc.id"
                (click)="select(loc)"
              >
                <div class="layout-between">
                  <span class="text-data text-subheading">{{ loc.code }}</span>
                  <span class="text-label text-muted">{{ loc.type }}</span>
                </div>
                <span class="text-body-sm">{{ loc.name }}</span>
                <span class="text-caption text-disabled">{{ loc.city }}, {{ loc.state }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .picker {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .picker__field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-md);
      padding: var(--space-sm) var(--space-md);
      background: var(--surface);
      cursor: pointer;
      min-height: 44px;
    }
    .picker__field:hover {
      border-color: var(--text-primary);
    }
    .picker__overlay {
      position: fixed;
      inset: 0;
      z-index: var(--z-dropdown);
    }
    .picker__menu {
      position: absolute;
      top: calc(100% + var(--space-xs));
      left: 0;
      right: 0;
      background: var(--surface-raised);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-md);
      z-index: calc(var(--z-dropdown) + 1);
      max-height: 260px;
      overflow-y: auto;
    }
    .picker__item {
      padding: var(--space-sm) var(--space-md);
      cursor: pointer;
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .picker__item:hover {
      background: var(--surface);
    }
    .picker__item--active {
      border-left: 2px solid var(--accent);
      background: var(--surface);
    }
  `]
})
export class LocationPickerComponent {
  private mockData = inject(MockDataService);

  @Input() label = '';
  @Input() placeholder = 'Select location...';
  @Input() selectedId: string | null = null;
  @Output() locationSelected = new EventEmitter<Location>();

  isOpen = signal(false);
  locations = this.mockData.locations;

  selectedLocation = computed(() => {
    return this.locations().find(l => l.id === this.selectedId) || null;
  });

  select(loc: Location): void {
    this.selectedId = loc.id;
    this.isOpen.set(false);
    this.locationSelected.emit(loc);
  }
}
