import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole, LoginRequest, LoginResponse, JwtPayload, ROLE_HIERARCHY } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'stocksmart_token';
  private readonly userKey = 'stocksmart_user';

  private currentUserSignal = signal<User | null>(this.loadStoredUser());
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);
  readonly userName = computed(() => {
    const u = this.currentUserSignal();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
  readonly userInitials = computed(() => {
    const u = this.currentUserSignal();
    return u ? `${u.firstName[0]}${u.lastName[0]}` : '';
  });

  constructor(private router: Router) {}

  login(request: LoginRequest): Promise<LoginResponse> {
    // Mock login - accepts any email with password "password"
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockUsers = this.getMockUsers();
        const user = mockUsers.find(u => u.email === request.email);

        if (user && request.password === 'password') {
          const token = this.generateMockToken(user);
          const response: LoginResponse = {
            token,
            refreshToken: 'mock-refresh-token',
            user,
          };

          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.currentUserSignal.set(user);
          resolve(response);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 600);
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(...roles: UserRole[]): boolean {
    const currentRole = this.userRole();
    if (!currentRole) return false;
    return roles.includes(currentRole);
  }

  hasMinRole(minRole: UserRole): boolean {
    const currentRole = this.userRole();
    if (!currentRole) return false;
    return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[minRole];
  }

  isLocationAllowed(locationId: string): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'inventory_manager') return true;
    return user.assignedLocationIds.includes(locationId);
  }

  private loadStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.userKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private generateMockToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      locationIds: user.assignedLocationIds,
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    };
    return btoa(JSON.stringify(payload));
  }

  private getMockUsers(): User[] {
    return [
      {
        id: 'usr-001',
        email: 'admin@stocksmart.io',
        firstName: 'Sarah',
        lastName: 'Chen',
        role: 'admin',
        assignedLocationIds: [],
        isActive: true,
        lastLogin: '2024-01-15T09:30:00Z',
        createdAt: '2023-01-01T00:00:00Z',
      },
      {
        id: 'usr-002',
        email: 'manager@stocksmart.io',
        firstName: 'James',
        lastName: 'Wilson',
        role: 'inventory_manager',
        assignedLocationIds: [],
        isActive: true,
        lastLogin: '2024-01-15T08:00:00Z',
        createdAt: '2023-02-15T00:00:00Z',
      },
      {
        id: 'usr-003',
        email: 'buyer@stocksmart.io',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'buyer',
        assignedLocationIds: [],
        isActive: true,
        lastLogin: '2024-01-15T10:00:00Z',
        createdAt: '2023-03-01T00:00:00Z',
      },
      {
        id: 'usr-004',
        email: 'clerk@stocksmart.io',
        firstName: 'David',
        lastName: 'Kim',
        role: 'store_clerk',
        assignedLocationIds: ['loc-001', 'loc-002'],
        isActive: true,
        lastLogin: '2024-01-15T07:00:00Z',
        createdAt: '2023-04-01T00:00:00Z',
      },
      {
        id: 'usr-005',
        email: 'viewer@stocksmart.io',
        firstName: 'Emma',
        lastName: 'Thompson',
        role: 'viewer',
        assignedLocationIds: [],
        isActive: true,
        lastLogin: '2024-01-14T16:00:00Z',
        createdAt: '2023-05-01T00:00:00Z',
      },
    ];
  }
}
