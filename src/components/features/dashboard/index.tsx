"use client"

import { useState, useMemo } from "react"
import { useApp } from "../../../contexts/app-context"
import { SummaryCard } from "../../common/summary-card"
import { FilterDropdown } from "../../common/filter-dropdown"
import styles from "./dashboard.module.css"

export function Dashboard() {
  const { summaries, loading, error, deleteSummary, updateSummary } = useApp()
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("date")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedSummaries = useMemo(() => {
    const filtered = summaries.filter((summary) => {
      // Filter by status
      const statusMatch =
        filter === "all" ||
        (filter === "active" && summary.status === "active") ||
        (filter === "archived" && summary.status === "archived") ||
        summary.type === filter

      // Filter by search term
      const searchMatch =
        searchTerm === "" ||
        summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.content.toLowerCase().includes(searchTerm.toLowerCase())

      return statusMatch && searchMatch
    })

    // Sort summaries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "type":
          return a.type.localeCompare(b.type)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return filtered
  }, [summaries, filter, searchTerm, sortBy])

  const stats = useMemo(
    () => ({
      total: summaries.length,
      active: summaries.filter((s) => s.status === "active").length,
      archived: summaries.filter((s) => s.status === "archived").length,
      weekly: summaries.filter((s) => s.type === "weekly").length,
      monthly: summaries.filter((s) => s.type === "monthly").length,
      recent: summaries.filter((s) => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(s.createdAt) > weekAgo
      }).length,
    }),
    [summaries],
  )

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <h3 className={styles.loadingTitle}>Loading your summaries...</h3>
          <p className={styles.loadingText}>Please wait while we fetch your WhatsApp conversation summaries</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Unable to Load Summaries</h3>
          <p className={styles.errorText}>We encountered an error while loading your summaries: {error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>📊</span>
              Dashboard
            </h1>
            <p className={styles.subtitle}>View and manage your WhatsApp conversation summaries</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.actionButton + " " + styles.primaryButton}>
              <span className={styles.buttonIcon}>➕</span>
              New Summary
            </button>
            <button className={styles.actionButton + " " + styles.secondaryButton}>
              <span className={styles.buttonIcon}>📤</span>
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>Total Summaries</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.active}</div>
              <div className={styles.statLabel}>Active</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.archived}</div>
              <div className={styles.statLabel}>Archived</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🆕</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.recent}</div>
              <div className={styles.statLabel}>This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.controlsLeft}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search summaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>🔍</div>
          </div>
          <FilterDropdown value={filter} onChange={setFilter} />
        </div>
        <div className={styles.controlsRight}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="type">Sort by Type</option>
            <option value="status">Sort by Status</option>
          </select>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        {filteredAndSortedSummaries.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{searchTerm || filter !== "all" ? "🔍" : "📝"}</div>
            <h3 className={styles.emptyTitle}>
              {searchTerm || filter !== "all" ? "No matching summaries" : "No summaries yet"}
            </h3>
            <p className={styles.emptyDescription}>
              {searchTerm || filter !== "all"
                ? `No summaries match your current search or filter criteria.`
                : "Start by creating your first WhatsApp conversation summary to see it here."}
            </p>
            {!searchTerm && filter === "all" && (
              <button className={styles.emptyAction}>
                <span className={styles.buttonIcon}>➕</span>
                Create Your First Summary
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" ? styles.summaryGrid : styles.summaryList}>
            {filteredAndSortedSummaries.map((summary) => (
              <SummaryCard
                key={summary.id}
                summary={summary}
                onDelete={deleteSummary}
                onUpdate={updateSummary}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Section */}
      {filteredAndSortedSummaries.length > 0 && (
        <div className={styles.footerSection}>
          <div className={styles.footerStats}>
            Showing {filteredAndSortedSummaries.length} of {summaries.length} summaries
            {searchTerm && ` matching "${searchTerm}"`}
            {filter !== "all" && ` filtered by ${filter}`}
          </div>
          <div className={styles.footerActions}>
            <button className={styles.footerButton}>Load More</button>
          </div>
        </div>
      )}
    </div>
  )
}
