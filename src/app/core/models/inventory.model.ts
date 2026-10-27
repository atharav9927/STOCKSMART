export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
export type MovementType = 'receipt' | 'sale' | 'transfer_in' | 'transfer_out' | 'adjustment' | 'return' | 'count' | 'damage';
export type TransferStatus = 'draft' | 'pending_approval' | 'approved' | 'dispatched' | 'in_transit' | 'received' | 'cancelled';
export type CountStatus = 'draft' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export type AdjustmentReason = 'damage' | 'theft' | 'expiry' | 'found' | 'correction' | 'write_off' | 'other';

export interface StockLevel {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  locationId: string;
  locationName: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  quantityInTransit: number;
  reorderPoint: number;
  reorderQuantity: number;
  status: StockStatus;
  lastCountDate: string | null;
  lastMovementDate: string;
  unitCost: number;
  totalValue: number;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  type: 'warehouse' | 'store' | 'distribution_center';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isActive: boolean;
  managerId: string;
  managerName: string;
  totalSKUs: number;
  totalValue: number;
}

export interface InventoryMovement {
  id: string;
  type: MovementType;
  productId: string;
  productSku: string;
  productName: string;
  locationId: string;
  locationName: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unitCost: number;
  totalCost: number;
  referenceType: string;
  referenceId: string;
  notes: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  status: TransferStatus;
  items: TransferItem[];
  notes: string;
  requestedBy: string;
  requestedByName: string;
  approvedBy: string | null;
  approvedByName: string | null;
  dispatchedAt: string | null;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransferItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantityRequested: number;
  quantityDispatched: number;
  quantityReceived: number;
}

export interface StockCount {
  id: string;
  countNumber: string;
  locationId: string;
  locationName: string;
  status: CountStatus;
  type: 'full' | 'cycle' | 'spot';
  items: CountItem[];
  totalItems: number;
  countedItems: number;
  varianceItems: number;
  startedAt: string;
  completedAt: string | null;
  createdBy: string;
  createdByName: string;
}

export interface CountItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  expectedQuantity: number;
  countedQuantity: number | null;
  variance: number | null;
  variancePercent: number | null;
  status: 'pending' | 'counted' | 'recounted' | 'accepted' | 'adjusted';
  countedAt: string | null;
  countedBy: string | null;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  locationId: string;
  locationName: string;
  productId: string;
  productSku: string;
  productName: string;
  reason: AdjustmentReason;
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  unitCost: number;
  totalCostImpact: number;
  notes: string;
  createdBy: string;
  createdByName: string;
  approvedBy: string | null;
  createdAt: string;
}
