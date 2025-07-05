"use client"

import { useState } from "react"
import styles from "./notifications.module.css"

interface Notification {
  id: string
  type: "summary-ready" | "while-away" | "scheduled-digest"
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "summary-ready",
    title: "New Summary Available",
    message: "Your weekly summary for Family Group is ready to view.",
    isRead: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "while-away",
    title: "Messages While Away",
    message: "You have 15 new messages in Work Team that need summarizing.",
    isRead: false,
    createdAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    type: "scheduled-digest",
    title: "Daily Digest",
    message: "Your daily digest has been sent to your email.",
    isRead: true,
    createdAt: "2024-01-13T09:00:00Z",
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.isRead
    if (filter === "read") return notification.isRead
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "summary-ready":
        return "📝"
      case "while-away":
        return "🔔"
      case "scheduled-digest":
        return "📅"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "summary-ready":
        return styles.summaryReady
      case "while-away":
        return styles.whileAway
      case "scheduled-digest":
        return styles.scheduledDigest
      default:
        return styles.default
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        <p className={styles.subtitle}>Stay updated with your summary activities</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            onClick={() => setFilter("all")}
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`${styles.filterBtn} ${filter === "unread" ? styles.active : ""}`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`${styles.filterBtn} ${filter === "read" ? styles.active : ""}`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className={styles.markAllBtn}>
            Mark All as Read
          </button>
        )}
      </div>

      <div className={styles.notificationsList}>
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`${styles.notificationCard} ${!notification.isRead ? styles.unread : ""}`}
          >
            <div className={styles.notificationHeader}>
              <div className={styles.notificationInfo}>
                <div className={styles.notificationIcon}>
                  <span className={`${styles.icon} ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div>
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    <p className={styles.notificationType}>{notification.type.replace("-", " ").toUpperCase()}</p>
                  </div>
                </div>
              </div>
              <div className={styles.notificationActions}>
                {!notification.isRead && (
                  <button onClick={() => markAsRead(notification.id)} className={styles.readBtn} title="Mark as read">
                    ✓
                  </button>
                )}
                <button onClick={() => deleteNotification(notification.id)} className={styles.deleteBtn} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationMessage}>{notification.message}</p>
              <span className={styles.notificationDate}>{formatDate(notification.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔔</div>
          <h3 className={styles.emptyTitle}>No notifications</h3>
          <p className={styles.emptyText}>
            {filter === "all" ? "You're all caught up! No notifications to show." : `No ${filter} notifications found.`}
          </p>
        </div>
      )}
    </div>
  )
}
