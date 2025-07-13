import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { isToday } from 'date-fns/isToday';
import { isYesterday } from 'date-fns/isYesterday';
import { isThisWeek } from 'date-fns/isThisWeek';

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

/**
 * Formats a list of chat messages with additional formatting information
 * @param messages - Array of chat messages to format
 * @returns Array of formatted chat messages with additional metadata
 */
export function formatChatMessages(messages: ChatMessage[]): FormattedMessage[] {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [];
  }

  return messages.map((message, index) => {
    try {
      const prevMessage = messages[index - 1];
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
        showHeader: !prevMessage || isNewDay,
      };
    } catch (error) {
      console.error('Error formatting message:', error);
      // Return a safe default for the message
      return {
        ...message,
        formattedTime: '--:-- --',
        isConsecutive: false,
        showHeader: true,
      };
    }
  });
}

/**
 * Formats a timestamp into a user-friendly date string
 * @param timestamp - ISO timestamp string to format
 * @returns Formatted date string (e.g., "Today", "Yesterday", "Monday", "Jan 1, 2023")
 */
export function formatMessageDate(timestamp: string): string {
  if (!timestamp) return '';
  
  try {
    const date = parseISO(timestamp);
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    if (isToday(date)) {
      return 'Today';
    }
    
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    
    if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, 'EEEE'); // Day name (Monday, Tuesday, etc.)
    }
    
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
