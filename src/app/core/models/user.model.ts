export type UserRole = 'admin' | 'inventory_manager' | 'buyer' | 'store_clerk' | 'viewer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  assignedLocationIds: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  locationIds: string[];
  exp: number;
  iat: number;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  inventory_manager: 'Inventory Manager',
  buyer: 'Buyer',
  store_clerk: 'Store Clerk',
  viewer: 'Viewer',
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  inventory_manager: 80,
  buyer: 60,
  store_clerk: 40,
  viewer: 20,
};
