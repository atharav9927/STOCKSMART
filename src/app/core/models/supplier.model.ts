export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  paymentTerms: string;
  leadTimeDays: number;
  minimumOrder: number;
  currency: string;
  rating: number;
  isActive: boolean;
  productCount: number;
  totalOrders: number;
  onTimeDeliveryRate: number;
  qualityRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  productId: string;
  productSku: string;
  productName: string;
  supplierSku: string;
  unitCost: number;
  minOrderQuantity: number;
  leadTimeDays: number;
  isPreferred: boolean;
  lastOrderDate: string | null;
}
