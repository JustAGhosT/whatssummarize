import { NotificationBase } from "@/types/notifications";

export const mockNotifications: NotificationBase[] = [
  {
    id: "notif-1",
    title: "New Summary Available",
    message: "Your weekly summary for 'Family Group' is ready to view.",
    type: "summary-ready",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    actionUrl: "/summaries/1"
  },
  {
    id: "notif-2",
    title: "While You Were Away",
    message: "There were 25 new messages in 'Work Team' while you were away.",
    type: "while-away",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    actionUrl: "/groups/2"
  },
  {
    id: "notif-3",
    title: "Scheduled Digest",
    message: "Your monthly digest for all groups is now available.",
    type: "scheduled-digest",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionUrl: "/summaries"
  }
];