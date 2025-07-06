export interface Summary {
  id: string
  title: string
  content: string
  groupName: string
  type: "daily" | "weekly" | "monthly" | "custom"
  createdAt: string
  isArchived: boolean
  messageCount?: number
  participants?: number
  dateRange: {
    start: string
    end: string
  }
  keyTopics?: string[]
  sentiment?: "positive" | "neutral" | "negative"
  summary?: string
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

export interface PersonalSummary {
  id: string
  title: string
  content: string
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

export interface AppContextType {
  summaries: Summary[]
  personalSummaries: PersonalSummary[]
  isLoading: boolean
  error: string | null
  deleteSummary: (id: string) => Promise<void>
  updateSummary: (id: string, updates: Partial<Summary>) => Promise<void>
  generatePersonalSummary: (startDate: string, endDate: string) => Promise<void>
  sharePersonalSummary: (id: string, channels: string[]) => Promise<void>
}
