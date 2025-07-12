import { Summary as AppSummary } from "../contexts/app-context/types"

export type SortOption = "date" | "title" | "messages" | "participants"
export type SortOrder = "asc" | "desc"

// Extend the AppSummary type to match the SummaryCard's expected props
export interface Summary extends Omit<AppSummary, 'participants' | 'groupName'> {
  groupName: string
  participants?: number | string[]
}

export const formatSummaryForCard = (summary: AppSummary): Summary => ({
  ...summary,
  groupName: summary.groupName || 'Untitled Group',
  participants: Array.isArray(summary.participants) ? summary.participants.length : 0,
  title: summary.title || 'Untitled Summary',
  content: summary.content || '',
  date: summary.date || new Date(),
  groupId: summary.groupId || '',
  messageCount: summary.messageCount || 0,
  type: summary.type || 'custom',
  platform: summary.platform || 'whatsapp',
  isRead: summary.isRead || false,
  tags: summary.tags || []
})

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
  searchTerm: string,
  filterType: string,
  sortBy: SortOption,
  sortOrder: SortOrder
): Summary[] => {
  return summaries
    .map(formatSummaryForCard)
    .filter(summary => {
      const matchesSearch = searchTerm === '' || 
        summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.groupName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterType === 'all' || 
        (filterType === 'read' && summary.isRead) ||
        (filterType === 'unread' && !summary.isRead) ||
        summary.type === filterType
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'messages':
          comparison = (a.messageCount || 0) - (b.messageCount || 0)
          break
        case 'participants': {
          const aCount = Array.isArray(a.participants) ? a.participants.length : (a.participants || 0)
          const bCount = Array.isArray(b.participants) ? b.participants.length : (b.participants || 0)
          comparison = aCount - bCount
          break
        }
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
}

export const calculateDashboardStats = (summaries: AppSummary[]) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  return summaries.reduce((acc, summary) => {
    const summaryDate = new Date(summary.date)
    const isToday = summaryDate >= today
    
    return {
      total: acc.total + 1,
      active: acc.active + (summary.isRead ? 0 : 1),
      archived: acc.archived + (summary.isRead ? 1 : 0),
      todayCount: acc.todayCount + (isToday ? 1 : 0)
    };
  }, { total: 0, active: 0, archived: 0, todayCount: 0 });
}
