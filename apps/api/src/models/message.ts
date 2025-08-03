export interface Message {
  id: string;
  groupName: string;
  sender: string;
  content: string;
  timestamp: Date;
  isMedia: boolean;
  mediaUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  lastChecked: Date;
  isActive: boolean;
}
