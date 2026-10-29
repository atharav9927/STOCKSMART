import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserMultiFormatReader } from '@zxing/browser';

@Component({
  selector: 'app-scan-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="scan" [class.scan--success]="feedbackState === 'success'" [class.scan--error]="feedbackState === 'error'">
      <div class="scan__header">
        <label class="text-label scan__label" [for]="inputId">{{ label }}</label>
        <button
          type="button"
          class="btn btn--outline btn--sm scan__camera-toggle"
          (click)="toggleCamera()"
          [attr.aria-expanded]="showCamera"
        >
          {{ showCamera ? '[✕ CLOSE CAMERA]' : '[📷 CAMERA SCAN]' }}
        </button>
      </div>

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

      <!-- ZXing Camera Live Video Viewfinder Overlay -->
      @if (showCamera) {
        <div class="camera-modal">
          <div class="camera-modal__panel">
            <div class="camera-modal__header">
              <span class="text-label text-display">CAMERA BARCODE SCANNER (ZXING)</span>
              <button type="button" class="btn btn--ghost btn--sm" (click)="stopCamera()">✕</button>
            </div>

            <div class="camera-viewport">
              <video #videoElement class="camera-viewport__video" autoplay playsinline muted></video>
              <div class="camera-viewport__overlay">
                <div class="camera-viewport__reticle">
                  <div class="reticle-corner top-left"></div>
                  <div class="reticle-corner top-right"></div>
                  <div class="reticle-corner bottom-left"></div>
                  <div class="reticle-corner bottom-right"></div>
                  <div class="reticle-laser"></div>
                </div>
              </div>
            </div>

            <div class="camera-modal__footer">
              <span class="text-caption text-secondary">
                Align barcode / QR within frame. Auto-detects in real time.
              </span>
              @if (cameraError) {
                <span class="text-caption text-error">[{{ cameraError }}]</span>
              }
              <button type="button" class="btn btn--outline btn--sm" (click)="stopCamera()">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .scan {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .scan__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .scan__label {
      color: var(--text-secondary);
    }
    .scan__camera-toggle {
      font-size: 11px;
      letter-spacing: 0.05em;
      padding: 4px 10px;
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

    /* Live Video Modal Viewport */
    .camera-modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
    }
    .camera-modal__panel {
      width: 100%;
      max-width: 500px;
      background: var(--surface);
      border: 1px solid var(--border-visible);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .camera-modal__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md);
      border-bottom: 1px solid var(--border);
    }
    .camera-viewport {
      position: relative;
      width: 100%;
      height: 320px;
      background: #000000;
      overflow: hidden;
    }
    .camera-viewport__video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .camera-viewport__overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .camera-viewport__reticle {
      position: relative;
      width: 260px;
      height: 160px;
    }
    .reticle-corner {
      position: absolute;
      width: 24px;
      height: 24px;
      border-color: var(--text-display);
      border-style: solid;
    }
    .reticle-corner.top-left {
      top: 0;
      left: 0;
      border-width: 3px 0 0 3px;
    }
    .reticle-corner.top-right {
      top: 0;
      right: 0;
      border-width: 3px 3px 0 0;
    }
    .reticle-corner.bottom-left {
      bottom: 0;
      left: 0;
      border-width: 0 0 3px 3px;
    }
    .reticle-corner.bottom-right {
      bottom: 0;
      right: 0;
      border-width: 0 3px 3px 0;
    }
    .reticle-laser {
      position: absolute;
      top: 50%;
      left: 10%;
      right: 10%;
      height: 2px;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
      animation: laserScan 2s infinite ease-in-out;
    }
    @keyframes laserScan {
      0%, 100% { transform: translateY(-60px); opacity: 0.8; }
      50% { transform: translateY(60px); opacity: 1; }
    }
    .camera-modal__footer {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      padding: var(--space-md);
      border-top: 1px solid var(--border);
    }
    @media (prefers-reduced-motion: reduce) {
      .scan__input { transition: none; }
      .reticle-laser { animation: none; }
    }
  `],
})
export class ScanInputComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scanInput') scanInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('videoElement') videoElementRef?: ElementRef<HTMLVideoElement>;

  @Input() label = 'SCAN BARCODE';
  @Input() placeholder = 'Scan or type barcode...';
  @Input() inputId = 'scan-input';
  @Input() autoFocus = true;
  @Output() scanned = new EventEmitter<string>();

  scanValue = '';
  feedbackState: 'success' | 'error' | null = null;
  feedbackMessage = '';
  showCamera = false;
  cameraError: string | null = null;

  private focusInterval: ReturnType<typeof setInterval> | null = null;
  private codeReader: BrowserMultiFormatReader | null = null;
  private activeControls: any = null;

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.scanInputRef?.nativeElement?.focus();
      this.focusInterval = setInterval(() => {
        if (this.showCamera) return;
        const active = document.activeElement;
        if (active !== this.scanInputRef?.nativeElement && !active?.closest('dialog, [role="dialog"], .camera-modal')) {
          this.scanInputRef?.nativeElement?.focus();
        }
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.focusInterval) {
      clearInterval(this.focusInterval);
    }
    this.stopCamera();
  }

  onScan(): void {
    if (!this.scanValue.trim()) return;
    this.scanned.emit(this.scanValue.trim());
    this.scanValue = '';
  }

  async toggleCamera(): Promise<void> {
    if (this.showCamera) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera(): Promise<void> {
    this.showCamera = true;
    this.cameraError = null;

    setTimeout(async () => {
      try {
        if (!this.codeReader) {
          this.codeReader = new BrowserMultiFormatReader();
        }

        const videoEl = this.videoElementRef?.nativeElement;
        if (!videoEl) {
          throw new Error('Video preview initialization failed');
        }

        this.activeControls = await this.codeReader.decodeFromVideoDevice(
          undefined, // Default / environmental camera
          videoEl,
          (result, error) => {
            if (result) {
              const text = result.getText();
              if (text) {
                this.playBeep(true);
                this.scanned.emit(text.trim());
                this.stopCamera();
              }
            }
          }
        );
      } catch (err: any) {
        this.cameraError = err?.message || 'Camera permission denied or device not found';
      }
    }, 150);
  }

  stopCamera(): void {
    if (this.activeControls) {
      try {
        this.activeControls.stop();
      } catch {}
      this.activeControls = null;
    }
    this.showCamera = false;
    this.cameraError = null;
    setTimeout(() => {
      this.scanInputRef?.nativeElement?.focus();
    }, 100);
  }

  showFeedback(state: 'success' | 'error', message: string): void {
    this.feedbackState = state;
    this.feedbackMessage = message;
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
    } catch {}
  }
}
