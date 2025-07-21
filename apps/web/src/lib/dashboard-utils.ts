import { Summary as AppSummary, Platform } from "@/types/contexts";

export type SortOption = "date" | "title" | "messages" | "participants";
export type SortOrder = "asc" | "desc";

// Define a simplified version of the Summary interface for card display
export interface SummaryCardProps {
  id: string;
  title: string;
  content: string;
  date: Date;
  type: string;
  platform: Platform;
  groupId: string;
  groupName: string;
  messageCount: number;
  messages?: number; // Alias for messageCount for backward compatibility
  participants: number | string[];
  tags: string[];
  isRead: boolean;
  isArchived: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const formatSummaryForCard = (summary: Partial<AppSummary> & { groupName?: string }): SummaryCardProps => {
  const now = new Date();
  const timestamp = now.toISOString();
  
  return {
    id: summary.id || '',
    title: summary.title || 'Untitled Summary',
    content: summary.content || '',
    date: summary.date || now,
    type: summary.type || 'custom',
    platform: summary.platform || 'whatsapp',
    groupId: summary.groupId || '',
    groupName: summary.groupName || 'Untitled Group',
    messageCount: summary.messageCount || 0,
    messages: summary.messageCount || 0, // For backward compatibility
    participants: Array.isArray(summary.participants) 
      ? summary.participants.length 
      : (summary.participants || 0),
    tags: summary.tags || [],
    isRead: summary.isRead || false,
    isArchived: summary.isArchived || false,
    dateRange: summary.dateRange || {
      start: timestamp,
      end: timestamp
    },
    createdAt: (summary as any).createdAt || timestamp,
    updatedAt: (summary as any).updatedAt || timestamp
  };
};

export const calculateContrastRatio = (hexColor: string): number => {
  if (!hexColor || hexColor.length < 7) return 1
  
  try {
    const r = parseInt(hexColor.slice(1, 3), 16) / 255
    const g = parseInt(hexColor.slice(3, 5), 16) / 255
    const b = parseInt(hexColor.slice(5, 7), 16) / 255

    const [red, green, blue] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )
    
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    return (luminance + 0.05) / 0.05
  } catch {
    return 1
  }
}

export const formatNumber = (num: number): string => 
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const filterAndSortSummaries = (
  summaries: AppSummary[],
  searchQuery: string = "",
  filters: {
    dateRange?: { start: Date | null; end: Date | null };
    platforms?: string[];
    readStatus?: 'all' | 'read' | 'unread';
    type?: string;
  } = {},
  sortBy: SortOption = "date",
  sortOrder: SortOrder = "desc"
): SummaryCardProps[] => {
  return summaries
    .map(formatSummaryForCard)
    .filter(summary => {
      // Search by query
      const matchesSearch = searchQuery === '' || 
        summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summary.groupName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by read status
      const matchesReadStatus = !filters.readStatus || 
        filters.readStatus === 'all' || 
        (filters.readStatus === 'read' && summary.isRead) ||
        (filters.readStatus === 'unread' && !summary.isRead);
      
      // Filter by platform
      const matchesPlatform = !filters.platforms || 
        filters.platforms.length === 0 || 
        (summary.platform && filters.platforms.includes(summary.platform));
      
      // Filter by type
      const matchesType = !filters.type || 
        filters.type === 'all' || 
        summary.type === filters.type;
      
      // Filter by date range
      const matchesDateRange = !filters.dateRange || 
        !filters.dateRange.start || 
        !filters.dateRange.end || 
        (new Date(summary.date) >= new Date(filters.dateRange.start) && 
         new Date(summary.date) <= new Date(filters.dateRange.end));
      
      return matchesSearch && matchesReadStatus && matchesPlatform && matchesType && matchesDateRange;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'messages':
          comparison = (a.messageCount || 0) - (b.messageCount || 0);
          break;
        case 'participants': {
          const aCount = Array.isArray(a.participants) ? a.participants.length : (a.participants || 0);
          const bCount = Array.isArray(b.participants) ? b.participants.length : (b.participants || 0);
          comparison = aCount - bCount;
          break;
        }
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
}

export interface DashboardStats {
  total: number;
  unread: number;
  recent: number;
  read: number;
  lastUpdated: string;
  byPlatform: Record<string, number>;
  byType: Record<string, number>;
}

export const calculateDashboardStats = (summaries: AppSummary[]): DashboardStats => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentSummaries = summaries.filter(
    summary => summary.date && new Date(summary.date) >= oneWeekAgo
  );
  
  const unreadCount = summaries.filter(summary => !summary.isRead).length;
  
  // Calculate stats by platform
  const byPlatform = summaries.reduce<Record<string, number>>((acc, summary) => {
    const platform = summary.platform || 'unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate stats by type
  const byType = summaries.reduce<Record<string, number>>((acc, summary) => {
    const type = summary.type || 'custom';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  return {
    total: summaries.length,
    unread: unreadCount,
    recent: recentSummaries.length,
    read: summaries.length - unreadCount,
    lastUpdated: now.toISOString(),
    byPlatform,
    byType
  };
};
