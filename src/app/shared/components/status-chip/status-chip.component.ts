import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusType =
  | 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
  | 'draft' | 'pending' | 'pending_approval' | 'approved' | 'sent' | 'acknowledged'
  | 'partially_received' | 'received' | 'cancelled' | 'closed'
  | 'dispatched' | 'in_transit' | 'in_progress' | 'review' | 'completed'
  | 'confirmed' | 'picking' | 'packing' | 'shipped' | 'delivered' | 'returned'
  | 'active' | 'inactive'
  | 'info' | 'warning' | 'critical'
  | 'low' | 'medium' | 'high';

interface StatusConfig {
  label: string;
  cssClass: string;
  icon: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  in_stock:          { label: 'In Stock',          cssClass: 'chip--success',  icon: '●' },
  low_stock:         { label: 'Low Stock',         cssClass: 'chip--warning',  icon: '▼' },
  out_of_stock:      { label: 'Out of Stock',      cssClass: 'chip--error',    icon: '✕' },
  overstock:         { label: 'Overstock',         cssClass: 'chip--warning',  icon: '▲' },
  draft:             { label: 'Draft',             cssClass: '',               icon: '○' },
  pending:           { label: 'Pending',           cssClass: '',               icon: '○' },
  pending_approval:  { label: 'Pending Approval',  cssClass: 'chip--warning',  icon: '◔' },
  approved:          { label: 'Approved',          cssClass: 'chip--success',  icon: '●' },
  sent:              { label: 'Sent',              cssClass: 'chip--transit',  icon: '→' },
  acknowledged:      { label: 'Acknowledged',      cssClass: 'chip--transit',  icon: '→' },
  partially_received:{ label: 'Partial',           cssClass: 'chip--warning',  icon: '◑' },
  received:          { label: 'Received',          cssClass: 'chip--success',  icon: '●' },
  cancelled:         { label: 'Cancelled',         cssClass: 'chip--error',    icon: '✕' },
  closed:            { label: 'Closed',            cssClass: '',               icon: '■' },
  dispatched:        { label: 'Dispatched',        cssClass: 'chip--transit',  icon: '→' },
  in_transit:        { label: 'In Transit',        cssClass: 'chip--transit',  icon: '→' },
  in_progress:       { label: 'In Progress',       cssClass: 'chip--warning',  icon: '◔' },
  review:            { label: 'Review',            cssClass: 'chip--warning',  icon: '◔' },
  completed:         { label: 'Completed',         cssClass: 'chip--success',  icon: '●' },
  confirmed:         { label: 'Confirmed',         cssClass: 'chip--success',  icon: '●' },
  picking:           { label: 'Picking',           cssClass: 'chip--warning',  icon: '◔' },
  packing:           { label: 'Packing',           cssClass: 'chip--warning',  icon: '◔' },
  shipped:           { label: 'Shipped',           cssClass: 'chip--transit',  icon: '→' },
  delivered:         { label: 'Delivered',         cssClass: 'chip--success',  icon: '●' },
  returned:          { label: 'Returned',          cssClass: 'chip--error',    icon: '↩' },
  active:            { label: 'Active',            cssClass: 'chip--success',  icon: '●' },
  inactive:          { label: 'Inactive',          cssClass: '',               icon: '○' },
  info:              { label: 'Info',              cssClass: '',               icon: '○' },
  warning:           { label: 'Warning',           cssClass: 'chip--warning',  icon: '⚠' },
  critical:          { label: 'Critical',          cssClass: 'chip--error',    icon: '!' },
  low:               { label: 'Low',               cssClass: '',               icon: '○' },
  medium:            { label: 'Medium',            cssClass: 'chip--warning',  icon: '◔' },
  high:              { label: 'High',              cssClass: 'chip--error',    icon: '●' },
};

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="chip" [ngClass]="config.cssClass" [class.chip--technical]="technical">
      <span class="chip__icon" aria-hidden="true">{{ config.icon }}</span>
      <span>{{ config.label }}</span>
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
  `],
})
export class StatusChipComponent {
  @Input() status: string = '';
  @Input() technical = false;

  get config(): StatusConfig {
    return STATUS_MAP[this.status] ?? { label: this.status, cssClass: '', icon: '○' };
  }
}
