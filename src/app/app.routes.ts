import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shell/app-shell.component').then(m => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'dashboard/location/:id',
        loadComponent: () =>
          import('./features/dashboard/location-dashboard/location-dashboard.component').then(m => m.LocationDashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/auth/profile/profile.component').then(m => m.ProfileComponent),
      },
      // Catalog
      {
        path: 'catalog',
        children: [
          { path: '', redirectTo: 'products', pathMatch: 'full' },
          {
            path: 'products',
            loadComponent: () =>
              import('./features/catalog/product-list/product-list.component').then(m => m.ProductListComponent),
          },
          {
            path: 'products/new',
            loadComponent: () =>
              import('./features/catalog/product-form/product-form.component').then(m => m.ProductFormComponent),
          },
          {
            path: 'products/:id',
            loadComponent: () =>
              import('./features/catalog/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
          },
          {
            path: 'products/:id/edit',
            loadComponent: () =>
              import('./features/catalog/product-form/product-form.component').then(m => m.ProductFormComponent),
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./features/catalog/category-tree/category-tree.component').then(m => m.CategoryTreeComponent),
          },
          {
            path: 'brands',
            loadComponent: () =>
              import('./features/catalog/brand-list/brand-list.component').then(m => m.BrandListComponent),
          },
          {
            path: 'import',
            loadComponent: () =>
              import('./features/catalog/import/catalog-import.component').then(m => m.CatalogImportComponent),
          },
          {
            path: 'labels',
            loadComponent: () =>
              import('./features/catalog/labels/catalog-labels.component').then(m => m.CatalogLabelsComponent),
          },
        ],
      },
      // Inventory
      {
        path: 'inventory',
        canActivate: [roleGuard('admin', 'inventory_manager', 'store_clerk')],
        children: [
          { path: '', redirectTo: 'stock', pathMatch: 'full' },
          {
            path: 'stock',
            loadComponent: () =>
              import('./features/inventory/stock-matrix/stock-matrix.component').then(m => m.StockMatrixComponent),
          },
          {
            path: 'locations',
            loadComponent: () =>
              import('./features/inventory/location-list/location-list.component').then(m => m.LocationListComponent),
          },
          {
            path: 'locations/:id',
            loadComponent: () =>
              import('./features/inventory/location-detail/location-detail.component').then(m => m.LocationDetailComponent),
          },
          {
            path: 'movements',
            loadComponent: () =>
              import('./features/inventory/movement-ledger/movement-ledger.component').then(m => m.MovementLedgerComponent),
          },
          {
            path: 'adjustments',
            loadComponent: () =>
              import('./features/inventory/adjustment-form/adjustment-form.component').then(m => m.AdjustmentFormComponent),
          },
          {
            path: 'transfers',
            loadComponent: () =>
              import('./features/inventory/transfer-list/transfer-list.component').then(m => m.TransferListComponent),
          },
          {
            path: 'transfers/:id',
            loadComponent: () =>
              import('./features/inventory/transfer-detail/transfer-detail.component').then(m => m.TransferDetailComponent),
          },
          {
            path: 'counts',
            loadComponent: () =>
              import('./features/inventory/count-list/count-list.component').then(m => m.CountListComponent),
          },
          {
            path: 'counts/:id',
            loadComponent: () =>
              import('./features/inventory/count-session/count-session.component').then(m => m.CountSessionComponent),
          },
          {
            path: 'dead-stock',
            loadComponent: () =>
              import('./features/inventory/dead-stock/dead-stock.component').then(m => m.DeadStockComponent),
          },
        ],
      },
      // Procurement
      {
        path: 'procurement',
        canActivate: [roleGuard('admin', 'inventory_manager', 'buyer')],
        children: [
          { path: '', redirectTo: 'orders', pathMatch: 'full' },
          {
            path: 'orders',
            loadComponent: () =>
              import('./features/procurement/po-list/po-list.component').then(m => m.PoListComponent),
          },
          {
            path: 'orders/new',
            loadComponent: () =>
              import('./features/procurement/po-form/po-form.component').then(m => m.PoFormComponent),
          },
          {
            path: 'orders/:id',
            loadComponent: () =>
              import('./features/procurement/po-detail/po-detail.component').then(m => m.PoDetailComponent),
          },
          {
            path: 'orders/:id/receive',
            loadComponent: () =>
              import('./features/procurement/goods-receipt/goods-receipt.component').then(m => m.GoodsReceiptComponent),
          },
          {
            path: 'suggestions',
            loadComponent: () =>
              import('./features/procurement/suggestions/suggestions.component').then(m => m.SuggestionsComponent),
          },
          {
            path: 'rules',
            loadComponent: () =>
              import('./features/procurement/rules/procurement-rules.component').then(m => m.ProcurementRulesComponent),
          },
          {
            path: 'returns',
            loadComponent: () =>
              import('./features/procurement/returns/procurement-returns.component').then(m => m.ProcurementReturnsComponent),
          },
        ],
      },
      // Suppliers
      {
        path: 'suppliers',
        canActivate: [roleGuard('admin', 'inventory_manager', 'buyer')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/suppliers/supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
          },
          {
            path: 'compare',
            loadComponent: () =>
              import('./features/suppliers/compare/supplier-compare.component').then(m => m.SupplierCompareComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/suppliers/supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent),
          },
        ],
      },
      // Orders & Fulfilment
      {
        path: 'orders',
        canActivate: [roleGuard('admin', 'inventory_manager', 'store_clerk')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent),
          },
          {
            path: 'returns',
            loadComponent: () =>
              import('./features/orders/returns/order-returns.component').then(m => m.OrderReturnsComponent),
          },
          {
            path: 'pos-sim',
            loadComponent: () =>
              import('./features/orders/pos-sim/pos-simulator.component').then(m => m.PosSimulatorComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
          },
          {
            path: ':id/fulfil',
            loadComponent: () =>
              import('./features/orders/fulfilment/order-fulfilment.component').then(m => m.OrderFulfilmentComponent),
          },
        ],
      },
      // Scanning
      {
        path: 'scan',
        loadComponent: () =>
          import('./features/scan/scan-lookup/scan-lookup.component').then(m => m.ScanLookupComponent),
      },
      // Identification
      {
        path: 'identification',
        children: [
          { path: '', redirectTo: 'barcodes', pathMatch: 'full' },
          {
            path: 'barcodes',
            loadComponent: () =>
              import('./features/identification/barcode-list/barcode-list.component').then(m => m.BarcodeListComponent),
          },
          {
            path: 'rfid',
            loadComponent: () =>
              import('./features/identification/rfid-simulator/rfid-simulator.component').then(m => m.RfidSimulatorComponent),
          },
        ],
      },
      // Reports
      {
        path: 'reports',
        canActivate: [roleGuard('admin', 'inventory_manager', 'buyer')],
        children: [
          { path: '', redirectTo: 'kpis', pathMatch: 'full' },
          {
            path: 'kpis',
            loadComponent: () =>
              import('./features/reports/kpi-report/kpi-report.component').then(m => m.KpiReportComponent),
          },
          {
            path: 'valuation',
            loadComponent: () =>
              import('./features/reports/valuation-report/valuation-report.component').then(m => m.ValuationReportComponent),
          },
          {
            path: 'stockouts',
            loadComponent: () =>
              import('./features/reports/stockout-report/stockout-report.component').then(m => m.StockoutReportComponent),
          },
          {
            path: 'abc',
            loadComponent: () =>
              import('./features/reports/abc-analysis/abc-analysis.component').then(m => m.AbcAnalysisComponent),
          },
          {
            path: 'shrinkage',
            loadComponent: () =>
              import('./features/reports/shrinkage-report/shrinkage-report.component').then(m => m.ShrinkageReportComponent),
          },
        ],
      },
      // Alerts
      {
        path: 'alerts',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/alerts/alert-center/alert-center.component').then(m => m.AlertCenterComponent),
          },
          {
            path: 'rules',
            loadComponent: () =>
              import('./features/alerts/alert-rules/alert-rules.component').then(m => m.AlertRulesComponent),
          },
        ],
      },
      // Admin
      {
        path: 'admin',
        canActivate: [roleGuard('admin')],
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          {
            path: 'users',
            loadComponent: () =>
              import('./features/admin/user-list/user-list.component').then(m => m.UserListComponent),
          },
          {
            path: 'audit',
            loadComponent: () =>
              import('./features/admin/audit-log/audit-log.component').then(m => m.AuditLogComponent),
          },
          {
            path: 'reason-codes',
            loadComponent: () =>
              import('./features/admin/reason-codes/reason-codes.component').then(m => m.ReasonCodesComponent),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/admin/system-settings/system-settings.component').then(m => m.SystemSettingsComponent),
          },
          {
            path: 'roles',
            loadComponent: () =>
              import('./features/admin/roles/admin-roles.component').then(m => m.AdminRolesComponent),
          },
          {
            path: 'data',
            loadComponent: () =>
              import('./features/admin/data/admin-data.component').then(m => m.AdminDataComponent),
          },
        ],
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./features/auth/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/auth/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
