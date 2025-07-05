"use client"

import { useState } from "react"
import { useAppContext } from "../../../contexts/app-context"
import styles from "./groups.module.css"

export function GroupsView() {
  const { state } = useAppContext()
  const [selectedGroup, setSelectedGroup] = useState("all")

  return (
    <div className={styles.groups}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>WhatsApp Group Connection</h1>
          <button className="btn-primary">+ Connect New Group</button>
        </div>

        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <h2 className={styles.sectionTitle}>Connected Groups</h2>
          <div className={styles.emptyState}>
            <p>No groups connected yet. Click "Connect New Group" to get started.</p>
          </div>
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <h2 className={styles.sectionTitle}>User Activity Tracking</h2>

          <div className={styles.filterSection}>
            <div className={styles.filterGroup}>
              <label>Filter by Group:</label>
              <select className="select-field" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="all">All Groups</option>
                <option value="group1">Family Chat</option>
                <option value="group2">Work Team</option>
              </select>
            </div>
            <button className="btn-secondary">🔄 Refresh</button>
          </div>

          <div className={styles.activityResults}>
            <p className={styles.emptyMessage}>
              No activity data available. Connect groups to start tracking user activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
