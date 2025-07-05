"use client"

import { useState } from "react"
import type { Summary } from "../../../contexts/app-context/types"
import styles from "./summary-card.module.css"

interface SummaryCardProps {
  summary: Summary
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Summary>) => void
  viewMode?: "grid" | "list"
}

export function SummaryCard({ summary, onDelete, onUpdate, viewMode = "grid" }: SummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this summary?")) {
      setIsLoading(true)
      try {
        await onDelete(summary.id)
      } catch (error) {
        console.error("Failed to delete summary:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleArchive = async () => {
    setIsLoading(true)
    try {
      await onUpdate(summary.id, {
        status: summary.status === "active" ? "archived" : "active",
      })
    } catch (error) {
      console.error("Failed to update summary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: summary.title,
        text: summary.content,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(summary.content)
      alert("Summary copied to clipboard!")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weekly":
        return "📅"
      case "monthly":
        return "📊"
      case "daily":
        return "📝"
      case "custom":
        return "⚙️"
      default:
        return "📄"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#25d366"
      case "archived":
        return "#6c757d"
      case "draft":
        return "#ffc107"
      default:
        return "#6c757d"
    }
  }

  const cardClassName = `${styles.card} ${styles[viewMode]} ${summary.status === "archived" ? styles.archived : ""}`

  return (
    <div className={cardClassName}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.typeIcon}>{getTypeIcon(summary.type)}</div>
          <div className={styles.titleContent}>
            <h3 className={styles.title}>{summary.title}</h3>
            <div className={styles.metadata}>
              <span className={styles.type}>{summary.type}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.date}>{formatDate(summary.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(summary.status) }}>
          {summary.status}
        </div>
      </div>

      <div className={styles.content}>
        <p className={`${styles.summary} ${isExpanded ? styles.expanded : ""}`}>{summary.content}</p>
        {summary.content.length > 150 && (
          <button className={styles.expandButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {summary.tags && summary.tags.length > 0 && (
        <div className={styles.tags}>
          {summary.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>💬</span>
          <span className={styles.statValue}>{summary.messageCount || 0}</span>
          <span className={styles.statLabel}>Messages</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>👥</span>
          <span className={styles.statValue}>{summary.participantCount || 0}</span>
          <span className={styles.statLabel}>People</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>📊</span>
          <span className={styles.statValue}>{summary.insights?.length || 0}</span>
          <span className={styles.statLabel}>Insights</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={() => window.open(`/summary/${summary.id}`, "_blank")}
          title="View Full Summary"
        >
          <span className={styles.actionIcon}>👁️</span>
          View
        </button>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={handleShare} title="Share Summary">
          <span className={styles.actionIcon}>📤</span>
          Share
        </button>
        <button
          className={`${styles.actionButton} ${styles.secondary}`}
          onClick={handleArchive}
          title={summary.status === "active" ? "Archive" : "Unarchive"}
        >
          <span className={styles.actionIcon}>{summary.status === "active" ? "📦" : "📤"}</span>
          {summary.status === "active" ? "Archive" : "Restore"}
        </button>
        <button className={`${styles.actionButton} ${styles.danger}`} onClick={handleDelete} title="Delete Summary">
          <span className={styles.actionIcon}>🗑️</span>
          Delete
        </button>
      </div>
    </div>
  )
}
