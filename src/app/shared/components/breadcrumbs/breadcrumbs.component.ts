import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from '../../../core/models';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumbs" aria-label="Breadcrumbs">
      <ol class="breadcrumbs__list">
        @for (crumb of items; track crumb.label; let last = $last) {
          <li class="breadcrumbs__item">
            @if (crumb.url && !last) {
              <a class="breadcrumbs__link text-caption" [routerLink]="crumb.url">{{ crumb.label }}</a>
            } @else {
              <span class="breadcrumbs__current text-caption" [attr.aria-current]="last ? 'page' : null">{{ crumb.label }}</span>
            }
            @if (!last) {
              <span class="breadcrumbs__sep text-disabled" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumbs__list {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .breadcrumbs__item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }
    .breadcrumbs__link {
      color: var(--text-secondary);
      text-decoration: none;
    }
    .breadcrumbs__link:hover {
      color: var(--text-primary);
    }
    .breadcrumbs__current {
      color: var(--text-primary);
    }
    .breadcrumbs__sep {
      font-size: var(--caption);
      color: var(--text-disabled);
    }
  `],
})
export class BreadcrumbsComponent {
  @Input() items: Breadcrumb[] = [];
}
