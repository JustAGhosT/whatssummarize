export type NotificationType = 'summary-ready' | 'while-away' | 'scheduled-digest' | 'system';

export interface NotificationBase {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationsPageProps {
  onMarkAsRead?: (id: string) => Promise<void>;
  onDeleteNotification?: (id: string) => Promise<void>;
}