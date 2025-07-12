export type NotificationType = "summary" | "platform" | "group" | "system" | "summary-ready" | "while-away" | "scheduled-digest"

export interface NotificationBase {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export interface NotificationBellProps {
  initialNotifications?: NotificationBase[]
  onNotificationClick?: (notificationId: string) => void
  onMarkAllAsRead?: () => void
  onClearAll?: () => void
}

export interface NotificationsPageProps {
  onMarkAsRead?: (id: string) => void
  onDeleteNotification?: (id: string) => void
}
