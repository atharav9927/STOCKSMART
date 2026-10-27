import { StatusHistoryEntry } from './procurement.model';

export type OrderStatus = 'pending' | 'confirmed' | 'picking' | 'packing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type FulfilmentStatus = 'pending' | 'picking' | 'picked' | 'packing' | 'packed' | 'shipped';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  billingAddress: string;
  locationId: string;
  locationName: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  currency: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  statusHistory: StatusHistoryEntry[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fulfilmentStatus: FulfilmentStatus;
}
