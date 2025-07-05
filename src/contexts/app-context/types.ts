export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface WhatsAppGroup {
  id: string
  name: string
  description?: string
  memberCount: number
  isActive: boolean
  lastActivity: string
}

export interface Summary {
  id: string
  groupName: string
  title: string
  content: string
  createdAt: string
  type: "weekly" | "missed" | "topic-based"
  status: "active" | "archived"
}

export interface Preferences {
  summaryTypes: {
    weeklyDigest: boolean
    missedMessages: boolean
    topicBased: boolean
  }
  schedule: {
    frequency: "daily" | "weekly" | "monthly"
    time: string
  }
  keywords: string[]
}

export interface DistributionChannel {
  id: string
  type: "email" | "whatsapp" | "slack" | "teams"
  name: string
  config: Record<string, any>
  isEnabled: boolean
}

export interface Notification {
  id: string
  type: "summary-ready" | "while-away" | "scheduled-digest"
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface AppState {
  user: User | null
  groups: WhatsAppGroup[]
  summaries: Summary[]
  preferences: Preferences
  distributionChannels: DistributionChannel[]
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}

export type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_GROUPS"; payload: WhatsAppGroup[] }
  | { type: "SET_SUMMARIES"; payload: Summary[] }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<Preferences> }
  | { type: "ADD_DISTRIBUTION_CHANNEL"; payload: DistributionChannel }
  | { type: "SET_DISTRIBUTION_CHANNELS"; payload: DistributionChannel[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }

export interface AppContextType {
  summaries: Summary[]
  loading: boolean
  error: string | null
  addSummary: (summary: Omit<Summary, "id" | "createdAt">) => void
  deleteSummary: (id: string) => void
  updateSummary: (id: string, updates: Partial<Summary>) => void
}
