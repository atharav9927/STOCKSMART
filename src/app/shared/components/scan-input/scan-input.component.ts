import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scan-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="scan" [class.scan--success]="feedbackState === 'success'" [class.scan--error]="feedbackState === 'error'">
      <label class="text-label scan__label" [for]="inputId">{{ label }}</label>
      <div class="scan__field">
        <input
          #scanInput
          [id]="inputId"
          class="scan__input"
          type="text"
          [placeholder]="placeholder"
          [(ngModel)]="scanValue"
          (keydown.enter)="onScan()"
          [attr.aria-label]="label"
          autocomplete="off"
          inputmode="none"
        />
        <button class="scan__btn btn btn--primary" (click)="onScan()" [disabled]="!scanValue">
          SCAN
        </button>
      </div>
      @if (feedbackState) {
        <span
          class="scan__feedback text-label"
          [class.text-success]="feedbackState === 'success'"
          [class.text-error]="feedbackState === 'error'"
          role="status"
          aria-live="assertive"
        >
          [{{ feedbackState === 'success' ? 'SCANNED' : 'NOT FOUND' }}] {{ feedbackMessage }}
        </span>
      }
    </div>
  `,
  styles: [`
    .scan {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .scan__label {
      color: var(--text-secondary);
    }
    .scan__field {
      display: flex;
      gap: var(--space-sm);
    }
    .scan__input {
      flex: 1;
      font-family: var(--font-data);
      font-size: var(--heading);
      color: var(--text-display);
      background: var(--surface);
      border: 2px solid var(--border-visible);
      border-radius: var(--radius-md);
      padding: var(--space-md);
      outline: none;
      transition: border-color var(--duration-micro) var(--ease-out);
      min-height: 56px;
    }
    .scan__input:focus {
      border-color: var(--text-primary);
    }
    .scan--success .scan__input {
      border-color: var(--success);
    }
    .scan--error .scan__input {
      border-color: var(--accent);
    }
    .scan__btn {
      min-width: 100px;
      min-height: 56px;
      font-size: 16px;
    }
    .scan__feedback {
      min-height: 20px;
    }
    @media (prefers-reduced-motion: reduce) {
      .scan__input { transition: none; }
    }
  `],
})
export class ScanInputComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scanInput') scanInputRef!: ElementRef<HTMLInputElement>;
  @Input() label = 'SCAN BARCODE';
  @Input() placeholder = 'Scan or type barcode...';
  @Input() inputId = 'scan-input';
  @Input() autoFocus = true;
  @Output() scanned = new EventEmitter<string>();

  scanValue = '';
  feedbackState: 'success' | 'error' | null = null;
  feedbackMessage = '';
  private focusInterval: ReturnType<typeof setInterval> | null = null;

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.scanInputRef.nativeElement.focus();
      // Keep focus on the input for barcode scanner wedge mode
      this.focusInterval = setInterval(() => {
        const active = document.activeElement;
        if (active !== this.scanInputRef.nativeElement && !active?.closest('dialog, [role="dialog"]')) {
          this.scanInputRef.nativeElement.focus();
        }
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.focusInterval) {
      clearInterval(this.focusInterval);
    }
  }

  onScan(): void {
    if (!this.scanValue.trim()) return;
    this.scanned.emit(this.scanValue.trim());
    this.scanValue = '';
  }

  showFeedback(state: 'success' | 'error', message: string): void {
    this.feedbackState = state;
    this.feedbackMessage = message;
    // Play audio cue
    this.playBeep(state === 'success');
    setTimeout(() => {
      this.feedbackState = null;
      this.feedbackMessage = '';
    }, 2000);
  }

  private playBeep(success: boolean): void {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = success ? 880 : 220;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + (success ? 0.1 : 0.3));
    } catch {
      // Audio not supported
    }
  }
}
