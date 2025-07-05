export interface Summary {
  id: string
  title: string
  type: "daily" | "weekly" | "monthly"
  content: string
  createdAt: string
  updatedAt: string
  isArchived: boolean
  groupName?: string
  participants?: number
  messageCount?: number
}

export interface PersonalSummary {
  id: string
  userId: string
  weekStart: string
  weekEnd: string
  status: "draft" | "generated" | "shared"
  messageCount: number
  topGroups: Array<{
    name: string
    messageCount: number
  }>
  activityScore: number
  sharedChannels: string[]
  generatedAt?: string
  sharedAt?: string
  content?: string
}

export interface ShareChannel {
  id: string
  name: string
  type: "email" | "whatsapp" | "slack" | "teams" | "telegram"
  icon: string
  enabled: boolean
}

export interface AppContextType {
  // Summaries
  summaries: Summary[]
  setSummaries: (summaries: Summary[]) => void
  addSummary: (summary: Omit<Summary, "id" | "createdAt" | "updatedAt">) => void
  updateSummary: (id: string, updates: Partial<Summary>) => void
  deleteSummary: (id: string) => void
  archiveSummary: (id: string) => void

  // Personal Summaries
  personalSummaries: PersonalSummary[]
  setPersonalSummaries: (summaries: PersonalSummary[]) => void
  generatePersonalSummary: (weekStart: string, weekEnd: string) => Promise<PersonalSummary>
  sharePersonalSummary: (id: string, channels: string[]) => Promise<void>

  // Share Channels
  shareChannels: ShareChannel[]
  setShareChannels: (channels: ShareChannel[]) => void
  updateShareChannel: (id: string, updates: Partial<ShareChannel>) => void

  // Filters
  filter: string
  setFilter: (filter: string) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Error handling
  error: string | null
  setError: (error: string | null) => void
}
