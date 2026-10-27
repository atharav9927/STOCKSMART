import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + width + ' ' + height"
      [attr.width]="width"
      [attr.height]="height"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="ariaLabel"
    >
      <polyline
        [attr.points]="points()"
        fill="none"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      line-height: 0;
    }
  `],
})
export class SparklineComponent {
  @Input() data: number[] = [];
  @Input() width = 80;
  @Input() height = 24;
  @Input() color = 'var(--text-secondary)';
  @Input() ariaLabel = 'Trend line';

  points = computed(() => {
    if (this.data.length === 0) return '';
    const max = Math.max(...this.data);
    const min = Math.min(...this.data);
    const range = max - min || 1;
    const stepX = this.width / (this.data.length - 1 || 1);
    return this.data
      .map((v, i) => `${i * stepX},${this.height - ((v - min) / range) * (this.height - 4) - 2}`)
      .join(' ');
  });
}
