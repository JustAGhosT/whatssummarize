"use client"

import { useState } from "react"
import type { PersonalSummary } from "../../../contexts/app-context/types"
import styles from "./personal-summary-card.module.css"

interface PersonalSummaryCardProps {
  summary: PersonalSummary
  onShare: () => void
}

export function PersonalSummaryCard({ summary, onShare }: PersonalSummaryCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shared":
        return styles.statusShared
      case "generated":
        return styles.statusGenerated
      case "draft":
        return styles.statusDraft
      default:
        return styles.statusDefault
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "shared":
        return "✅"
      case "generated":
        return "📋"
      case "draft":
        return "✏️"
      default:
        return "📄"
    }
  }

  const truncatedContent = summary.content.length > 150 ? summary.content.substring(0, 150) + "..." : summary.content

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>{summary.title}</h3>
          <div className={styles.dateRange}>
            {formatDate(summary.weekStart)} - {formatDate(summary.weekEnd)}
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.status} ${getStatusColor(summary.status)}`}>
            {getStatusIcon(summary.status)} {summary.status}
          </span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{summary.activityCount}</span>
          <span className={styles.statLabel}>Messages</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{summary.topGroups.length}</span>
          <span className={styles.statLabel}>Groups</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{summary.sharedChannels.length}</span>
          <span className={styles.statLabel}>Shared</span>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.text}>{showFullContent ? summary.content : truncatedContent}</p>
        {summary.content.length > 150 && (
          <button onClick={() => setShowFullContent(!showFullContent)} className={styles.toggleBtn}>
            {showFullContent ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <div className={styles.topGroups}>
        <div className={styles.groupsLabel}>Top Groups:</div>
        <div className={styles.groupsList}>
          {summary.topGroups.slice(0, 3).map((group, index) => (
            <span key={index} className={styles.groupTag}>
              {group}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onShare} className={styles.shareBtn} disabled={summary.status === "draft"}>
          {summary.status === "shared" ? "Share Again" : "Share"}
        </button>
        <div className={styles.createdAt}>Created {formatDate(summary.createdAt)}</div>
      </div>
    </div>
  )
}
