import { format, parseISO } from 'date-fns';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
}

export interface FormattedMessage extends ChatMessage {
  formattedTime: string;
  isConsecutive: boolean;
  showHeader: boolean;
}

export function formatChatMessages(messages: ChatMessage[]): FormattedMessage[] {
  if (!messages || messages.length === 0) return [];

  return messages.map((message, index) => {
    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1];
    
    const currentDate = parseISO(message.timestamp);
    const prevDate = prevMessage ? parseISO(prevMessage.timestamp) : null;
    
    // Check if this is the first message of the day
    const isNewDay = !prevDate || 
      format(currentDate, 'yyyy-MM-dd') !== format(prevDate, 'yyyy-MM-dd');
    
    // Check if this is a consecutive message from the same sender
    const isConsecutive = !!prevMessage && 
      prevMessage.sender === message.sender && 
      !isNewDay &&
      (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) < 5 * 60 * 1000; // 5 minutes

    // Format the time
    const formattedTime = format(currentDate, 'h:mm a');

    return {
      ...message,
      formattedTime,
      isConsecutive,
      showHeader: !isConsecutive || isNewDay,
    };
  });
}

export function formatMessageDate(timestamp: string): string {
  try {
    const date = parseISO(timestamp);
    const now = new Date();
    
    // Today
    if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
      return 'Today';
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    }
    
    // This week
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (date > weekAgo) {
      return format(date, 'EEEE'); // Day name (Monday, Tuesday, etc.)
    }
    
    // Older dates
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
