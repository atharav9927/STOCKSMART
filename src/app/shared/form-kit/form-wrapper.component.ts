import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-wrapper',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="form-kit-wrapper">
      @if (formTitle) {
        <div class="form-kit-header">
          <div>
            <h3 class="text-subheading">{{ formTitle }}</h3>
            @if (formSubtitle) {
              <p class="text-caption text-muted">{{ formSubtitle }}</p>
            }
          </div>
          @if (showDirtyIndicator && formGroup.dirty) {
            <span class="text-label text-warning">[UNSAVED CHANGES]</span>
          }
        </div>
      }

      <div class="form-kit-body">
        <ng-content></ng-content>
      </div>

      <div class="form-kit-actions">
        @if (showCancel) {
          <button type="button" class="btn btn--secondary" (click)="cancel.emit()">
            {{ cancelLabel }}
          </button>
        }
        <button
          type="submit"
          class="btn btn--primary"
          [disabled]="formGroup.invalid && submitted"
        >
          {{ submitLabel }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form-kit-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
    }
    .form-kit-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--space-md);
    }
    .form-kit-body {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .form-kit-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-sm);
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);
    }
  `]
})
export class FormWrapperComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() formTitle = '';
  @Input() formSubtitle = '';
  @Input() submitLabel = 'SAVE';
  @Input() cancelLabel = 'CANCEL';
  @Input() showCancel = true;
  @Input() showDirtyIndicator = true;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  submitted = false;

  onSubmit(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
