"use client"

import { Download, Grid, List, Minus, Plus, Search, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../../contexts/app-context"
import type { PersonalSummary, TopGroup } from "../../../types/contexts"
import { PersonalSummaryCard } from "../../common/personal-summary-card"
import { ShareModal } from "../../common/share-modal"
import styles from "./personal-summary.module.css"

// Utility function to get progress bar class based on percentage
const getProgressBarClass = (percentage: number) => {
  if (percentage <= 10) return styles.progressBar10
  if (percentage <= 20) return styles.progressBar20
  if (percentage <= 30) return styles.progressBar30
  if (percentage <= 40) return styles.progressBar40
  if (percentage <= 50) return styles.progressBar50
  if (percentage <= 60) return styles.progressBar60
  if (percentage <= 70) return styles.progressBar70
  if (percentage <= 80) return styles.progressBar80
  if (percentage <= 90) return styles.progressBar90
  return styles.progressBar100
}

function PersonalSummary() {
  const { personalSummaries, topGroups } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("date")
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedSummary, setSelectedSummary] = useState<PersonalSummary | null>(null)

  // Filter and search summaries
  const filteredSummaries = (personalSummaries || []).filter((summary) => {
    const matchesSearch =
      summary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.contact?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "recent" && new Date(summary.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (selectedFilter === "important" && (summary.keyPoints?.length || 0) > 3) ||
      (selectedFilter === "archived" && summary.archived)

    return matchesSearch && matchesFilter
  })

  // Sort summaries
  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "contact":
        return a.contact.localeCompare(b.contact)
      case "messages":
        return b.messageCount - a.messageCount
      default:
        return 0
    }
  })

  const handleShare = (summary: PersonalSummary) => {
    setSelectedSummary(summary)
    setShareModalOpen(true)
  }

  const handleExport = () => {
    console.log("Exporting all summaries...")
  }

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // Calculate stats with proper handling of TopGroup objects
  const totalSummaries = personalSummaries.length
  const activeSummaries = personalSummaries.filter((s) => !s.archived).length
  const archivedSummaries = personalSummaries.filter((s) => s.archived).length
  const thisWeekSummaries = personalSummaries.filter(
    (s) => new Date(s.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  // Previous week for trend calculation
  const lastWeekSummaries = personalSummaries.filter((s) => {
    const date = new Date(s.date)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    return date <= weekAgo && date > twoWeeksAgo
  }).length

  const weeklyTrend = calculateTrend(thisWeekSummaries, lastWeekSummaries)

  return (
    <div className={styles.personalSummary}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Personal Summaries</h1>
            <p className={styles.subtitle}>Manage your individual conversation summaries</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.primaryButton} onClick={() => console.log("New summary")}>
              <Plus size={18} />
              New Summary
            </button>
            <button className={styles.secondaryButton} onClick={handleExport}>
              <Download size={18} />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.totalCard}`}>
          <div className={styles.statIcon}>
            <div className={styles.iconContainer}>
              <Grid size={24} />
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{totalSummaries}</div>
            <div className={styles.statLabel}>Total Summaries</div>
            <div className={styles.statDescription}>All conversations tracked</div>
          </div>
          <div className={styles.statProgress}>
            <div className={`${styles.progressBar} ${styles.progressBar100}`}></div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.activeCard}`}>
          <div className={styles.statIcon}>
            <div className={styles.iconContainer}>
              <List size={24} />
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{activeSummaries}</div>
            <div className={styles.statLabel}>Active</div>
            <div className={styles.statDescription}>Currently being tracked</div>
          </div>
          <div className={styles.statTrend}>
            <TrendingUp size={16} />
            <span>+12%</span>
          </div>
          <div className={styles.statProgress}>
            <div className={`${styles.progressBar} ${styles.progressBar75}`}></div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.archivedCard}`}>
          <div className={styles.statIcon}>
            <div className={styles.iconContainer}>
              <Download size={24} />
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{archivedSummaries}</div>
            <div className={styles.statLabel}>Archived</div>
            <div className={styles.statDescription}>Completed summaries</div>
          </div>
          <div className={styles.statTrend}>
            <Minus size={16} />
            <span>0%</span>
          </div>
          <div className={styles.statProgress}>
            <div className={`${styles.progressBar} ${styles.progressBar25}`}></div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.weekCard}`}>
          <div className={styles.statIcon}>
            <div className={styles.iconContainer}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{thisWeekSummaries}</div>
            <div className={styles.statLabel}>This Week</div>
            <div className={styles.statDescription}>Recent activity</div>
          </div>
          <div className={styles.statTrend}>
            {weeklyTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {weeklyTrend >= 0 ? "+" : ""}
              {weeklyTrend.toFixed(1)}%
            </span>
          </div>
          <div className={styles.statProgress}>
            <div
              className={`${styles.progressBar} ${getProgressBarClass(Math.min(100, (thisWeekSummaries / Math.max(1, totalSummaries)) * 100))}`}
            ></div>
          </div>
        </div>
      </div>

      {/* Top Groups Section */}
      {topGroups.length > 0 && (
        <div className={styles.topGroupsSection}>
          <h2 className={styles.sectionTitle}>Most Active Contacts</h2>
          <div className={styles.topGroupsList}>
            {topGroups.map((group: TopGroup, index: number) => (
              <div key={`${group.name}-${index}`} className={styles.topGroupItem}>
                <div className={styles.topGroupRank}>#{index + 1}</div>
                <div className={styles.topGroupInfo}>
                  <div className={styles.topGroupName}>{group.name}</div>
                  <div className={styles.topGroupCount}>{group.messageCount} messages</div>
                </div>
                <div className={styles.topGroupBar}>
                  <div
                    className={`${styles.topGroupProgress} ${getProgressBarClass((group.messageCount / Math.max(...topGroups.map((g: TopGroup) => g.messageCount))) * 100)}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search summaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterControls}>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filter summaries"
            >
              <option value="all">All Summaries</option>
              <option value="recent">Recent</option>
              <option value="important">Important</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
              aria-label="Sort summaries"
            >
              <option value="date">Sort by Date</option>
              <option value="contact">Sort by Contact</option>
              <option value="messages">Sort by Messages</option>
            </select>

            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>
            {sortedSummaries.length} {sortedSummaries.length === 1 ? "summary" : "summaries"}
          </span>
        </div>
      </div>

      {/* Summaries Grid/List */}
      <div className={`${styles.summariesContainer} ${styles[viewMode]}`}>
        {sortedSummaries.length > 0 ? (
          sortedSummaries.map((summary) => (
            <PersonalSummaryCard
              key={summary.id}
              summary={summary}
              onShare={() => handleShare(summary)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Search size={48} />
            </div>
            <h3 className={styles.emptyTitle}>No summaries found</h3>
            <p className={styles.emptyDescription}>
              {searchTerm || selectedFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first personal summary to get started"}
            </p>
            <button className={styles.primaryButton} onClick={() => console.log("New summary")}>
              <Plus size={18} />
              Create Summary
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareModalOpen && selectedSummary && (
        <ShareModal 
          isOpen={shareModalOpen} 
          onClose={() => setShareModalOpen(false)} 
          onShare={(channels) => {
            console.log('Sharing to channels:', channels);
            setShareModalOpen(false);
          }}
        />
      )}
    </div>
  )
}

export default PersonalSummary
