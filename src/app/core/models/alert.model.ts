export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertCategory = 'stock' | 'order' | 'procurement' | 'system' | 'count';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  isRead: boolean;
  isDismissed: boolean;
  actionUrl: string | null;
  actionLabel: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  isActive: boolean;
  conditions: Record<string, unknown>;
  notifyRoles: string[];
  createdBy: string;
  createdAt: string;
}
