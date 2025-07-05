import Image from "next/image"
import type { Summary } from "../../../contexts/app-context/types"
import styles from "./summary-card.module.css"

interface SummaryCardProps {
  summary: Summary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const formatDate = (dateString: string) => {
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Image
            src="/placeholder.svg?height=60&width=60"
            alt={`${summary.groupName} avatar`}
            width={60}
            height={60}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.groupInfo}>
          <h3 className={styles.groupName}>{summary.groupName}</h3>
          <span className={styles.summaryType}>{getTypeLabel(summary.type)}</span>
        </div>
      </div>

      <div className={styles.content}>
        <h4 className={styles.summaryTitle}>{summary.title}</h4>
        <p className={styles.summaryContent}>{summary.content}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.period}>
          {formatDate(summary.period.start)} - {formatDate(summary.period.end)}
        </span>
        <button className={styles.viewButton}>View Details</button>
      </div>
    </div>
  )
}
