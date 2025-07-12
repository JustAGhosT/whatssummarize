export interface Summary {
  id: string;
  title: string;
  date: string;
  isRead: boolean;
  messages: number;
  participants: number | string[];
  groupName: string;
  // Add any other properties that your Summary type should have
}

export interface DashboardStats {
  total: number;
  active: number;
  archived: number;
  todayCount: number;
}

export type SortOption = "date" | "title" | "messages" | "participants";
export type SortOrder = "asc" | "desc";
