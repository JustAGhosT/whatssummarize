"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "../../contexts/app-context"
import type { Summary } from "../../contexts/app-context/types"
import styles from "./summary-card.module.css"

interface SummaryCardProps {
  summary: Summary
  viewMode?: "grid" | "list"
  className?: string
}

const platformIcons = {
  whatsapp: "💬",
  slack: "💼",
  discord: "🎮",
  telegram: "✈️",
  teams: "👥",
  "cross-platform": "🔗",
}

const platformColors = {
  whatsapp: "#25d366",
  slack: "#4a154b",
  discord: "#5865f2",
  telegram: "#0088cc",
  teams: "#6264a7",
  "cross-platform": "#6366f1",
}

export function SummaryCard({ summary, viewMode = "grid", className }: SummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { markSummaryAsRead, deleteSummary } = useApp()

  const handleCardClick = () => {
    if (!summary.isRead) {
      markSummaryAsRead(summary.id)
    }
    setIsExpanded(!isExpanded)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this summary?")) {
      deleteSummary(summary.id)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  return (
    <div
      className={`${styles.card} ${viewMode === "list" ? styles.listCard : ""} ${!summary.isRead ? styles.unread : ""} ${className || ""}`}
      onClick={handleCardClick}
      style={{ "--platform-color": platformColors[summary.platform] } as React.CSSProperties}
    >
      <div className={styles.header}>
        <div className={styles.platformBadge}>
          <span className={styles.platformIcon}>{platformIcons[summary.platform]}</span>
          <span className={styles.platformName}>{summary.platform}</span>
        </div>

        <div className={styles.actions}>
          {!summary.isRead && <div className={styles.unreadIndicator} />}
          <button className={styles.deleteButton} onClick={handleDelete} title="Delete summary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{summary.title}</h3>
        <p className={styles.preview}>{isExpanded ? summary.content : `${summary.content.slice(0, 100)}...`}</p>

        {isExpanded && (
          <div className={styles.details}>
            <div className={styles.metadata}>
              <span className={styles.messageCount}>{summary.messageCount} messages</span>
              <span className={styles.participants}>{summary.participants.length} participants</span>
            </div>

            <div className={styles.tags}>
              {summary.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(summary.date)}</span>
        <button className={styles.expandButton} title={isExpanded ? "Collapse" : "Expand"}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={isExpanded ? styles.rotated : ""}
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  )
}
