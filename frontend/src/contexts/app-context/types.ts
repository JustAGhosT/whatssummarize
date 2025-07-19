import { Platform } from '@/types/contexts';

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
    timeZone?: string;
  };
}

export interface DashboardStats {
  total: number;
  active: number;
  archived: number;
  todayCount: number;
}

export type SortOption = "date" | "title" | "messages" | "participants";
export type SortOrder = "asc" | "desc";
