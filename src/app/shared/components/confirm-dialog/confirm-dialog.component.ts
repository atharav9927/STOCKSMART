import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog" role="alertdialog" [attr.aria-label]="data.title">
      <div class="dialog__header">
        <h2 class="text-subheading">{{ data.title }}</h2>
        <button class="btn btn--ghost btn--sm" (click)="dialogRef.close(false)" aria-label="Close">[ X ]</button>
      </div>
      <p class="dialog__body text-body-sm">{{ data.message }}</p>
      <div class="dialog__actions">
        <button class="btn btn--secondary" (click)="dialogRef.close(false)">
          {{ data.cancelLabel || 'CANCEL' }}
        </button>
        <button
          class="btn"
          [ngClass]="data.isDestructive ? 'btn--destructive' : 'btn--primary'"
          (click)="dialogRef.close(true)"
        >
          {{ data.confirmLabel || 'CONFIRM' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog {
      background: var(--surface);
      border: 1px solid var(--border-visible);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      max-width: 480px;
      width: 90vw;
    }
    .dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-md);
    }
    .dialog__body {
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
    }
    .dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
}
