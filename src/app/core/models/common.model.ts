export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, string | string[] | number | boolean>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface Breadcrumb {
  label: string;
  url?: string;
  icon?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'boolean';
  width?: string;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
  sticky?: boolean;
  format?: (value: unknown, row: unknown) => string;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  changePercent: number;
  changeDirection: 'up' | 'down' | 'flat';
  format: 'number' | 'currency' | 'percent';
  icon: string;
  trend: number[];
}

export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  action: 'create' | 'update' | 'delete';
  changes: { field: string; before: string; after: string }[];
  performedBy: string;
  performedByName: string;
  performedAt: string;
  ipAddress: string;
}

export interface ReasonCode {
  id: string;
  code: string;
  description: string;
  category: 'adjustment' | 'return' | 'damage' | 'transfer' | 'write_off';
  isActive: boolean;
  sortOrder: number;
}
