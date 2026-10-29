export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'acknowledged' | 'partially_received' | 'received' | 'cancelled' | 'closed';
export type ReceiptStatus = 'pending' | 'partial' | 'complete' | 'over_received';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  locationId: string;
  locationName: string;
  status: POStatus;
  items: POItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string | null;
  notes: string;
  createdBy: string;
  createdByName: string;
  approvedBy: string | null;
  approvedByName: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface POItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  totalCost: number;
  receiptStatus: ReceiptStatus;
}

export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  purchaseOrderId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  locationId: string;
  locationName: string;
  items: GoodsReceiptItem[];
  notes: string;
  receivedBy: string;
  receivedByName: string;
  receivedAt: string;
}

export interface GoodsReceiptItem {
  id: string;
  poItemId: string;
  productId: string;
  productSku: string;
  productName: string;
  quantityExpected: number;
  quantityReceived: number;
  quantityDamaged: number;
  quantityShort: number;
  notes: string;
}

export interface ReorderSuggestion {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  locationId: string;
  locationName: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  preferredSupplierId: string;
  preferredSupplierName: string;
  estimatedCost: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  daysUntilStockout: number | null;
}

export interface StatusHistoryEntry {
  id: string;
  status: string;
  changedBy: string;
  changedByName: string;
  changedAt: string;
  notes: string;
}

export interface VendorReturn {
  id: string;
  returnNumber: string;
  purchaseOrderId?: string;
  poNumber?: string;
  supplierId: string;
  supplierName: string;
  locationId: string;
  locationName: string;
  status: 'draft' | 'pending_approval' | 'dispatched' | 'credit_received' | 'rejected';
  reason: 'defective' | 'damaged_in_transit' | 'over_shipment' | 'expired' | 'incorrect_item' | 'recall';
  items: VendorReturnItem[];
  totalCreditExpected: number;
  creditNoteNumber?: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface VendorReturnItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reason: string;
}
