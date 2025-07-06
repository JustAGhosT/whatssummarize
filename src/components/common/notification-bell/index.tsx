"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./notification-bell.module.css"

interface Notification {
  id: string
  type: "summary" | "platform" | "group" | "system"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "summary",
    title: "Weekly Summary Ready",
    message: "Your personal weekly summary for Jan 8-14 is ready to view",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    actionUrl: "/personal/summary/1",
  },
  {
    id: "2",
    type: "platform",
    title: "New Messages in Slack",
    message: "23 new messages in Work Team #general since last read",
    timestamp: "2024-01-15T09:15:00Z",
    isRead: false,
    actionUrl: "/distribution/slack",
  },
  {
    id: "3",
    type: "group",
    title: "Cross-Platform Group Update",
    message: "Work Communications group has 15 unread messages",
    timestamp: "2024-01-15T08:45:00Z",
    isRead: true,
    actionUrl: "/cross-platform-groups/work",
  },
  {
    id: "4",
    type: "system",
    title: "Integration Connected",
    message: "Discord integration successfully connected",
    timestamp: "2024-01-14T16:20:00Z",
    isRead: true,
  },
]

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    setIsOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "summary":
        return "📊"
      case "platform":
        return "💬"
      case "group":
        return "👥"
      case "system":
        return "⚙️"
      default:
        return "🔔"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.bellButton}
        title="Notifications"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className={styles.markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.notificationsList}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ""} ${
                    notification.actionUrl ? styles.clickable : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.notificationIcon}>{getNotificationIcon(notification.type)}</div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>{notification.title}</div>
                    <div className={styles.notificationMessage}>{notification.message}</div>
                    <div className={styles.notificationTime}>{formatTimestamp(notification.timestamp)}</div>
                  </div>
                  {!notification.isRead && <div className={styles.unreadDot}></div>}
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔔</div>
                <div className={styles.emptyText}>No notifications</div>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button className={styles.viewAll}>View all notifications</button>
          </div>
        </div>
      )}
    </div>
  )
}
