// Base types
export interface BaseContextState<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, userData: User) => boolean;
  logout: () => boolean;
  updateUser: (updates: Partial<User>) => boolean;
}

// App types
export interface Summary {
  id: string;
  title: string;
  content: string;
  date: Date;
  type: string;
  platform: Platform;
  groupId: string;
  groupName: string;
  messageCount: number;
  participants: string[];
  tags: string[];
  isRead: boolean;
  isArchived: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  platform: Platform;
  participants: string[];
  lastActivity: Date;
  unreadCount: number;
  isActive: boolean;
  avatar?: string;
}

export interface CrossPlatformGroup {
  id: string;
  name: string;
  description: string;
  groups: Array<{
    groupId: string;
    platform: Platform;
  }>;
  createdAt: Date;
  lastUpdated: Date;
  totalUnread: number;
  isActive: boolean;
}

export interface PersonalSummaryStats {
  totalMessages: number;
  activeGroups: number;
  topGroup: string;
  messagesByDay: number[];
}

export interface TopGroup {
  name: string;
  messageCount: number;
}

export interface PersonalSummary {
  id: string;
  title: string;
  content: string;
  contact: string;
  date: string;
  keyPoints: string[];
  archived: boolean;
  messageCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
  status: string;
  stats: PersonalSummaryStats;
  insights: string[];
  topGroups: TopGroup[];
}

export type Platform = 'whatsapp' | 'telegram' | 'signal' | 'discord';

export interface AppContextType {
  summaries: Summary[];
  groups: Group[];
  crossPlatformGroups: CrossPlatformGroup[];
  personalSummaries: PersonalSummary[];
  topGroups: TopGroup[];
  activeSummary: Summary | null;
  activeGroup: Group | null;
  activePersonalSummary: PersonalSummary | null;
  isLoading: boolean;
  error: string | null;
  selectedPlatform: Platform | 'all';
  setSelectedPlatform: (platform: Platform | 'all') => void;
  generateSummary: (groupId: string, type?: 'weekly' | 'since-last-read') => Promise<Summary>;
  generateCrossPlatformSummary: (groupId: string, type?: 'weekly' | 'since-last-read') => Promise<Summary>;
  markSummaryAsRead: (id: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  deleteSummary: (id: string) => void;
  createCrossPlatformGroup: (name: string, description: string, groupIds: Array<{ groupId: string; platform: Platform }>) => CrossPlatformGroup;
  updateCrossPlatformGroup: (groupId: string, updates: Partial<CrossPlatformGroup>) => void;
  deleteCrossPlatformGroup: (groupId: string) => void;
  getFilteredSummaries: () => Summary[];
  getUnreadCount: () => number;
  setError: (error: string | null) => void;
  createPersonalSummary: (summary: Omit<PersonalSummary, 'id' | 'createdAt' | 'status'>) => Promise<PersonalSummary | null>;
  updatePersonalSummary: (id: string, updates: Partial<PersonalSummary>) => Promise<boolean>;
  deletePersonalSummary: (id: string) => Promise<boolean>;
}
