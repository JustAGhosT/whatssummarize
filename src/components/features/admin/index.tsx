"use client"

import { useState } from "react"
import { useAppContext } from "../../../contexts/app-context"
import styles from "./admin.module.css"

export function AdminView() {
  const { state } = useAppContext()
  const [activityFilters, setActivityFilters] = useState({
    startDate: "",
    endDate: "",
    activityType: "all",
    group: "all",
  })

  const [reportFilters, setReportFilters] = useState({
    startDate: "",
    endDate: "",
    group: "all",
  })

  const handleFilterActivity = () => {
    // Implement activity filtering logic
    console.log("Filtering activity with:", activityFilters)
  }

  const handleExportReport = () => {
    // Implement report export logic
    console.log("Exporting report with:", reportFilters)
  }

  return (
    <div className={styles.admin}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Controls</h1>
            <p className={styles.subtitle}>
              Manage your connected groups and monitor user activity across all your WhatsApp communities.
            </p>
          </div>
        </div>

        {/* User Activity Tracking */}
        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <h2 className={styles.sectionTitle}>User Activity Tracking</h2>

          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label>Start Date</label>
              <input
                type="date"
                className="input-field"
                value={activityFilters.startDate}
                onChange={(e) => setActivityFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>End Date</label>
              <input
                type="date"
                className="input-field"
                value={activityFilters.endDate}
                onChange={(e) => setActivityFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Activity Type</label>
              <select
                className="select-field"
                value={activityFilters.activityType}
                onChange={(e) => setActivityFilters((prev) => ({ ...prev, activityType: e.target.value }))}
              >
                <option value="all">All Activity Types</option>
                <option value="messages">Messages</option>
                <option value="reactions">Reactions</option>
                <option value="joins">Group Joins</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Group</label>
              <select
                className="select-field"
                value={activityFilters.group}
                onChange={(e) => setActivityFilters((prev) => ({ ...prev, group: e.target.value }))}
              >
                <option value="all">All Groups</option>
                <option value="group1">Family Chat</option>
                <option value="group2">Work Team</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" onClick={handleFilterActivity}>
            Filter Activity
          </button>

          <div className={styles.activityResults}>
            <h3>Activity Results</h3>
            <div className={styles.emptyResults}>
              <p>No activity data available for the selected filters.</p>
            </div>
          </div>
        </div>

        {/* Connected Groups Management */}
        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <h2 className={styles.sectionTitle}>Connected Groups Management</h2>
          <div className={styles.emptyState}>
            <p>No connected groups to manage. Connect groups from the Groups page to see management options here.</p>
          </div>
        </div>

        {/* Export Activity Reports */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 className={styles.sectionTitle}>Export Activity Reports</h2>

          <div className={styles.exportGrid}>
            <div className={styles.filterGroup}>
              <label>Report Start Date</label>
              <input
                type="date"
                className="input-field"
                value={reportFilters.startDate}
                onChange={(e) => setReportFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Report End Date</label>
              <input
                type="date"
                className="input-field"
                value={reportFilters.endDate}
                onChange={(e) => setReportFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Select Group</label>
              <select
                className="select-field"
                value={reportFilters.group}
                onChange={(e) => setReportFilters((prev) => ({ ...prev, group: e.target.value }))}
              >
                <option value="all">All Groups</option>
                <option value="group1">Family Chat</option>
                <option value="group2">Work Team</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" onClick={handleExportReport}>
            Export Activity Report
          </button>
        </div>
      </div>
    </div>
  )
}
