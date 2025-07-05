"use client"

import { useState } from "react"
import { useApp } from "../../../contexts/app-context"
import { SummaryCard } from "../../common/summary-card"
import { FilterDropdown } from "../../common/filter-dropdown"
import styles from "./dashboard.module.css"

export function Dashboard() {
  const { summaries, loading, error } = useApp()
  const [filter, setFilter] = useState<string>("all")

  const filteredSummaries = summaries.filter((summary) => {
    if (filter === "all") return true
    if (filter === "active") return summary.status === "active"
    if (filter === "archived") return summary.status === "archived"
    return summary.type === filter
  })

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading summaries...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>View and manage your WhatsApp conversation summaries</p>
      </div>

      <div className={styles.controls}>
        <FilterDropdown value={filter} onChange={setFilter} />
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: <strong>{summaries.length}</strong>
          </span>
          <span className={styles.statItem}>
            Active: <strong>{summaries.filter((s) => s.status === "active").length}</strong>
          </span>
          <span className={styles.statItem}>
            Archived: <strong>{summaries.filter((s) => s.status === "archived").length}</strong>
          </span>
        </div>
      </div>

      {filteredSummaries.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📝</div>
          <h3 className={styles.emptyTitle}>No summaries found</h3>
          <p className={styles.emptyText}>
            {filter === "all"
              ? "Start by uploading your WhatsApp conversations to generate summaries."
              : `No summaries match the "${filter}" filter.`}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSummaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      )}
    </div>
  )
}
