"use client"

import { useState, useMemo } from "react"
import { useApp } from "@/contexts/app-context"
import { SummaryCard } from "@/components/common/summary-card"
import { FilterDropdown } from "@/components/common/filter-dropdown"
import styles from "./dashboard.module.css"

type SortOption = "date" | "title" | "type" | "status" | "messages" | "participants"
type SortOrder = "asc" | "desc"
type ViewMode = "grid" | "list"

export function Dashboard() {
  const { summaries, deleteSummary, updateSummary, isLoading, error } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Calculate statistics with trends
  const stats = useMemo(() => {
    const total = summaries.length
    const active = summaries.filter((s) => !s.isArchived).length
    const archived = summaries.filter((s) => s.isArchived).length

    // Calculate this week's summaries
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const thisWeek = summaries.filter((s) => new Date(s.createdAt) >= oneWeekAgo).length

    // Calculate last week for trends
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const lastWeek = summaries.filter((s) => {
      const date = new Date(s.createdAt)
      return date >= twoWeeksAgo && date < oneWeekAgo
    }).length

    // Calculate trends
    const weeklyTrend = thisWeek - lastWeek
    const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0

    return {
      total,
      active,
      archived,
      thisWeek,
      weeklyTrend,
      activePercentage,
    }
  }, [summaries])

  // Filter and search logic
  const filteredSummaries = useMemo(() => {
    const filtered = summaries.filter((summary) => {
      // Search filter
      const searchMatch =
        searchTerm === "" ||
        summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.type.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const typeMatch = filterType === "all" || summary.type === filterType

      // Status filter
      const statusMatch =
        filterStatus === "all" ||
        (filterStatus === "active" && !summary.isArchived) ||
        (filterStatus === "archived" && summary.isArchived)

      return searchMatch && typeMatch && statusMatch
    })

    // Sort logic
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "type":
          aValue = a.type
          bValue = b.type
          break
        case "status":
          aValue = a.isArchived ? "archived" : "active"
          bValue = b.isArchived ? "archived" : "active"
          break
        case "messages":
          aValue = a.messageCount || 0
          bValue = b.messageCount || 0
          break
        case "participants":
          aValue = a.participants || 0
          bValue = b.participants || 0
          break
        default:
          aValue = a.createdAt
          bValue = b.createdAt
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [summaries, searchTerm, filterType, filterStatus, sortBy, sortOrder])

  // Filter options with counts
  const typeOptions = useMemo(() => {
    const counts = summaries.reduce(
      (acc, summary) => {
        acc[summary.type] = (acc[summary.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return [
      { value: "all", label: "All Types", count: summaries.length },
      { value: "daily", label: "Daily", count: counts.daily || 0 },
      { value: "weekly", label: "Weekly", count: counts.weekly || 0 },
      { value: "monthly", label: "Monthly", count: counts.monthly || 0 },
      { value: "custom", label: "Custom", count: counts.custom || 0 },
    ]
  }, [summaries])

  const statusOptions = useMemo(() => {
    const activeCount = summaries.filter((s) => !s.isArchived).length
    const archivedCount = summaries.filter((s) => s.isArchived).length

    return [
      { value: "all", label: "All Status", count: summaries.length },
      { value: "active", label: "Active", count: activeCount },
      { value: "archived", label: "Archived", count: archivedCount },
    ]
  }, [summaries])

  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "title", label: "Title" },
    { value: "type", label: "Type" },
    { value: "status", label: "Status" },
    { value: "messages", label: "Messages" },
    { value: "participants", label: "Participants" },
  ]

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredSummaries, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `summaries-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const clearSearch = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterStatus("all")
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroIcon}>📊</span>
              Dashboard
            </h1>
            <p className={styles.heroSubtitle}>View and manage your WhatsApp conversation summaries</p>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.newSummaryBtn} type="button">
              <span className={styles.btnIcon}>➕</span>
              New Summary
            </button>
            <button
              className={styles.exportAllBtn}
              onClick={handleExport}
              disabled={filteredSummaries.length === 0}
              type="button"
            >
              <span className={styles.btnIcon}>📤</span>
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className={styles.statsSection}>
        <div className={`${styles.statCard} ${styles.totalCard}`}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>📊</span>
            </div>
            <div className={styles.statTrend}>
              <span className={styles.trendIcon}>📈</span>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.total}</div>
            <div className={styles.statLabel}>Total Summaries</div>
            <div className={styles.statSubtext}>All conversations tracked</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.activeCard}`}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>✅</span>
            </div>
            <div className={styles.statBadge}>{stats.activePercentage}%</div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.active}</div>
            <div className={styles.statLabel}>Active</div>
            <div className={styles.statSubtext}>Currently being tracked</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.archivedCard}`}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>📦</span>
            </div>
            <div className={styles.statProgress}>
              <div
                className={styles.progressBar}
                style={{ width: `${stats.total > 0 ? (stats.archived / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.archived}</div>
            <div className={styles.statLabel}>Archived</div>
            <div className={styles.statSubtext}>Completed summaries</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.weeklyCard}`}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>📅</span>
            </div>
            <div className={styles.statTrend}>
              {stats.weeklyTrend > 0 && <span className={styles.trendUp}>↗️ +{stats.weeklyTrend}</span>}
              {stats.weeklyTrend < 0 && <span className={styles.trendDown}>↘️ {stats.weeklyTrend}</span>}
              {stats.weeklyTrend === 0 && <span className={styles.trendNeutral}>➡️ 0</span>}
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.thisWeek}</div>
            <div className={styles.statLabel}>This Week</div>
            <div className={styles.statSubtext}>Recent activity</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className={styles.quickActionsSection}>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn} type="button">
            <span className={styles.quickActionIcon}>🔍</span>
            <span className={styles.quickActionText}>Search All</span>
          </button>
          <button className={styles.quickActionBtn} type="button">
            <span className={styles.quickActionIcon}>📋</span>
            <span className={styles.quickActionText}>View Recent</span>
          </button>
          <button className={styles.quickActionBtn} type="button">
            <span className={styles.quickActionIcon}>⚙️</span>
            <span className={styles.quickActionText}>Settings</span>
          </button>
          <button className={styles.quickActionBtn} type="button">
            <span className={styles.quickActionIcon}>📊</span>
            <span className={styles.quickActionText}>Analytics</span>
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className={styles.toolbarSection}>
        <div className={styles.searchRow}>
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search summaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button className={styles.clearSearch} onClick={() => setSearchTerm("")} type="button">
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className={styles.viewModeToggle}>
            <button
              className={`${styles.viewModeBtn} ${viewMode === "grid" ? styles.active : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
              type="button"
            >
              ⊞
            </button>
            <button
              className={`${styles.viewModeBtn} ${viewMode === "list" ? styles.active : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
              type="button"
            >
              ☰
            </button>
          </div>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filtersGroup}>
            <FilterDropdown options={typeOptions} value={filterType} onChange={setFilterType} placeholder="All Types" />

            <FilterDropdown
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="All Status"
            />

            <div className={styles.sortContainer}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={styles.sortSelect}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>

              <button
                className={styles.sortOrderBtn}
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
                type="button"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {(searchTerm || filterType !== "all" || filterStatus !== "all") && (
            <button className={styles.clearFilters} onClick={clearSearch} type="button">
              Clear Filters
            </button>
          )}
        </div>

        <div className={styles.resultsInfo}>
          <span className={styles.resultsText}>
            Showing {filteredSummaries.length} of {summaries.length} summaries
          </span>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading summaries...</span>
        </div>
      )}

      {!isLoading && filteredSummaries.length === 0 && (
        <div className={styles.emptyState}>
          {searchTerm || filterType !== "all" || filterStatus !== "all" ? (
            <>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>No summaries found</h3>
              <p className={styles.emptyText}>Try adjusting your search terms or filters</p>
              <button className={styles.clearFiltersBtn} onClick={clearSearch} type="button">
                Clear all filters
              </button>
            </>
          ) : (
            <>
              <div className={styles.emptyIcon}>📝</div>
              <h3 className={styles.emptyTitle}>No summaries yet</h3>
              <p className={styles.emptyText}>Your WhatsApp conversation summaries will appear here</p>
              <button className={styles.newSummaryBtn} type="button">
                <span className={styles.btnIcon}>➕</span>
                Create Your First Summary
              </button>
            </>
          )}
        </div>
      )}

      {!isLoading && filteredSummaries.length > 0 && (
        <div className={`${styles.summariesGrid} ${styles[viewMode]}`}>
          {filteredSummaries.map((summary) => (
            <SummaryCard
              key={summary.id}
              summary={summary}
              viewMode={viewMode}
              onDelete={deleteSummary}
              onUpdate={updateSummary}
            />
          ))}
        </div>
      )}
    </div>
  )
}
