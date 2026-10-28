import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-tree',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <h1 class="page__title">TAXONOMY & CATEGORY ARCHITECTURE</h1>
          <p class="page__subtitle">NESTED PRODUCT TAXONOMY WITH DRAG-AND-DROP REORDERING</p>
        </div>
        <div class="layout-row layout-gap-sm">
          <button class="btn btn--secondary btn--sm" (click)="showNewCategory.set(!showNewCategory())">
            [ + NEW ROOT NODE ]
          </button>
        </div>
      </div>

      <!-- Add Category Drawer / Inline form -->
      @if (showNewCategory()) {
        <div class="card card--raised" style="margin-bottom: 24px;">
          <span class="text-label text-muted">CREATE TAXONOMY NODE</span>
          <div class="layout-row layout-gap-md" style="margin-top: 12px;">
            <input
              type="text"
              class="form-field__input form-field__input--boxed"
              placeholder="Category name (e.g. Smart Sensors)"
              [(ngModel)]="newCategoryName"
              style="max-width: 360px;"
            />
            <button class="btn btn--primary btn--sm" (click)="addCategory()">SAVE NODE</button>
            <button class="btn btn--ghost btn--sm" (click)="showNewCategory.set(false)">CANCEL</button>
          </div>
        </div>
      }

      <div class="card">
        <div class="layout-between" style="margin-bottom: 16px;">
          <span class="text-label text-muted">HIERARCHY (DRAG ITEMS TO REORDER SEQUENCE)</span>
          <span class="text-caption text-disabled">{{ categories().length }} TOTAL CLASSIFICATIONS</span>
        </div>

        <div cdkDropList class="cat-list" (cdkDropListDropped)="drop($event)">
          @for (cat of categories(); track cat.id) {
            <div cdkDrag class="cat-item" [class.cat-item--child]="cat.parentId !== null">
              <div class="cat-item__handle" cdkDragHandle aria-label="Drag handle">
                :::
              </div>
              <div class="cat-item__body">
                <span class="text-subheading">{{ cat.name }}</span>
                <span class="text-caption text-muted">ID: {{ cat.id }}</span>
              </div>
              <div class="cat-item__meta">
                <span class="chip chip--technical">{{ cat.productCount }} SKUS</span>
                <button class="btn btn--ghost btn--sm text-error" (click)="deleteNode(cat.id)" aria-label="Delete category">
                  ✕
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cat-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .cat-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      transition: background var(--duration-micro) var(--ease-out);
    }
    .cat-item:hover {
      border-color: var(--border-visible);
    }
    .cat-item--child {
      margin-left: var(--space-2xl);
      border-left: 2px solid var(--interactive);
    }
    .cat-item__handle {
      cursor: grab;
      font-family: var(--font-data);
      color: var(--text-disabled);
      font-size: 16px;
      user-select: none;
    }
    .cat-item__handle:active {
      cursor: grabbing;
    }
    .cat-item__body {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }
    .cat-item__meta {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .cdk-drag-preview {
      box-sizing: border-box;
      border: 1px solid var(--interactive);
      background: var(--surface);
      border-radius: var(--radius-md);
      padding: var(--space-md);
    }
    .cdk-drag-placeholder {
      opacity: 0.3;
    }
  `]
})
export class CategoryTreeComponent {
  mockData = inject(MockDataService);
  notifications = inject(NotificationService);

  categories = this.mockData.categories;
  showNewCategory = signal(false);
  newCategoryName = '';

  drop(event: CdkDragDrop<Category[]>): void {
    const list = [...this.categories()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.mockData.categories.set(list);
    this.notifications.success('[SAVED] Category sequence updated.');
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    const newId = `cat-0${this.categories().length + 1}`;
    const newCat: Category = {
      id: newId,
      name: this.newCategoryName.trim(),
      parentId: null,
      sortOrder: this.categories().length + 1,
      productCount: 0
    };
    this.mockData.categories.update(list => [...list, newCat]);
    this.notifications.success(`[CREATED] Added node "${newCat.name}"`);
    this.newCategoryName = '';
    this.showNewCategory.set(false);
  }

  deleteNode(id: string): void {
    this.mockData.categories.update(list => list.filter(c => c.id !== id));
    this.notifications.show('[DELETED] Classification removed from taxonomy', 'warning');
  }
}
