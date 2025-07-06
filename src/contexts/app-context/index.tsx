"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { AppContextType, Summary, Group, Platform, CrossPlatformGroup } from "./types"

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

const mockSummaries: Summary[] = [
  {
    id: "1",
    title: "Family Group Chat",
    content: "Discussion about weekend plans and family dinner arrangements.",
    date: new Date("2024-01-15"),
    type: "group",
    platform: "whatsapp",
    groupId: "family-group",
    messageCount: 45,
    participants: ["Mom", "Dad", "Sister", "Brother"],
    tags: ["family", "weekend", "dinner"],
    isRead: false,
  },
  {
    id: "2",
    title: "Work Team Discussion",
    content: "Project updates and deadline discussions for Q1 deliverables.",
    date: new Date("2024-01-14"),
    type: "group",
    platform: "slack",
    groupId: "work-team",
    messageCount: 78,
    participants: ["Alice", "Bob", "Charlie", "Diana"],
    tags: ["work", "project", "deadline"],
    isRead: true,
  },
]

const mockGroups: Group[] = [
  {
    id: "family-group",
    name: "Family Group",
    platform: "whatsapp",
    participants: ["Mom", "Dad", "Sister", "Brother"],
    lastActivity: new Date("2024-01-15"),
    unreadCount: 12,
    isActive: true,
    avatar: "👨‍👩‍👧‍👦",
  },
  {
    id: "work-team",
    name: "Work Team",
    platform: "slack",
    participants: ["Alice", "Bob", "Charlie", "Diana"],
    lastActivity: new Date("2024-01-14"),
    unreadCount: 5,
    isActive: true,
    avatar: "💼",
  },
]

const mockCrossPlatformGroups: CrossPlatformGroup[] = [
  {
    id: "work-communications",
    name: "Work Communications",
    description: "All work-related chats across platforms",
    groups: [
      { groupId: "work-team", platform: "slack" },
      { groupId: "dev-team", platform: "discord" },
      { groupId: "management", platform: "teams" },
    ],
    createdAt: new Date("2024-01-10"),
    lastUpdated: new Date("2024-01-15"),
    totalUnread: 23,
    isActive: true,
  },
]

export function AppProvider({ children }: AppProviderProps) {
  const [summaries, setSummaries] = useState<Summary[]>(mockSummaries)
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [crossPlatformGroups, setCrossPlatformGroups] = useState<CrossPlatformGroup[]>(mockCrossPlatformGroups)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all")
  const [isLoading, setIsLoading] = useState(false)

  const generateSummary = async (groupId: string, type: "weekly" | "since-last-read") => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const group = groups.find((g) => g.id === groupId)
      if (!group) throw new Error("Group not found")

      const newSummary: Summary = {
        id: Date.now().toString(),
        title: `${type === "weekly" ? "Weekly" : "Since Last Read"} Summary - ${group.name}`,
        content: `Generated ${type} summary for ${group.name} with ${Math.floor(Math.random() * 100)} messages.`,
        date: new Date(),
        type: "group",
        platform: group.platform,
        groupId,
        messageCount: Math.floor(Math.random() * 100),
        participants: group.participants,
        tags: [type, group.platform],
        isRead: false,
      }

      setSummaries((prev) => [newSummary, ...prev])
      return newSummary
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const generateCrossPlatformSummary = async (crossGroupId: string, type: "weekly" | "since-last-read") => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const crossGroup = crossPlatformGroups.find((g) => g.id === crossGroupId)
      if (!crossGroup) throw new Error("Cross-platform group not found")

      const newSummary: Summary = {
        id: Date.now().toString(),
        title: `${type === "weekly" ? "Weekly" : "Since Last Read"} Summary - ${crossGroup.name}`,
        content: `Generated ${type} cross-platform summary for ${crossGroup.name} across ${crossGroup.groups.length} platforms.`,
        date: new Date(),
        type: "cross-platform",
        platform: "cross-platform",
        groupId: crossGroupId,
        messageCount: Math.floor(Math.random() * 200),
        participants: [],
        tags: [type, "cross-platform"],
        isRead: false,
      }

      setSummaries((prev) => [newSummary, ...prev])
      return newSummary
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const markSummaryAsRead = (summaryId: string) => {
    setSummaries((prev) => prev.map((s) => (s.id === summaryId ? { ...s, isRead: true } : s)))
  }

  const deleteSummary = (summaryId: string) => {
    setSummaries((prev) => prev.filter((s) => s.id !== summaryId))
  }

  const createCrossPlatformGroup = (
    name: string,
    description: string,
    groupIds: Array<{ groupId: string; platform: Platform }>,
  ) => {
    const newGroup: CrossPlatformGroup = {
      id: Date.now().toString(),
      name,
      description,
      groups: groupIds,
      createdAt: new Date(),
      lastUpdated: new Date(),
      totalUnread: 0,
      isActive: true,
    }

    setCrossPlatformGroups((prev) => [...prev, newGroup])
    return newGroup
  }

  const updateCrossPlatformGroup = (groupId: string, updates: Partial<CrossPlatformGroup>) => {
    setCrossPlatformGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...updates, lastUpdated: new Date() } : g)),
    )
  }

  const deleteCrossPlatformGroup = (groupId: string) => {
    setCrossPlatformGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  const getFilteredSummaries = () => {
    if (selectedPlatform === "all") return summaries
    return summaries.filter((s) => s.platform === selectedPlatform)
  }

  const getUnreadCount = () => {
    return summaries.filter((s) => !s.isRead).length
  }

  const value: AppContextType = {
    summaries,
    groups,
    crossPlatformGroups,
    selectedPlatform,
    isLoading,
    setSelectedPlatform,
    generateSummary,
    generateCrossPlatformSummary,
    markSummaryAsRead,
    deleteSummary,
    createCrossPlatformGroup,
    updateCrossPlatformGroup,
    deleteCrossPlatformGroup,
    getFilteredSummaries,
    getUnreadCount,
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
