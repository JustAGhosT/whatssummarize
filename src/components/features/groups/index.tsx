"use client"

import { useState } from "react"
import styles from "./groups.module.css"

interface WhatsAppGroup {
  id: string
  name: string
  description?: string
  memberCount: number
  isActive: boolean
  lastActivity: string
}

const mockGroups: WhatsAppGroup[] = [
  {
    id: "1",
    name: "Family Group",
    description: "Family chat for daily updates",
    memberCount: 8,
    isActive: true,
    lastActivity: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Work Team",
    description: "Project discussions and updates",
    memberCount: 12,
    isActive: true,
    lastActivity: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    name: "Book Club",
    description: "Monthly book discussions",
    memberCount: 6,
    isActive: false,
    lastActivity: "2024-01-10T19:20:00Z",
  },
]

export function Groups() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>(mockGroups)
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")

  const filteredGroups = groups.filter((group) => {
    if (filter === "all") return true
    if (filter === "active") return group.isActive
    if (filter === "inactive") return !group.isActive
    return true
  })

  const toggleGroupStatus = (id: string) => {
    setGroups((prev) => prev.map((group) => (group.id === id ? { ...group, isActive: !group.isActive } : group)))
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>WhatsApp Groups</h1>
        <p className={styles.subtitle}>Manage your connected WhatsApp groups</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            onClick={() => setFilter("all")}
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
          >
            All Groups ({groups.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`${styles.filterBtn} ${filter === "active" ? styles.active : ""}`}
          >
            Active ({groups.filter((g) => g.isActive).length})
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`${styles.filterBtn} ${filter === "inactive" ? styles.active : ""}`}
          >
            Inactive ({groups.filter((g) => !g.isActive).length})
          </button>
        </div>
        <button className={styles.addBtn}>+ Add Group</button>
      </div>

      <div className={styles.groupsList}>
        {filteredGroups.map((group) => (
          <div key={group.id} className={`${styles.groupCard} ${!group.isActive ? styles.inactive : ""}`}>
            <div className={styles.groupHeader}>
              <div className={styles.groupInfo}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <p className={styles.groupDescription}>{group.description}</p>
              </div>
              <div className={styles.groupActions}>
                <button
                  onClick={() => toggleGroupStatus(group.id)}
                  className={`${styles.statusBtn} ${group.isActive ? styles.activeBtn : styles.inactiveBtn}`}
                >
                  {group.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
            <div className={styles.groupStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Members:</span>
                <span className={styles.statValue}>{group.memberCount}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Last Activity:</span>
                <span className={styles.statValue}>{formatDate(group.lastActivity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👥</div>
          <h3 className={styles.emptyTitle}>No groups found</h3>
          <p className={styles.emptyText}>
            {filter === "all"
              ? "Connect your WhatsApp groups to start generating summaries."
              : `No ${filter} groups found.`}
          </p>
        </div>
      )}
    </div>
  )
}
