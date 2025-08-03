// Basic types for app context
export type Platform = 'whatsapp' | 'telegram' | 'signal' | 'discord';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
  role?: string;
  settings?: Record<string, any>;
}

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
}

export interface CrossPlatformGroup {
  id: string;
  name: string;
  description: string;
  groups: Array<{ groupId: string; platform: Platform }>;
  createdAt: Date;
  lastUpdated: Date;
  totalUnread: number;
  isActive: boolean;
}

export interface PersonalSummary {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: 'generated' | 'pending' | 'failed';
}

export interface TopGroup {
  id: string;
  name: string;
  platform: Platform;
  messageCount: number;
}

export interface AppContextType {
  isLoading: boolean;
  error: string | null;
  summaries: Summary[];
  groups: Group[];
  crossPlatformGroups: CrossPlatformGroup[];
  personalSummaries: PersonalSummary[];
  topGroups: TopGroup[];
  selectedPlatform: Platform | 'all';
  setSelectedPlatform: (platform: Platform | 'all') => void;
  generateSummary: (groupId: string, type?: 'weekly' | 'since-last-read') => Promise<Summary>;
  generateCrossPlatformSummary: (crossGroupId: string, type?: 'weekly' | 'since-last-read') => Promise<Summary>;
  markSummaryAsRead: (summaryId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  deleteSummary: (summaryId: string) => void;
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