export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  unitOfMeasure: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  barcodes: Barcode[];
  variants: ProductVariant[];
  images: string[];
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  unitPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  barcode?: string;
  additionalCost: number;
  additionalPrice: number;
  isActive: boolean;
}

export interface Barcode {
  id: string;
  code: string;
  type: 'EAN13' | 'EAN8' | 'UPC_A' | 'CODE128' | 'QR' | 'RFID';
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  sortOrder: number;
  productCount: number;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  productCount: number;
}
