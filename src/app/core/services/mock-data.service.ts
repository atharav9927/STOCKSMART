import { Injectable, signal } from '@angular/core';
import {
  Product,
  Category,
  Brand,
  Location,
  StockLevel,
  InventoryMovement,
  Supplier,
  PurchaseOrder,
  StockTransfer,
  StockCount,
  StockAdjustment,
  Order,
  Alert,
  AuditLogEntry,
  ReasonCode,
  ReorderSuggestion,
  User
} from '../models';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  // Reactive Signals for in-memory collections
  readonly locations = signal<Location[]>(this.generateLocations());
  readonly categories = signal<Category[]>(this.generateCategories());
  readonly brands = signal<Brand[]>(this.generateBrands());
  readonly suppliers = signal<Supplier[]>(this.generateSuppliers());
  readonly products = signal<Product[]>(this.generateProducts(520));
  readonly stockLevels = signal<StockLevel[]>([]);
  readonly movements = signal<InventoryMovement[]>([]);
  readonly purchaseOrders = signal<PurchaseOrder[]>([]);
  readonly transfers = signal<StockTransfer[]>([]);
  readonly counts = signal<StockCount[]>([]);
  readonly adjustments = signal<StockAdjustment[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly alerts = signal<Alert[]>([]);
  readonly auditLogs = signal<AuditLogEntry[]>([]);
  readonly reasonCodes = signal<ReasonCode[]>(this.generateReasonCodes());

  // Active selected location for topbar switcher
  readonly selectedLocationId = signal<string>('all');

  constructor() {
    this.initInventoryAndOrders();
    this.initAlerts();
    this.initAuditLogs();
  }

  // Set active location scope
  setSelectedLocation(id: string): void {
    this.selectedLocationId.set(id);
  }

  private generateLocations(): Location[] {
    return [
      {
        id: 'loc-001',
        code: 'WH-CENTRAL',
        name: 'Central Distribution Center',
        type: 'distribution_center',
        address: '100 Logistics Blvd, Dock 4-12',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        isActive: true,
        managerId: 'usr-002',
        managerName: 'James Wilson',
        totalSKUs: 480,
        totalValue: 1845200
      },
      {
        id: 'loc-002',
        code: 'WH-EAST',
        name: 'East Coast Warehouse',
        type: 'warehouse',
        address: '450 Industrial Parkway',
        city: 'Newark',
        state: 'NJ',
        zipCode: '07102',
        country: 'USA',
        isActive: true,
        managerId: 'usr-002',
        managerName: 'James Wilson',
        totalSKUs: 390,
        totalValue: 924300
      },
      {
        id: 'loc-003',
        code: 'STR-DOWNTOWN',
        name: 'Downtown Flagship Store',
        type: 'store',
        address: '742 Michigan Avenue',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60611',
        country: 'USA',
        isActive: true,
        managerId: 'usr-004',
        managerName: 'David Kim',
        totalSKUs: 310,
        totalValue: 342100
      },
      {
        id: 'loc-004',
        code: 'STR-UPTOWN',
        name: 'Uptown Retail Hub',
        type: 'store',
        address: '1220 Broadway',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isActive: true,
        managerId: 'usr-004',
        managerName: 'David Kim',
        totalSKUs: 295,
        totalValue: 289400
      },
      {
        id: 'loc-005',
        code: 'WH-WEST',
        name: 'Pacific Freight Terminal',
        type: 'warehouse',
        address: '880 Harbor Way',
        city: 'Long Beach',
        state: 'CA',
        zipCode: '90802',
        country: 'USA',
        isActive: true,
        managerId: 'usr-002',
        managerName: 'James Wilson',
        totalSKUs: 420,
        totalValue: 1120000
      },
      {
        id: 'loc-006',
        code: 'STR-WESTLAKE',
        name: 'Westlake Galleria Outlet',
        type: 'store',
        address: '400 Pine Street',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA',
        isActive: true,
        managerId: 'usr-004',
        managerName: 'David Kim',
        totalSKUs: 260,
        totalValue: 198000
      }
    ];
  }

  private generateCategories(): Category[] {
    return [
      { id: 'cat-01', name: 'Electronics & Audio', parentId: null, sortOrder: 1, productCount: 160 },
      { id: 'cat-01-1', name: 'Wireless Headphones', parentId: 'cat-01', sortOrder: 1, productCount: 45 },
      { id: 'cat-01-2', name: 'Bluetooth Speakers', parentId: 'cat-01', sortOrder: 2, productCount: 35 },
      { id: 'cat-01-3', name: 'Mobile Cables & Chargers', parentId: 'cat-01', sortOrder: 3, productCount: 80 },
      { id: 'cat-02', name: 'Wearables & Fitness', parentId: null, sortOrder: 2, productCount: 120 },
      { id: 'cat-02-1', name: 'Smartwatches', parentId: 'cat-02', sortOrder: 1, productCount: 50 },
      { id: 'cat-02-2', name: 'Fitness Bands & Straps', parentId: 'cat-02', sortOrder: 2, productCount: 70 },
      { id: 'cat-03', name: 'Smart Home & IoT', parentId: null, sortOrder: 3, productCount: 140 },
      { id: 'cat-03-1', name: 'Smart Sensors', parentId: 'cat-03', sortOrder: 1, productCount: 60 },
      { id: 'cat-03-2', name: 'Connected Lighting', parentId: 'cat-03', sortOrder: 2, productCount: 80 },
      { id: 'cat-04', name: 'Industrial Tools & Scanners', parentId: null, sortOrder: 4, productCount: 100 }
    ];
  }

  private generateBrands(): Brand[] {
    return [
      { id: 'br-01', name: 'Nothing Tech', productCount: 85 },
      { id: 'br-02', name: 'Teenage Engineering', productCount: 42 },
      { id: 'br-03', name: 'Braun Industrial', productCount: 68 },
      { id: 'br-04', name: 'Anker Power', productCount: 110 },
      { id: 'br-05', name: 'Sonos Sound', productCount: 55 },
      { id: 'br-06', name: 'Zebra RFID Systems', productCount: 95 },
      { id: 'br-07', name: 'Honeywell Scanning', productCount: 65 }
    ];
  }

  private generateSuppliers(): Supplier[] {
    return [
      {
        id: 'sup-001',
        code: 'SUP-TE-NORDIC',
        name: 'Teenage Engineering AB',
        contactName: 'Jesper Kouthoofd',
        email: 'orders@teenage.engineering',
        phone: '+46 8 500 00 120',
        address: 'Textilgatan 43',
        city: 'Stockholm',
        state: 'Stockholm',
        zipCode: '120 30',
        country: 'Sweden',
        paymentTerms: 'Net 30',
        leadTimeDays: 7,
        minimumOrder: 5000,
        currency: 'USD',
        rating: 4.9,
        isActive: true,
        productCount: 42,
        totalOrders: 38,
        onTimeDeliveryRate: 98.4,
        qualityRate: 99.8,
        createdAt: '2023-01-10T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z'
      },
      {
        id: 'sup-002',
        code: 'SUP-NOTHING-LDN',
        name: 'Nothing Technology Ltd',
        contactName: 'Carl Pei',
        email: 'b2b-supply@nothing.tech',
        phone: '+44 20 7946 0912',
        address: '80 Cheapside',
        city: 'London',
        state: 'Greater London',
        zipCode: 'EC2V 6EE',
        country: 'UK',
        paymentTerms: 'Net 45',
        leadTimeDays: 10,
        minimumOrder: 10000,
        currency: 'USD',
        rating: 4.8,
        isActive: true,
        productCount: 85,
        totalOrders: 64,
        onTimeDeliveryRate: 95.2,
        qualityRate: 99.1,
        createdAt: '2023-01-12T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      },
      {
        id: 'sup-003',
        code: 'SUP-ZEBRA-CORP',
        name: 'Zebra Technologies Corp',
        contactName: 'Michael Sterling',
        email: 'supply@zebra.com',
        phone: '+1 847 634 6700',
        address: '3 Overlook Point',
        city: 'Lincolnshire',
        state: 'IL',
        zipCode: '60069',
        country: 'USA',
        paymentTerms: 'Net 30',
        leadTimeDays: 4,
        minimumOrder: 2500,
        currency: 'USD',
        rating: 4.7,
        isActive: true,
        productCount: 95,
        totalOrders: 92,
        onTimeDeliveryRate: 97.6,
        qualityRate: 99.4,
        createdAt: '2022-11-01T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z'
      },
      {
        id: 'sup-004',
        code: 'SUP-ANKER-GLOBAL',
        name: 'Anker Innovations Ltd',
        contactName: 'Steven Yang',
        email: 'distribution@anker.com',
        phone: '+1 800 988 7973',
        address: '400 108th Ave NE, Suite 400',
        city: 'Bellevue',
        state: 'WA',
        zipCode: '98004',
        country: 'USA',
        paymentTerms: 'Net 60',
        leadTimeDays: 14,
        minimumOrder: 8000,
        currency: 'USD',
        rating: 4.5,
        isActive: true,
        productCount: 110,
        totalOrders: 115,
        onTimeDeliveryRate: 92.1,
        qualityRate: 98.2,
        createdAt: '2022-09-15T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z'
      },
      {
        id: 'sup-005',
        code: 'SUP-BRAUN-DE',
        name: 'Braun Design & Audio GMBH',
        contactName: 'Klaus Schmidt',
        email: 'b2b@braun-audio.de',
        phone: '+49 6173 30 0',
        address: 'Frankfurter Str. 145',
        city: 'Kronberg',
        state: 'Hesse',
        zipCode: '61476',
        country: 'Germany',
        paymentTerms: 'Net 30',
        leadTimeDays: 12,
        minimumOrder: 4000,
        currency: 'USD',
        rating: 4.8,
        isActive: true,
        productCount: 68,
        totalOrders: 44,
        onTimeDeliveryRate: 96.0,
        qualityRate: 99.7,
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2024-01-04T00:00:00Z'
      }
    ];
  }

  private generateProducts(count: number): Product[] {
    const products: Product[] = [];
    const models = [
      'Ear (2) Transparent White', 'Ear (a) Canary Yellow', 'Phone (2a) Milk White', 'Phone (2) Dark Grey',
      'CMF Watch Pro 2 Orange', 'CMF Buds Pro Matte Black', 'OP-1 Field Synthesizer', 'TP-7 Field Recorder',
      'CM-15 Field Microphone', 'OB-4 Magic Radio', 'Braun LE01 Flagship Smart Speaker', 'Braun LE02 Mid-range Audio',
      'Braun LE03 Compact Wireless', 'Anker 737 GaNPrime 140W', 'Anker MagGo 3-in-1 Charging Station',
      'Zebra TC52x Android Touch Computer', 'Zebra DS3678-ER Rugged 2D Barcode Scanner', 'Zebra ZT411 Industrial RFID Printer',
      'Honeywell Granit 1991i Wireless Scanner', 'Honeywell CK65 Ultra-Rugged Mobile Computer'
    ];

    const cats = ['cat-01-1', 'cat-01-2', 'cat-01-3', 'cat-02-1', 'cat-03-1', 'cat-04'];
    const brands = ['br-01', 'br-02', 'br-03', 'br-04', 'br-05', 'br-06', 'br-07'];

    for (let i = 1; i <= count; i++) {
      const idx = (i - 1) % models.length;
      const baseName = models[idx];
      const skuSuffix = String(i).padStart(4, '0');
      const sku = `SKU-${1000 + i}`;
      const name = i > models.length ? `${baseName} Rev-${Math.floor(i / models.length) + 1} (#${skuSuffix})` : baseName;

      const unitCost = 25 + ((i * 17) % 450);
      const margin = 1.35 + ((i % 15) * 0.02);
      const unitPrice = Math.round(unitCost * margin);

      const reorderPoint = 15 + (i % 40);
      const reorderQuantity = 50 + (i % 150);

      const barcodeCode = `735008${String(100000 + i).slice(0, 6)}`;

      products.push({
        id: `prod-${i}`,
        sku,
        name,
        description: `Precision engineered ${baseName} with industrial high-grade components and low-power telemetry.`,
        categoryId: cats[i % cats.length],
        brandId: brands[i % brands.length],
        unitOfMeasure: 'PCS',
        weight: 0.15 + ((i % 20) * 0.1),
        dimensions: { length: 12, width: 8, height: 4 },
        barcodes: [
          { id: `bc-${i}-1`, code: barcodeCode, type: 'EAN13', isPrimary: true },
          { id: `bc-${i}-2`, code: `RFID-${sku}`, type: 'RFID', isPrimary: false }
        ],
        variants: [
          {
            id: `var-${i}-1`,
            productId: `prod-${i}`,
            sku: `${sku}-BLK`,
            name: 'Matte Black',
            attributes: { color: 'Black' },
            additionalCost: 0,
            additionalPrice: 0,
            isActive: true
          },
          {
            id: `var-${i}-2`,
            productId: `prod-${i}`,
            sku: `${sku}-WHT`,
            name: 'Pure White',
            attributes: { color: 'White' },
            additionalCost: 5,
            additionalPrice: 10,
            isActive: true
          }
        ],
        images: ['assets/products/placeholder.svg'],
        reorderPoint,
        reorderQuantity,
        unitCost,
        unitPrice,
        isActive: i % 40 !== 0,
        createdAt: '2023-06-01T08:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      });
    }

    return products;
  }

  private initInventoryAndOrders(): void {
    const prods = this.products();
    const locs = this.locations();
    const levels: StockLevel[] = [];
    const mvts: InventoryMovement[] = [];

    // Seed stock levels across locations
    prods.slice(0, 200).forEach((product, pIdx) => {
      locs.forEach((loc, lIdx) => {
        // Vary quantities to simulate realistic in_stock, low_stock, out_of_stock
        const factor = (pIdx + lIdx * 7) % 10;
        let onHand = 0;
        let status: StockLevel['status'] = 'in_stock';

        if (factor === 0) {
          onHand = 0;
          status = 'out_of_stock';
        } else if (factor <= 2) {
          onHand = Math.floor(product.reorderPoint * 0.6);
          status = 'low_stock';
        } else if (factor >= 9) {
          onHand = product.reorderPoint * 4;
          status = 'overstock';
        } else {
          onHand = product.reorderPoint + 20 + factor * 8;
          status = 'in_stock';
        }

        const reserved = Math.min(Math.floor(onHand * 0.2), 15);
        const available = Math.max(0, onHand - reserved);
        const inTransit = factor % 3 === 0 ? 25 : 0;

        levels.push({
          id: `sl-${pIdx + 1}-${loc.id}`,
          productId: product.id,
          productSku: product.sku,
          productName: product.name,
          locationId: loc.id,
          locationName: loc.name,
          quantityOnHand: onHand,
          quantityReserved: reserved,
          quantityAvailable: available,
          quantityInTransit: inTransit,
          reorderPoint: product.reorderPoint,
          reorderQuantity: product.reorderQuantity,
          status,
          lastCountDate: '2024-01-10T10:00:00Z',
          lastMovementDate: '2024-01-15T14:20:00Z',
          unitCost: product.unitCost,
          totalValue: onHand * product.unitCost
        });
      });
    });
    this.stockLevels.set(levels);

    // Seed Movements
    for (let i = 1; i <= 60; i++) {
      const p = prods[i % 50];
      const l = locs[i % locs.length];
      const types: InventoryMovement['type'][] = ['receipt', 'sale', 'transfer_in', 'transfer_out', 'adjustment', 'damage'];
      const mType = types[i % types.length];
      const qty = 5 + (i * 3) % 45;
      const prev = 100 + i;
      const next = mType === 'sale' || mType === 'transfer_out' || mType === 'damage' ? prev - qty : prev + qty;

      mvts.push({
        id: `mvt-${i}`,
        type: mType,
        productId: p.id,
        productSku: p.sku,
        productName: p.name,
        locationId: l.id,
        locationName: l.name,
        quantity: qty,
        previousQuantity: prev,
        newQuantity: next,
        unitCost: p.unitCost,
        totalCost: qty * p.unitCost,
        referenceType: mType === 'receipt' ? 'PO' : mType === 'sale' ? 'SO' : 'ADJ',
        referenceId: `REF-2024-${1000 + i}`,
        notes: `Automated scan event on dock bay ${1 + (i % 6)}`,
        createdBy: 'usr-002',
        createdByName: 'James Wilson',
        createdAt: new Date(Date.now() - i * 3600 * 1000 * 4).toISOString()
      });
    }
    this.movements.set(mvts);

    // Seed Purchase Orders
    const pos: PurchaseOrder[] = [
      {
        id: 'po-101',
        poNumber: 'PO-2024-001',
        supplierId: 'sup-002',
        supplierName: 'Nothing Technology Ltd',
        locationId: 'loc-001',
        locationName: 'Central Distribution Center',
        status: 'partially_received',
        items: [
          {
            id: 'poi-1',
            productId: prods[0].id,
            productSku: prods[0].sku,
            productName: prods[0].name,
            quantityOrdered: 200,
            quantityReceived: 150,
            unitCost: prods[0].unitCost,
            totalCost: 200 * prods[0].unitCost,
            receiptStatus: 'partial'
          },
          {
            id: 'poi-2',
            productId: prods[1].id,
            productSku: prods[1].sku,
            productName: prods[1].name,
            quantityOrdered: 100,
            quantityReceived: 100,
            unitCost: prods[1].unitCost,
            totalCost: 100 * prods[1].unitCost,
            receiptStatus: 'complete'
          }
        ],
        subtotal: 42000,
        taxAmount: 3360,
        shippingCost: 850,
        totalAmount: 46210,
        currency: 'USD',
        expectedDeliveryDate: '2024-01-20',
        actualDeliveryDate: null,
        notes: 'Priority air freight — customs cleared',
        createdBy: 'usr-003',
        createdByName: 'Maria Garcia',
        approvedBy: 'usr-001',
        approvedByName: 'Sarah Chen',
        createdAt: '2024-01-08T09:00:00Z',
        updatedAt: '2024-01-14T11:00:00Z',
        statusHistory: [
          { id: 'sh-1', status: 'draft', changedBy: 'usr-003', changedByName: 'Maria Garcia', changedAt: '2024-01-08T09:00:00Z', notes: 'Created order' },
          { id: 'sh-2', status: 'approved', changedBy: 'usr-001', changedByName: 'Sarah Chen', changedAt: '2024-01-09T14:30:00Z', notes: 'Approved within budget' },
          { id: 'sh-3', status: 'partially_received', changedBy: 'usr-002', changedByName: 'James Wilson', changedAt: '2024-01-14T11:00:00Z', notes: 'Received first shipment 250 units' }
        ]
      },
      {
        id: 'po-102',
        poNumber: 'PO-2024-002',
        supplierId: 'sup-001',
        supplierName: 'Teenage Engineering AB',
        locationId: 'loc-002',
        locationName: 'East Coast Warehouse',
        status: 'approved',
        items: [
          {
            id: 'poi-3',
            productId: prods[6].id,
            productSku: prods[6].sku,
            productName: prods[6].name,
            quantityOrdered: 50,
            quantityReceived: 0,
            unitCost: prods[6].unitCost,
            totalCost: 50 * prods[6].unitCost,
            receiptStatus: 'pending'
          }
        ],
        subtotal: 65000,
        taxAmount: 5200,
        shippingCost: 1200,
        totalAmount: 71400,
        currency: 'USD',
        expectedDeliveryDate: '2024-01-28',
        actualDeliveryDate: null,
        notes: 'Secured high-value instruments allocation',
        createdBy: 'usr-003',
        createdByName: 'Maria Garcia',
        approvedBy: 'usr-001',
        approvedByName: 'Sarah Chen',
        createdAt: '2024-01-11T10:00:00Z',
        updatedAt: '2024-01-12T08:00:00Z',
        statusHistory: [
          { id: 'sh-4', status: 'draft', changedBy: 'usr-003', changedByName: 'Maria Garcia', changedAt: '2024-01-11T10:00:00Z', notes: 'Created PO' },
          { id: 'sh-5', status: 'approved', changedBy: 'usr-001', changedByName: 'Sarah Chen', changedAt: '2024-01-12T08:00:00Z', notes: 'Approved' }
        ]
      }
    ];
    this.purchaseOrders.set(pos);

    // Seed Transfers
    const transfers: StockTransfer[] = [
      {
        id: 'tr-01',
        transferNumber: 'TR-2024-010',
        fromLocationId: 'loc-001',
        fromLocationName: 'Central Distribution Center',
        toLocationId: 'loc-003',
        toLocationName: 'Downtown Flagship Store',
        status: 'in_transit',
        items: [
          { id: 'ti-1', productId: prods[0].id, productSku: prods[0].sku, productName: prods[0].name, quantityRequested: 40, quantityDispatched: 40, quantityReceived: 0 },
          { id: 'ti-2', productId: prods[1].id, productSku: prods[1].sku, productName: prods[1].name, quantityRequested: 25, quantityDispatched: 25, quantityReceived: 0 }
        ],
        notes: 'Replenishing store inventory before weekend launch',
        requestedBy: 'usr-004',
        requestedByName: 'David Kim',
        approvedBy: 'usr-002',
        approvedByName: 'James Wilson',
        dispatchedAt: '2024-01-15T06:30:00Z',
        receivedAt: null,
        createdAt: '2024-01-14T11:00:00Z',
        updatedAt: '2024-01-15T06:30:00Z'
      }
    ];
    this.transfers.set(transfers);

    // Seed Stock Counts
    const counts: StockCount[] = [
      {
        id: 'cnt-01',
        countNumber: 'CNT-2024-004',
        locationId: 'loc-003',
        locationName: 'Downtown Flagship Store',
        status: 'in_progress',
        type: 'cycle',
        items: [
          { id: 'ci-1', productId: prods[0].id, productSku: prods[0].sku, productName: prods[0].name, expectedQuantity: 45, countedQuantity: 45, variance: 0, variancePercent: 0, status: 'counted', countedAt: '2024-01-15T08:30:00Z', countedBy: 'David Kim' },
          { id: 'ci-2', productId: prods[1].id, productSku: prods[1].sku, productName: prods[1].name, expectedQuantity: 28, countedQuantity: 26, variance: -2, variancePercent: -7.1, status: 'counted', countedAt: '2024-01-15T08:45:00Z', countedBy: 'David Kim' },
          { id: 'ci-3', productId: prods[2].id, productSku: prods[2].sku, productName: prods[2].name, expectedQuantity: 15, countedQuantity: null, variance: null, variancePercent: null, status: 'pending', countedAt: null, countedBy: null }
        ],
        totalItems: 3,
        countedItems: 2,
        varianceItems: 1,
        startedAt: '2024-01-15T08:00:00Z',
        completedAt: null,
        createdBy: 'usr-004',
        createdByName: 'David Kim'
      }
    ];
    this.counts.set(counts);

    // Seed Orders
    const ordersList: Order[] = [
      {
        id: 'ord-01',
        orderNumber: 'ORD-89421',
        customerName: 'Marcus Vance',
        customerEmail: 'm.vance@techcorp.io',
        customerPhone: '+1 312 555 0192',
        shippingAddress: '400 N Michigan Ave Ste 1200, Chicago, IL 60611',
        billingAddress: '400 N Michigan Ave Ste 1200, Chicago, IL 60611',
        locationId: 'loc-001',
        locationName: 'Central Distribution Center',
        status: 'picking',
        items: [
          { id: 'oi-1', productId: prods[0].id, productSku: prods[0].sku, productName: prods[0].name, quantity: 2, unitPrice: prods[0].unitPrice, totalPrice: 2 * prods[0].unitPrice, fulfilmentStatus: 'picking' },
          { id: 'oi-2', productId: prods[1].id, productSku: prods[1].sku, productName: prods[1].name, quantity: 1, unitPrice: prods[1].unitPrice, totalPrice: prods[1].unitPrice, fulfilmentStatus: 'picked' }
        ],
        subtotal: 480,
        taxAmount: 43.2,
        shippingCost: 15,
        discount: 0,
        totalAmount: 538.2,
        currency: 'USD',
        notes: 'Handheld scanner verification required before dispatch',
        createdAt: '2024-01-15T08:15:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
        shippedAt: null,
        deliveredAt: null,
        statusHistory: [
          { id: 'osh-1', status: 'confirmed', changedBy: 'system', changedByName: 'E-commerce API', changedAt: '2024-01-15T08:15:00Z', notes: 'Payment authorized' },
          { id: 'osh-2', status: 'picking', changedBy: 'usr-004', changedByName: 'David Kim', changedAt: '2024-01-15T09:00:00Z', notes: 'Pick wave generated' }
        ]
      }
    ];
    this.orders.set(ordersList);
  }

  private initAlerts(): void {
    this.alerts.set([
      {
        id: 'alt-01',
        title: 'Critical Stockout Risk',
        message: 'Phone (2a) Milk White reached 0 available units at Downtown Flagship Store.',
        severity: 'critical',
        category: 'stock',
        isRead: false,
        isDismissed: false,
        actionUrl: '/inventory/transfers',
        actionLabel: 'CREATE TRANSFER',
        relatedEntityType: 'Product',
        relatedEntityId: 'prod-3',
        createdAt: '2024-01-15T09:12:00Z'
      },
      {
        id: 'alt-02',
        title: 'Count Discrepancy Flagged',
        message: 'Variance of -2 units detected in Cycle Count CNT-2024-004.',
        severity: 'warning',
        category: 'count',
        isRead: false,
        isDismissed: false,
        actionUrl: '/inventory/counts',
        actionLabel: 'REVIEW VARIANCE',
        relatedEntityType: 'StockCount',
        relatedEntityId: 'cnt-01',
        createdAt: '2024-01-15T08:46:00Z'
      },
      {
        id: 'alt-03',
        title: 'Delayed PO Delivery',
        message: 'PO-2024-001 shipment #2 estimated delay by 24h due to winter storm.',
        severity: 'info',
        category: 'procurement',
        isRead: true,
        isDismissed: false,
        actionUrl: '/procurement/orders',
        actionLabel: 'VIEW PO',
        relatedEntityType: 'PurchaseOrder',
        relatedEntityId: 'po-101',
        createdAt: '2024-01-14T17:30:00Z'
      }
    ]);
  }

  private initAuditLogs(): void {
    this.auditLogs.set([
      {
        id: 'aud-01',
        entityType: 'Product',
        entityId: 'prod-1',
        entityName: 'Ear (2) Transparent White',
        action: 'update',
        changes: [{ field: 'unitPrice', before: '$149', after: '$159' }],
        performedBy: 'usr-001',
        performedByName: 'Sarah Chen',
        performedAt: '2024-01-15T09:20:00Z',
        ipAddress: '192.168.1.104'
      },
      {
        id: 'aud-02',
        entityType: 'StockAdjustment',
        entityId: 'adj-04',
        entityName: 'ADJ-2024-089',
        action: 'create',
        changes: [{ field: 'quantityChange', before: '0', after: '-3' }],
        performedBy: 'usr-002',
        performedByName: 'James Wilson',
        performedAt: '2024-01-14T16:05:00Z',
        ipAddress: '192.168.1.52'
      }
    ]);
  }

  private generateReasonCodes(): ReasonCode[] {
    return [
      { id: 'rc-1', code: 'DMG-TRANSIT', description: 'Damaged in transit / carrier handling', category: 'damage', isActive: true, sortOrder: 1 },
      { id: 'rc-2', code: 'DMG-WATER', description: 'Water or environmental warehouse damage', category: 'damage', isActive: true, sortOrder: 2 },
      { id: 'rc-3', code: 'EXP-SHELF', description: 'Past recommended shelf life / battery degradation', category: 'write_off', isActive: true, sortOrder: 3 },
      { id: 'rc-4', code: 'CNT-CORR', description: 'Cycle count physical reconciliation', category: 'adjustment', isActive: true, sortOrder: 4 },
      { id: 'rc-5', code: 'RET-DEFECT', description: 'Customer return defective hardware', category: 'return', isActive: true, sortOrder: 5 },
      { id: 'rc-6', code: 'RET-WRONG', description: 'Customer received incorrect variant', category: 'return', isActive: true, sortOrder: 6 }
    ];
  }

  // Lookup helper for scan & quick identification
  lookupBarcode(code: string): { product: Product; stock: StockLevel[] } | null {
    const trimmed = code.trim().toLowerCase();
    const product = this.products().find(p =>
      p.sku.toLowerCase() === trimmed ||
      p.barcodes.some(b => b.code.toLowerCase() === trimmed)
    );

    if (!product) return null;

    const stock = this.stockLevels().filter(s => s.productId === product.id);
    return { product, stock };
  }
}
