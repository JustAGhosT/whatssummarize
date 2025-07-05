export interface User {
  id: string
  name: string
  email: string
}

export interface WhatsAppGroup {
  id: string
  name: string
  avatar: string
  memberCount: number
  lastActivity: string
  isConnected: boolean
}

export interface Summary {
  id: string
  groupId: string
  groupName: string
  title: string
  content: string
  type: "weekly" | "missed" | "topic-based"
  createdAt: string
  period: {
    start: string
    end: string
  }
}

export interface UserPreferences {
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
  createdAt: string
}

export interface NotificationSetting {
  id: string
  type: "summary-ready" | "while-away" | "scheduled-digest"
  isEnabled: boolean
  config: Record<string, any>
}

export interface AppState {
  user: User | null
  groups: WhatsAppGroup[]
  summaries: Summary[]
  preferences: UserPreferences
  distributionChannels: DistributionChannel[]
  notifications: NotificationSetting[]
  isLoading: boolean
  error: string | null
}

export type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_GROUPS"; payload: WhatsAppGroup[] }
  | { type: "SET_SUMMARIES"; payload: Summary[] }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<UserPreferences> }
  | { type: "ADD_DISTRIBUTION_CHANNEL"; payload: DistributionChannel }
  | { type: "SET_DISTRIBUTION_CHANNELS"; payload: DistributionChannel[] }
  | { type: "ADD_NOTIFICATION"; payload: NotificationSetting }
