"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./notification-bell.module.css"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Summary Ready",
      message: "Your Family Group Chat summary has been generated",
      type: "success",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      title: "Export Complete",
      message: "Your summaries have been exported successfully",
      type: "info",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      title: "Storage Warning",
      message: "You're approaching your storage limit",
      type: "warning",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={`${styles.trigger} ${unreadCount > 0 ? styles.hasUnread : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && <div className={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</div>}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <button className={styles.markAllRead} onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔔</div>
                <div className={styles.emptyText}>No notifications</div>
                <div className={styles.emptySubtext}>You're all caught up!</div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notification} ${!notification.read ? styles.unread : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={styles.notificationIcon}>{getNotificationIcon(notification.type)}</div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>{notification.title}</div>
                    <div className={styles.notificationMessage}>{notification.message}</div>
                    <div className={styles.notificationTime}>{formatTimestamp(notification.timestamp)}</div>
                  </div>
                  {!notification.read && <div className={styles.unreadDot}></div>}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className={styles.footer}>
              <button className={styles.viewAll}>View all notifications</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
