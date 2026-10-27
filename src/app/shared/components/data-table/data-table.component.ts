import { Component, Input, Output, EventEmitter, computed, signal, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableColumn, PaginationParams } from '../../../core/models';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ErrorStateComponent } from '../error-state/error-state.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusChipComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="dt" [class.dt--compact]="compact()">
      <!-- Toolbar -->
      <div class="dt__toolbar">
        <div class="dt__toolbar-left">
          @if (searchable) {
            <div class="form-field">
              <input
                class="form-field__input form-field__input--boxed dt__search"
                type="text"
                [placeholder]="searchPlaceholder"
                [ngModel]="searchTerm()"
                (ngModelChange)="onSearch($event)"
                aria-label="Search table"
              />
            </div>
          }
          @if (selectedRows().length > 0) {
            <span class="text-label">{{ selectedRows().length }} SELECTED</span>
            <ng-content select="[bulkActions]"></ng-content>
          }
        </div>
        <div class="dt__toolbar-right">
          <ng-content select="[toolbarActions]"></ng-content>
          @if (showDensityToggle) {
            <button
              class="btn btn--ghost btn--sm"
              (click)="toggleDensity()"
              [attr.aria-label]="compact() ? 'Switch to comfortable density' : 'Switch to compact density'"
            >
              {{ compact() ? '[ ≡ ]' : '[ = ]' }}
            </button>
          }
          @if (exportable) {
            <button class="btn btn--ghost btn--sm" (click)="export.emit()">
              [ EXPORT ]
            </button>
          }
          @if (showColumnChooser) {
            <button class="btn btn--ghost btn--sm" (click)="columnChooserOpen.set(!columnChooserOpen())">
              [ COLUMNS ]
            </button>
          }
        </div>
      </div>

      <!-- Column Chooser -->
      @if (columnChooserOpen()) {
        <div class="dt__col-chooser">
          @for (col of allColumns; track col.key) {
            <label class="dt__col-option">
              <input
                type="checkbox"
                [checked]="isColumnVisible(col.key)"
                (change)="toggleColumn(col.key)"
              />
              <span class="text-caption">{{ col.label }}</span>
            </label>
          }
        </div>
      }

      <!-- Table -->
      @if (loading) {
        <app-loading-state />
      } @else if (error) {
        <app-error-state [message]="error" (retry)="retryLoad.emit()" />
      } @else if (data.length === 0) {
        <app-empty-state [title]="emptyTitle" [message]="emptyMessage">
          <ng-content select="[emptyAction]"></ng-content>
        </app-empty-state>
      } @else {
        <div class="dt__scroll" role="region" [attr.aria-label]="ariaLabel" tabindex="0">
          <table class="dt__table" role="grid">
            <thead>
              <tr>
                @if (selectable) {
                  <th class="dt__th dt__th--check" scope="col">
                    <input
                      type="checkbox"
                      [checked]="allSelected()"
                      [indeterminate]="someSelected()"
                      (change)="toggleAll()"
                      aria-label="Select all rows"
                    />
                  </th>
                }
                @for (col of visibleColumns(); track col.key) {
                  <th
                    class="dt__th"
                    [class.dt__th--sortable]="col.sortable"
                    [class.dt__th--sorted]="sortBy() === col.key"
                    [style.width]="col.width || 'auto'"
                    [style.text-align]="col.align || (col.type === 'number' || col.type === 'currency' ? 'right' : 'left')"
                    scope="col"
                    (click)="col.sortable ? onSort(col.key) : null"
                    (keydown.enter)="col.sortable ? onSort(col.key) : null"
                    [attr.tabindex]="col.sortable ? 0 : null"
                    [attr.aria-sort]="sortBy() === col.key ? (sortDir() === 'asc' ? 'ascending' : 'descending') : null"
                  >
                    <span class="dt__th-content">
                      {{ col.label }}
                      @if (col.sortable && sortBy() === col.key) {
                        <span class="dt__sort-icon" aria-hidden="true">{{ sortDir() === 'asc' ? '↑' : '↓' }}</span>
                      }
                    </span>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of data; track trackByFn(row); let i = $index) {
                <tr
                  class="dt__row"
                  [class.dt__row--selected]="isSelected(row)"
                  [class.dt__row--active]="activeRowId === getRowId(row)"
                  (click)="onRowClick(row)"
                  (keydown.enter)="onRowClick(row)"
                  [attr.tabindex]="0"
                  [attr.aria-selected]="selectable ? isSelected(row) : null"
                >
                  @if (selectable) {
                    <td class="dt__td dt__td--check" (click)="$event.stopPropagation()">
                      <input
                        type="checkbox"
                        [checked]="isSelected(row)"
                        (change)="toggleRow(row)"
                        [attr.aria-label]="'Select row ' + (i + 1)"
                      />
                    </td>
                  }
                  @for (col of visibleColumns(); track col.key) {
                    <td
                      class="dt__td"
                      [style.text-align]="col.align || (col.type === 'number' || col.type === 'currency' ? 'right' : 'left')"
                    >
                      @if (col.type === 'status') {
                        <app-status-chip [status]="getCellValue(row, col.key)" />
                      } @else if (col.type === 'currency') {
                        <span class="text-data">{{ getCellValue(row, col.key) | currency:'USD':'symbol':'1.0-0' }}</span>
                      } @else if (col.type === 'date') {
                        <span class="text-caption">{{ getCellValue(row, col.key) | date:'MMM d, y' }}</span>
                      } @else if (col.type === 'number') {
                        <span class="text-data">{{ getCellValue(row, col.key) | number }}</span>
                      } @else if (col.type === 'boolean') {
                        <span class="text-data">{{ getCellValue(row, col.key) ? '●' : '○' }}</span>
                      } @else if (col.type === 'actions') {
                        <ng-content select="[rowActions]"></ng-content>
                      } @else if (col.format) {
                        <span>{{ col.format(getCellValue(row, col.key), row) }}</span>
                      } @else {
                        <span>{{ getCellValue(row, col.key) }}</span>
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (showPagination) {
          <div class="dt__pagination">
            <span class="text-label">
              {{ paginationStart() }}–{{ paginationEnd() }} OF {{ total }}
            </span>
            <div class="dt__pagination-controls">
              <select
                class="dt__page-size form-field__input form-field__input--boxed"
                [ngModel]="pageSize()"
                (ngModelChange)="onPageSizeChange($event)"
                aria-label="Rows per page"
              >
                @for (size of pageSizeOptions; track size) {
                  <option [value]="size">{{ size }}</option>
                }
              </select>
              <button
                class="btn btn--ghost btn--sm"
                [disabled]="page() <= 1"
                (click)="onPageChange(page() - 1)"
                aria-label="Previous page"
              >‹</button>
              <span class="text-label">{{ page() }} / {{ totalPages() }}</span>
              <button
                class="btn btn--ghost btn--sm"
                [disabled]="page() >= totalPages()"
                (click)="onPageChange(page() + 1)"
                aria-label="Next page"
              >›</button>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .dt {
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .dt__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-sm) var(--space-md);
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: var(--space-sm);
    }
    .dt__toolbar-left,
    .dt__toolbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .dt__search {
      width: 240px;
      font-size: var(--body-sm) !important;
      padding: var(--space-xs) var(--space-sm) !important;
    }
    .dt__col-chooser {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      padding: var(--space-sm) var(--space-md);
      border-bottom: 1px solid var(--border);
      background: var(--surface-raised);
    }
    .dt__col-option {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      cursor: pointer;
    }
    .dt__scroll {
      overflow-x: auto;
    }
    .dt__table {
      width: 100%;
      border-collapse: collapse;
    }
    .dt__th {
      font-family: var(--font-data);
      font-size: var(--label);
      line-height: var(--lh-label);
      letter-spacing: var(--ls-label);
      text-transform: uppercase;
      color: var(--text-secondary);
      padding: var(--space-sm) var(--space-md);
      border-bottom: 1px solid var(--border-visible);
      position: sticky;
      top: 0;
      background: var(--surface);
      white-space: nowrap;
      user-select: none;
    }
    .dt__th--check {
      width: 44px;
      padding: var(--space-sm);
    }
    .dt__th--sortable {
      cursor: pointer;
    }
    .dt__th--sortable:hover {
      color: var(--text-primary);
    }
    .dt__th--sorted {
      color: var(--text-display);
    }
    .dt__th-content {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
    }
    .dt__sort-icon {
      font-size: var(--caption);
    }
    .dt__row {
      border-bottom: 1px solid var(--border);
      transition: background var(--duration-micro) var(--ease-out);
      cursor: pointer;
    }
    .dt__row:hover {
      background: var(--surface-raised);
    }
    .dt__row:focus-visible {
      outline: 2px solid var(--interactive);
      outline-offset: -2px;
    }
    .dt__row--selected {
      background: var(--surface-raised);
    }
    .dt__row--active {
      background: var(--surface-raised);
      border-left: 2px solid var(--accent);
    }
    .dt__td {
      padding: var(--space-sm) var(--space-md);
      font-family: var(--font-body);
      font-size: var(--body-sm);
      color: var(--text-primary);
      white-space: nowrap;
    }
    .dt__td--check {
      width: 44px;
      padding: var(--space-sm);
    }
    .dt__td .text-data {
      font-family: var(--font-data);
      font-variant-numeric: tabular-nums;
      font-size: var(--body-sm);
    }
    .dt--compact .dt__th {
      padding: var(--space-xs) var(--space-sm);
      font-size: 10px;
    }
    .dt--compact .dt__td {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--caption);
    }
    .dt__pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-sm) var(--space-md);
      border-top: 1px solid var(--border);
    }
    .dt__pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .dt__page-size {
      width: 64px;
      font-size: var(--caption) !important;
      padding: var(--space-2xs) var(--space-xs) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .dt__row { transition: none; }
    }
  `],
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() allColumns: TableColumn[] = [];
  @Input() total = 0;
  @Input() loading = false;
  @Input() error = '';
  @Input() searchable = true;
  @Input() selectable = false;
  @Input() exportable = false;
  @Input() showDensityToggle = true;
  @Input() showColumnChooser = true;
  @Input() showPagination = true;
  @Input() idField = 'id';
  @Input() activeRowId = '';
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyTitle = 'No data found';
  @Input() emptyMessage = 'Try adjusting your filters or search criteria.';
  @Input() ariaLabel = 'Data table';
  @Input() pageSizeOptions = [10, 25, 50, 100];

  @Output() pageChange = new EventEmitter<PaginationParams>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() export = new EventEmitter<void>();
  @Output() retryLoad = new EventEmitter<void>();

  searchTerm = signal('');
  sortBy = signal('');
  sortDir = signal<'asc' | 'desc'>('asc');
  page = signal(1);
  pageSize = signal(25);
  compact = signal(false);
  selectedRows = signal<any[]>([]);
  columnChooserOpen = signal(false);
  hiddenColumns = signal<Set<string>>(new Set());

  visibleColumns = computed(() => {
    const hidden = this.hiddenColumns();
    return this.allColumns.filter(c => c.visible !== false && !hidden.has(c.key));
  });

  totalPages = computed(() => Math.ceil(this.total / this.pageSize()) || 1);
  paginationStart = computed(() => (this.page() - 1) * this.pageSize() + 1);
  paginationEnd = computed(() => Math.min(this.page() * this.pageSize(), this.total));

  allSelected = computed(() =>
    this.data.length > 0 && this.selectedRows().length === this.data.length
  );
  someSelected = computed(() =>
    this.selectedRows().length > 0 && this.selectedRows().length < this.data.length
  );

  trackByFn(item: any): string {
    return item[this.idField];
  }

  getRowId(row: any): string {
    return row[this.idField];
  }

  getCellValue(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }

  isColumnVisible(key: string): boolean {
    return !this.hiddenColumns().has(key);
  }

  toggleColumn(key: string): void {
    this.hiddenColumns.update(set => {
      const newSet = new Set(set);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }

  isSelected(row: any): boolean {
    return this.selectedRows().some(r => r[this.idField] === row[this.idField]);
  }

  toggleRow(row: any): void {
    this.selectedRows.update(selected => {
      const exists = selected.some(r => r[this.idField] === row[this.idField]);
      const newSelected = exists
        ? selected.filter(r => r[this.idField] !== row[this.idField])
        : [...selected, row];
      this.selectionChange.emit(newSelected);
      return newSelected;
    });
  }

  toggleAll(): void {
    if (this.allSelected()) {
      this.selectedRows.set([]);
    } else {
      this.selectedRows.set([...this.data]);
    }
    this.selectionChange.emit(this.selectedRows());
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
    this.emitPageChange();
  }

  onSort(key: string): void {
    if (this.sortBy() === key) {
      this.sortDir.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(key);
      this.sortDir.set('asc');
    }
    this.emitPageChange();
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.emitPageChange();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(+size);
    this.page.set(1);
    this.emitPageChange();
  }

  toggleDensity(): void {
    this.compact.update(c => !c);
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  private emitPageChange(): void {
    this.pageChange.emit({
      page: this.page(),
      pageSize: this.pageSize(),
      sortBy: this.sortBy() || undefined,
      sortDirection: this.sortDir(),
      search: this.searchTerm() || undefined,
    });
  }
}
