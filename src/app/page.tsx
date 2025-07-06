"use client"

import { useAuth } from "../contexts/auth-context"
import { useApp } from "../contexts/app-context"
import { EnhancedBackground } from "../components/common/enhanced-background"
import { DashboardComponent } from "../components/features/dashboard"
import styles from "./page.module.css"

export default function Page() {
  const { user, isAuthenticated } = useAuth()
  const { summaries, groups, getUnreadCount } = useApp()

  const stats = {
    totalSummaries: summaries.length,
    activeSummaries: summaries.filter((s) => !s.isRead).length,
    archivedSummaries: summaries.filter((s) => s.isRead).length,
    totalGroups: groups.length,
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.backgroundWrapper}>
          <EnhancedBackground />
        </div>
        <div className={styles.content}>
          <main className={styles.main}>
            <div className={styles.hero}>
              <h1 className={styles.heroTitle}>WhatsApp Conversation Summarizer</h1>
              <p className={styles.heroSubtitle}>
                Transform your chat conversations into meaningful summaries across multiple platforms
              </p>
              <div className={styles.heroFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>💬</span>
                  <span>Multi-Platform Support</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🤖</span>
                  <span>AI-Powered Summaries</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📊</span>
                  <span>Smart Analytics</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundWrapper}>
        <EnhancedBackground />
      </div>
      <div className={styles.content}>
        <main className={styles.main}>
          <DashboardComponent />
        </main>
      </div>
    </div>
  )
}
