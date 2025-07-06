"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AppContextType, Summary, PersonalSummary } from "./types"

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [personalSummaries, setPersonalSummaries] = useState<PersonalSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data initialization
  useEffect(() => {
    const mockSummaries: Summary[] = [
      {
        id: "1",
        title: "Family Group",
        content: "Weekly Family Updates: This week the family discussed vacation plans for summer...",
        groupName: "Family Group",
        type: "weekly",
        createdAt: "2024-01-15T12:00:00Z",
        isArchived: false,
        messageCount: 156,
        participants: 8,
        dateRange: {
          start: "2024-01-08",
          end: "2024-01-14",
        },
        keyTopics: ["Vacation Planning", "School Updates", "Weekend Plans"],
        sentiment: "positive",
        summary: "The family group had an active week discussing upcoming vacation plans and sharing school updates.",
      },
      {
        id: "2",
        title: "Work Team",
        content: "Daily Standup Summary: Team discussed project milestones, resolved blockers...",
        groupName: "Work Team",
        type: "daily",
        createdAt: "2024-01-14T11:00:00Z",
        isArchived: false,
        messageCount: 89,
        participants: 12,
        dateRange: {
          start: "2024-01-14",
          end: "2024-01-14",
        },
        keyTopics: ["Project Milestones", "Bug Fixes", "Sprint Planning"],
        sentiment: "neutral",
        summary: "Daily standup covered project progress and upcoming sprint planning activities.",
      },
      {
        id: "3",
        title: "Friends Chat",
        content: "Weekly Friends Update: Planned weekend meetup at the new restaurant downtown...",
        groupName: "Friends Chat",
        type: "weekly",
        createdAt: "2024-01-13T05:30:00Z",
        isArchived: false,
        messageCount: 234,
        participants: 6,
        dateRange: {
          start: "2024-01-07",
          end: "2024-01-13",
        },
        keyTopics: ["Weekend Plans", "Restaurant Reviews", "Movie Discussions"],
        sentiment: "positive",
        summary: "Friends planned weekend activities and shared restaurant recommendations.",
      },
      {
        id: "4",
        title: "Book Club",
        content: "Monthly Book Discussion: This month we discussed 'The Seven Husbands of Evelyn Hugo'...",
        groupName: "Book Club",
        type: "monthly",
        createdAt: "2024-01-01T10:00:00Z",
        isArchived: true,
        messageCount: 67,
        participants: 15,
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-31",
        },
        keyTopics: ["Book Analysis", "Character Discussion", "Next Book Selection"],
        sentiment: "positive",
        summary: "Book club members had an engaging discussion about the monthly book selection.",
      },
    ]

    const mockPersonalSummaries: PersonalSummary[] = [
      {
        id: "p1",
        title: "Weekly Personal Summary - Jan 8-14",
        content: "This week you were most active in the Family Group with 45 messages...",
        dateRange: {
          start: "2024-01-08",
          end: "2024-01-14",
        },
        createdAt: "2024-01-15T09:00:00Z",
        status: "generated",
        stats: {
          totalMessages: 89,
          activeGroups: 3,
          topGroup: "Family Group",
          messagesByDay: [12, 8, 15, 20, 18, 10, 6],
        },
        insights: [
          "Most active on Thursday with 20 messages",
          "Family Group was your most engaged conversation",
          "You initiated 12 new conversation topics this week",
        ],
        topGroups: [
          { name: "Family Group", messageCount: 45 },
          { name: "Work Team", messageCount: 28 },
          { name: "Friends Chat", messageCount: 16 },
        ],
      },
      {
        id: "p2",
        title: "Weekly Personal Summary - Jan 1-7",
        content: "This week you were most active in the Work Team with 32 messages...",
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-07",
        },
        createdAt: "2024-01-08T09:00:00Z",
        status: "shared",
        stats: {
          totalMessages: 67,
          activeGroups: 2,
          topGroup: "Work Team",
          messagesByDay: [8, 12, 15, 10, 14, 6, 2],
        },
        insights: [
          "Most active on Wednesday with 15 messages",
          "Work Team dominated your conversations this week",
          "You shared 8 important updates across groups",
        ],
        topGroups: [
          { name: "Work Team", messageCount: 32 },
          { name: "Friends Chat", messageCount: 35 },
        ],
      },
    ]

    setSummaries(mockSummaries)
    setPersonalSummaries(mockPersonalSummaries)
  }, [])

  const deleteSummary = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSummaries((prev) => prev.filter((summary) => summary.id !== id))
    } catch (err) {
      setError("Failed to delete summary")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSummary = async (id: string, updates: Partial<Summary>) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSummaries((prev) => prev.map((summary) => (summary.id === id ? { ...summary, ...updates } : summary)))
    } catch (err) {
      setError("Failed to update summary")
    } finally {
      setIsLoading(false)
    }
  }

  const generatePersonalSummary = async (startDate: string, endDate: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newSummary: PersonalSummary = {
        id: `p${Date.now()}`,
        title: `Weekly Personal Summary - ${startDate} to ${endDate}`,
        content: "Generated summary content...",
        dateRange: {
          start: startDate,
          end: endDate,
        },
        createdAt: new Date().toISOString(),
        status: "generated",
        stats: {
          totalMessages: Math.floor(Math.random() * 100) + 50,
          activeGroups: Math.floor(Math.random() * 5) + 2,
          topGroup: "Family Group",
          messagesByDay: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5),
        },
        insights: [
          "Most active day was determined by your messaging patterns",
          "Your top conversation group showed high engagement",
          "You initiated several meaningful discussions this week",
        ],
        topGroups: [
          { name: "Family Group", messageCount: Math.floor(Math.random() * 30) + 20 },
          { name: "Work Team", messageCount: Math.floor(Math.random() * 25) + 15 },
          { name: "Friends Chat", messageCount: Math.floor(Math.random() * 20) + 10 },
        ],
      }

      setPersonalSummaries((prev) => [newSummary, ...prev])
    } catch (err) {
      setError("Failed to generate personal summary")
    } finally {
      setIsLoading(false)
    }
  }

  const sharePersonalSummary = async (id: string, channels: string[]) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPersonalSummaries((prev) =>
        prev.map((summary) => (summary.id === id ? { ...summary, status: "shared" as const } : summary)),
      )
    } catch (err) {
      setError("Failed to share personal summary")
    } finally {
      setIsLoading(false)
    }
  }

  const value: AppContextType = {
    summaries,
    personalSummaries,
    isLoading,
    error,
    deleteSummary,
    updateSummary,
    generatePersonalSummary,
    sharePersonalSummary,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
