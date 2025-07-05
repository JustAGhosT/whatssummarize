"use client"

import { useState } from "react"
import { useApp } from "../../../contexts/app-context"
import type { Summary } from "../../../contexts/app-context/types"
import styles from "./summary-card.module.css"

interface SummaryCardProps {
  summary: Summary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const { deleteSummary, updateSummary } = useApp()
  const [showFullContent, setShowFullContent] = useState(false)

  if (!summary) {
    return (
      <div className={styles.card}>
        <div className={styles.error}>Summary data not available</div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this summary?")) {
      deleteSummary(summary.id)
    }
  }

  const handleArchive = () => {
    updateSummary(summary.id, {
      status: summary.status === "active" ? "archived" : "active",
    })
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid date"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "weekly":
        return styles.typeWeekly
      case "missed":
        return styles.typeMissed
      case "topic-based":
        return styles.typeTopicBased
      default:
        return styles.typeDefault
    }
  }

  const truncatedContent =
    summary.content?.length > 150
      ? summary.content.substring(0, 150) + "..."
      : summary.content || "No content available"

  return (
    <div className={`${styles.card} ${summary.status === "archived" ? styles.archived : ""}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.groupName}>{summary.groupName || "Unknown Group"}</h3>
          <span className={`${styles.type} ${getTypeColor(summary.type)}`}>{summary.type || "unknown"}</span>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={handleArchive}
            className={styles.actionBtn}
            title={summary.status === "active" ? "Archive" : "Unarchive"}
          >
            {summary.status === "active" ? "📁" : "📂"}
          </button>
          <button onClick={handleDelete} className={styles.actionBtn} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{summary.title || "Untitled Summary"}</h4>
        <p className={styles.text}>{showFullContent ? summary.content || "No content available" : truncatedContent}</p>
        {summary.content && summary.content.length > 150 && (
          <button onClick={() => setShowFullContent(!showFullContent)} className={styles.toggleBtn}>
            {showFullContent ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(summary.createdAt)}</span>
        <span
          className={`${styles.status} ${summary.status === "active" ? styles.statusActive : styles.statusArchived}`}
        >
          {summary.status || "unknown"}
        </span>
      </div>
    </div>
  )
}
