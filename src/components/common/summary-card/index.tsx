import Image from "next/image"
import type { Summary } from "../../../contexts/app-context/types"
import styles from "./summary-card.module.css"

interface SummaryCardProps {
  summary: Summary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  // Add safety checks for undefined summary or missing properties
  if (!summary) {
    return null
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getTypeLabel = (type: Summary["type"]) => {
    switch (type) {
      case "weekly":
        return "Weekly Digest"
      case "missed":
        return "Missed Messages"
      case "topic-based":
        return "Topic-Based"
      default:
        return "Summary"
    }
  }

  // Provide default values for potentially undefined properties
  const groupName = summary.groupName || "Unknown Group"
  const title = summary.title || "Untitled Summary"
  const content = summary.content || "No content available"
  const type = summary.type || "weekly"
  const period = summary.period || { start: "", end: "" }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Image
            src="/placeholder.svg?height=60&width=60"
            alt={`${groupName} avatar`}
            width={60}
            height={60}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.groupInfo}>
          <h3 className={styles.groupName}>{groupName}</h3>
          <span className={styles.summaryType}>{getTypeLabel(type)}</span>
        </div>
      </div>

      <div className={styles.content}>
        <h4 className={styles.summaryTitle}>{title}</h4>
        <p className={styles.summaryContent}>{content}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.period}>
          {formatDate(period.start)} - {formatDate(period.end)}
        </span>
        <button className={styles.viewButton}>View Details</button>
      </div>
    </div>
  )
}
