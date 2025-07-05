"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { AppContextType, Summary } from "./types"

const AppContext = createContext<AppContextType | undefined>(undefined)

const mockSummaries: Summary[] = [
  {
    id: "1",
    groupName: "Family Group",
    title: "Weekly Family Updates",
    content:
      "This week the family discussed vacation plans for summer, shared photos from weekend activities, and coordinated schedules for upcoming events. Mom shared recipes for the weekend barbecue.",
    createdAt: "2024-01-15T10:30:00Z",
    type: "weekly",
    status: "active",
  },
  {
    id: "2",
    groupName: "Work Team",
    title: "Project Status Update",
    content:
      "Team discussed project milestones, resolved technical blockers, and planned sprint activities for next week. New deployment pipeline was approved and testing phase begins Monday.",
    createdAt: "2024-01-14T15:45:00Z",
    type: "missed",
    status: "active",
  },
  {
    id: "3",
    groupName: "Book Club",
    title: "Monthly Reading Discussion",
    content:
      "Members shared thoughts on this month's book selection, discussed favorite characters, and voted on next month's reading choice. Great insights about the author's writing style.",
    createdAt: "2024-01-13T19:20:00Z",
    type: "topic-based",
    status: "active",
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [summaries, setSummaries] = useState<Summary[]>(mockSummaries)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addSummary = (summaryData: Omit<Summary, "id" | "createdAt">) => {
    const newSummary: Summary = {
      ...summaryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setSummaries((prev) => [newSummary, ...prev])
  }

  const deleteSummary = (id: string) => {
    setSummaries((prev) => prev.filter((summary) => summary.id !== id))
  }

  const updateSummary = (id: string, updates: Partial<Summary>) => {
    setSummaries((prev) => prev.map((summary) => (summary.id === id ? { ...summary, ...updates } : summary)))
  }

  const value: AppContextType = {
    summaries,
    loading,
    error,
    addSummary,
    deleteSummary,
    updateSummary,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export const useAppContext = useApp
