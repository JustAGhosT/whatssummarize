"use client"

import { useState } from "react"
import { useAppContext } from "../../../contexts/app-context"
import { SummaryCard } from "../../common/summary-card"
import { FilterDropdown } from "../../common/filter-dropdown"
import styles from "./dashboard.module.css"

export function DashboardView() {
  const { state } = useAppContext()
  const [typeFilter, setTypeFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

  // Mock data for demonstration
  const mockSummaries = [
    {
      id: "1",
      groupId: "group1",
      groupName: "Parent group's Summary's group's group_name",
      title: "Parent group's Summary's title",
      content: "Parent group's Summary's content split by { }items until #30 join with",
      type: "weekly" as const,
      createdAt: "2024-01-05",
      period: { start: "2024-01-01", end: "2024-01-07" },
    },
    {
      id: "2",
      groupId: "group2",
      groupName: "Work Team Updates",
      title: "Weekly Project Status Summary",
      content: "Key decisions made on project timeline and resource allocation",
      type: "weekly" as const,
      createdAt: "2024-01-04",
      period: { start: "2023-12-28", end: "2024-01-04" },
    },
    {
      id: "3",
      groupId: "group3",
      groupName: "Family Chat",
      title: "Weekend Plans Discussion",
      content: "Family gathering arrangements and meal planning discussions",
      type: "topic-based" as const,
      createdAt: "2024-01-03",
      period: { start: "2024-01-01", end: "2024-01-03" },
    },
  ]

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Recent Summaries</h1>
          <div className={styles.filters}>
            <FilterDropdown
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "all", label: "All Types" },
                { value: "weekly", label: "Weekly Digest" },
                { value: "missed", label: "Missed Messages" },
                { value: "topic-based", label: "Topic-Based" },
              ]}
            />
            <FilterDropdown
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { value: "all", label: "All Time" },
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
              ]}
            />
          </div>
        </div>

        <div className={styles.summariesGrid}>
          {mockSummaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      </div>
    </div>
  )
}
