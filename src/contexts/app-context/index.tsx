"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { AppContextType, Summary, PersonalSummary, ShareChannel } from "./types"

const AppContext = createContext<AppContextType | undefined>(undefined)

const mockSummaries: Summary[] = [
  {
    id: "1",
    title: "Family Group",
    type: "weekly",
    content:
      "Weekly Family Updates: This week the family discussed vacation plans for summer, shared photos from weekend activities, and coordinated schedules for upcoming events.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    isArchived: false,
    groupName: "Family Group",
    participants: 8,
    messageCount: 156,
  },
  {
    id: "2",
    title: "Work Team",
    type: "daily",
    content:
      "Daily Standup Summary: Team discussed project milestones, resolved blockers, and planned sprint activities.",
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
    isArchived: false,
    groupName: "Work Team",
    participants: 12,
    messageCount: 89,
  },
  {
    id: "3",
    title: "Friends Chat",
    type: "weekly",
    content: "Weekly Friends Update: Planned weekend meetup, shared memes, and discussed upcoming events.",
    createdAt: "2024-01-13T15:30:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
    isArchived: false,
    groupName: "Friends Chat",
    participants: 6,
    messageCount: 234,
  },
]

const mockPersonalSummaries: PersonalSummary[] = [
  {
    id: "1",
    userId: "user1",
    weekStart: "2024-01-08",
    weekEnd: "2024-01-14",
    status: "shared",
    messageCount: 245,
    topGroups: [
      { name: "Family Group", messageCount: 89 },
      { name: "Work Team", messageCount: 67 },
      { name: "Friends Chat", messageCount: 89 },
    ],
    activityScore: 85,
    sharedChannels: ["email", "whatsapp"],
    generatedAt: "2024-01-15T10:00:00Z",
    sharedAt: "2024-01-15T10:30:00Z",
    content: "Your weekly activity summary shows high engagement across family and work groups.",
  },
  {
    id: "2",
    userId: "user1",
    weekStart: "2024-01-01",
    weekEnd: "2024-01-07",
    status: "generated",
    messageCount: 189,
    topGroups: [
      { name: "Family Group", messageCount: 67 },
      { name: "Friends Chat", messageCount: 78 },
      { name: "Work Team", messageCount: 44 },
    ],
    activityScore: 72,
    sharedChannels: [],
    generatedAt: "2024-01-08T09:00:00Z",
  },
]

const mockShareChannels: ShareChannel[] = [
  { id: "email", name: "Email", type: "email", icon: "📧", enabled: true },
  { id: "whatsapp", name: "WhatsApp", type: "whatsapp", icon: "💬", enabled: true },
  { id: "slack", name: "Slack", type: "slack", icon: "💼", enabled: true },
  { id: "teams", name: "Microsoft Teams", type: "teams", icon: "👥", enabled: false },
  { id: "telegram", name: "Telegram", type: "telegram", icon: "✈️", enabled: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [summaries, setSummaries] = useState<Summary[]>(mockSummaries)
  const [personalSummaries, setPersonalSummaries] = useState<PersonalSummary[]>(mockPersonalSummaries)
  const [shareChannels, setShareChannels] = useState<ShareChannel[]>(mockShareChannels)
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addSummary = (summaryData: Omit<Summary, "id" | "createdAt" | "updatedAt">) => {
    const newSummary: Summary = {
      ...summaryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSummaries((prev) => [newSummary, ...prev])
  }

  const updateSummary = (id: string, updates: Partial<Summary>) => {
    setSummaries((prev) =>
      prev.map((summary) =>
        summary.id === id ? { ...summary, ...updates, updatedAt: new Date().toISOString() } : summary,
      ),
    )
  }

  const deleteSummary = (id: string) => {
    setSummaries((prev) => prev.filter((summary) => summary.id !== id))
  }

  const archiveSummary = (id: string) => {
    updateSummary(id, { isArchived: true })
  }

  const generatePersonalSummary = async (weekStart: string, weekEnd: string): Promise<PersonalSummary> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newSummary: PersonalSummary = {
        id: Date.now().toString(),
        userId: "user1",
        weekStart,
        weekEnd,
        status: "generated",
        messageCount: Math.floor(Math.random() * 300) + 100,
        topGroups: [
          { name: "Family Group", messageCount: Math.floor(Math.random() * 100) + 20 },
          { name: "Work Team", messageCount: Math.floor(Math.random() * 80) + 15 },
          { name: "Friends Chat", messageCount: Math.floor(Math.random() * 120) + 25 },
        ],
        activityScore: Math.floor(Math.random() * 40) + 60,
        sharedChannels: [],
        generatedAt: new Date().toISOString(),
        content: `Your weekly activity summary for ${weekStart} to ${weekEnd} shows active participation across multiple groups.`,
      }

      setPersonalSummaries((prev) => [newSummary, ...prev])
      return newSummary
    } catch (err) {
      setError("Failed to generate personal summary")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const sharePersonalSummary = async (id: string, channels: string[]): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPersonalSummaries((prev) =>
        prev.map((summary) =>
          summary.id === id
            ? {
                ...summary,
                status: "shared" as const,
                sharedChannels: channels,
                sharedAt: new Date().toISOString(),
              }
            : summary,
        ),
      )
    } catch (err) {
      setError("Failed to share personal summary")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateShareChannel = (id: string, updates: Partial<ShareChannel>) => {
    setShareChannels((prev) => prev.map((channel) => (channel.id === id ? { ...channel, ...updates } : channel)))
  }

  const value: AppContextType = {
    summaries,
    setSummaries,
    addSummary,
    updateSummary,
    deleteSummary,
    archiveSummary,
    personalSummaries,
    setPersonalSummaries,
    generatePersonalSummary,
    sharePersonalSummary,
    shareChannels,
    setShareChannels,
    updateShareChannel,
    filter,
    setFilter,
    isLoading,
    setIsLoading,
    error,
    setError,
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
