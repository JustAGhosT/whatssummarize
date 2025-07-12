// Shared types for the application contexts

export type Platform = "whatsapp" | "slack" | "discord" | "telegram" | "teams"

export interface Summary {
  id: string
  title: string
  content: string
  date: Date
  type: "group" | "cross-platform" | "daily" | "weekly" | "monthly" | "custom"
  platform: Platform | "cross-platform"
  groupId: string
  groupName: string
  messageCount: number
  participants: string[]
  tags: string[]
  isRead: boolean
  isArchived: boolean
  createdAt: string
  dateRange: {
    start: string
    end: string
  }
  keyTopics?: string[]
  sentiment?: "positive" | "neutral" | "negative"
  summary?: string
  messages?: any[] // Add this if needed for the application
  relevance?: number
  completeness?: number
  clarity?: number
}

export interface Group {
  id: string
  name: string
  platform: Platform
  participants: string[]
  lastActivity: Date
  unreadCount: number
  isActive: boolean
  avatar: string
}

export interface CrossPlatformGroup {
  id: string
  name: string
  description: string
  groups: Array<{ groupId: string; platform: Platform }>
  createdAt: Date
  lastUpdated: Date
  totalUnread: number
  isActive: boolean
}

export interface PersonalSummary {
  id: string
  title: string
  content: string
  contact: string
  date: string
  keyPoints: string[]
  archived: boolean
  messageCount: number
  dateRange: {
    start: string
    end: string
  }
  createdAt: string
  status: "draft" | "generated" | "shared"
  stats: PersonalSummaryStats
  insights: string[]
  topGroups: TopGroup[]
}

export interface PersonalSummaryStats {
  totalMessages: number
  activeGroups: number
  topGroup: string
  messagesByDay: number[]
}

export interface TopGroup {
  name: string
  messageCount: number
}

// Define our own types specific to the context

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: {
    theme?: 'light' | 'dark' | 'system'
    notifications?: {
      email?: boolean
      push?: boolean
      frequency?: 'immediate' | 'hourly' | 'daily' | 'weekly'
    }
  }
}

export interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (token: string, userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

export interface AppContextType {
  // State
  isLoading: boolean
  error: string | null
  
  // Data
  summaries: Summary[]
  groups: Group[]
  crossPlatformGroups: CrossPlatformGroup[]
  personalSummaries: PersonalSummary[]
  topGroups: TopGroup[]
  selectedPlatform: Platform | 'all'
  
  // Actions
  setSelectedPlatform: (platform: Platform | 'all') => void
  generateSummary: (groupId: string, type: 'weekly' | 'since-last-read') => Promise<Summary>
  generateCrossPlatformSummary: (crossGroupId: string, type: 'weekly' | 'since-last-read') => Promise<Summary>
  markSummaryAsRead: (summaryId: string) => void
  deleteSummary: (summaryId: string) => void
  createCrossPlatformGroup: (name: string, description: string, groupIds: Array<{ groupId: string; platform: Platform }>) => CrossPlatformGroup
  updateCrossPlatformGroup: (groupId: string, updates: Partial<CrossPlatformGroup>) => void
  deleteCrossPlatformGroup: (groupId: string) => void
  getFilteredSummaries: () => Summary[]
  getUnreadCount: () => number
  
  // Notifications
  markNotificationAsRead: (notificationId: string) => void
  
  // Helpers
  setError: (error: string | null) => void
  
  // Personal Summary actions
  createPersonalSummary: (summary: Omit<PersonalSummary, 'id' | 'createdAt' | 'status'>) => Promise<PersonalSummary | null>
  updatePersonalSummary: (id: string, updates: Partial<PersonalSummary>) => Promise<boolean>
  deletePersonalSummary: (id: string) => Promise<boolean>
}
