"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { PersonalSummaryCard } from "@/components/common/personal-summary-card"
import { ShareModal } from "@/components/common/share-modal"
import styles from "./personal-summary.module.css"

export function PersonalSummary() {
  const { personalSummaries, generatePersonalSummary, sharePersonalSummary, isLoading, error } = useApp()

  const [isGenerating, setIsGenerating] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedSummaryId, setSelectedSummaryId] = useState<string | null>(null)

  const handleGenerateWeeklySummary = async () => {
    setIsGenerating(true)
    try {
      const today = new Date()
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))

      await generatePersonalSummary(weekStart.toISOString().split("T")[0], weekEnd.toISOString().split("T")[0])
    } catch (err) {
      console.error("Failed to generate summary:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = (summaryId: string) => {
    setSelectedSummaryId(summaryId)
    setShareModalOpen(true)
  }

  const handleShareConfirm = async (channels: string[]) => {
    if (selectedSummaryId) {
      try {
        await sharePersonalSummary(selectedSummaryId, channels)
        setShareModalOpen(false)
        setSelectedSummaryId(null)
      } catch (err) {
        console.error("Failed to share summary:", err)
      }
    }
  }

  const stats = {
    total: personalSummaries.length,
    generated: personalSummaries.filter((s) => s.status === "generated").length,
    shared: personalSummaries.filter((s) => s.status === "shared").length,
    draft: personalSummaries.filter((s) => s.status === "draft").length,
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Personal Summaries</h1>
          <p className={styles.subtitle}>Generate and share personalized weekly activity summaries</p>
        </div>

        <button
          className={styles.generateBtn}
          onClick={handleGenerateWeeklySummary}
          disabled={isGenerating || isLoading}
        >
          {isGenerating ? (
            <>
              <span className={styles.spinner}></span>
              Generating...
            </>
          ) : (
            <>
              <span className={styles.generateIcon}>✨</span>
              Generate Weekly Summary
            </>
          )}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.generated}</div>
          <div className={styles.statLabel}>Generated</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.shared}</div>
          <div className={styles.statLabel}>Shared</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.draft}</div>
          <div className={styles.statLabel}>Draft</div>
        </div>
      </div>

      <div className={styles.summariesGrid}>
        {personalSummaries.map((summary) => (
          <PersonalSummaryCard key={summary.id} summary={summary} onShare={() => handleShare(summary.id)} />
        ))}
      </div>

      {personalSummaries.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h3 className={styles.emptyTitle}>No Personal Summaries Yet</h3>
          <p className={styles.emptyText}>Generate your first weekly activity summary to get started</p>
          <button className={styles.emptyBtn} onClick={handleGenerateWeeklySummary} disabled={isGenerating}>
            Generate Your First Summary
          </button>
        </div>
      )}

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShareConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
