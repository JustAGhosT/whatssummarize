"use client"

import { useState } from "react"
import { useApp } from "../../contexts/app-context"
import { SummaryCard } from "../common/summary-card"
import { FilterDropdown } from "../common/filter-dropdown"
import styles from "./personal-summary.module.css"

interface PersonalSummaryProps {
  className?: string
}

export function PersonalSummary({ className }: PersonalSummaryProps) {
  const { summaries, isLoading, generateSummary, selectedPlatform, setSelectedPlatform } = useApp()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "platform" | "unread">("date")

  const personalSummaries = summaries.filter((s) => s.type === "group" || s.type === "personal")

  const filteredSummaries = personalSummaries
    .filter((s) => selectedPlatform === "all" || s.platform === selectedPlatform)
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "platform":
          return a.platform.localeCompare(b.platform)
        case "unread":
          return Number(b.isRead) - Number(a.isRead)
        default:
          return 0
      }
    })

  const handleGenerateSummary = async (type: "weekly" | "since-last-read") => {
    try {
      // For demo purposes, generate for the first available group
      if (personalSummaries.length > 0) {
        await generateSummary(personalSummaries[0].groupId, type)
      }
    } catch (error) {
      console.error("Failed to generate summary:", error)
    }
  }

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Personal Summaries</h2>
          <p className={styles.subtitle}>Your conversation summaries across all platforms</p>
        </div>

        <div className={styles.actions}>
          <FilterDropdown
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.generateButtons}>
            <button
              className={styles.generateButton}
              onClick={() => handleGenerateSummary("since-last-read")}
              disabled={isLoading}
            >
              Since Last Read
            </button>
            <button
              className={styles.generateButton}
              onClick={() => handleGenerateSummary("weekly")}
              disabled={isLoading}
            >
              Weekly Summary
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Generating summary...</span>
        </div>
      )}

      <div className={`${styles.summariesGrid} ${viewMode === "list" ? styles.listView : ""}`}>
        {filteredSummaries.map((summary) => (
          <SummaryCard key={summary.id} summary={summary} viewMode={viewMode} />
        ))}
      </div>

      {filteredSummaries.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3 className={styles.emptyTitle}>No summaries yet</h3>
          <p className={styles.emptyDescription}>Generate your first summary to get started</p>
          <button className={styles.emptyAction} onClick={() => handleGenerateSummary("weekly")}>
            Generate Weekly Summary
          </button>
        </div>
      )}
    </div>
  )
}
