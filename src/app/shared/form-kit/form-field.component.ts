import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-field" [class.form-field--has-error]="hasError">
      @if (label) {
        <label class="form-field__label" [for]="inputId">
          {{ label }}
          @if (required) {
            <span class="text-error" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="form-field__control">
        <ng-content></ng-content>
      </div>

      @if (hasError && errorMessage) {
        <span class="form-field__error" role="alert">
          [ERROR] {{ errorMessage }}
        </span>
      } @else if (hint) {
        <span class="form-field__hint">{{ hint }}</span>
      }
    </div>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      width: 100%;
    }
    .form-field__label {
      font-family: var(--font-data);
      font-size: var(--label);
      letter-spacing: var(--ls-label);
      text-transform: uppercase;
      color: var(--text-secondary);
    }
    .form-field__control {
      display: flex;
      flex-direction: column;
    }
    .form-field__error {
      font-family: var(--font-data);
      font-size: var(--caption);
      color: var(--accent);
      letter-spacing: var(--ls-caption);
    }
    .form-field__hint {
      font-family: var(--font-data);
      font-size: var(--caption);
      color: var(--text-disabled);
      letter-spacing: var(--ls-caption);
    }
    .form-field--has-error ::ng-deep input,
    .form-field--has-error ::ng-deep select,
    .form-field--has-error ::ng-deep textarea {
      border-color: var(--accent) !important;
    }
  `]
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() inputId = '';
  @Input() required = false;
  @Input() control: AbstractControl | null = null;

  get hasError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    const errors = this.control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Invalid email address format';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    if (errors['min']) return `Value must be at least ${errors['min'].min}`;
    if (errors['max']) return `Value must not exceed ${errors['max'].max}`;
    if (errors['pattern']) return 'Invalid format';
    return 'Invalid field value';
  }
}
