import { NotificationBase } from "@/types/notifications"

export const mockNotifications: NotificationBase[] = [
  {
    id: "1",
    type: "summary-ready",
    title: "New Summary Available",
    message: "Your weekly summary for Family Group is ready to view.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    actionUrl: "/personal/summary/1"
  },
  {
    id: "2",
    type: "while-away",
    title: "Messages While Away",
    message: "You have 15 new messages in Work Team that need summarizing.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionUrl: "/groups/work-team"
  },
  {
    id: "3",
    type: "scheduled-digest",
    title: "Daily Digest",
    message: "Your daily digest has been sent to your email.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    actionUrl: "/digests/daily"
  },
  {
    id: "4",
    type: "summary",
    title: "New Group Summary",
    message: "A new summary is available for the Developers group.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    actionUrl: "/groups/developers/summary/123"
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "New features and improvements have been deployed.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    actionUrl: "/changelog"
  }
]
