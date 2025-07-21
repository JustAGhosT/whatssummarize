import { format, parseISO, isToday, isYesterday, isThisWeek } from 'date-fns';

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
      
      // Check if this is the first message of the day by comparing local dates
      const isNewDay = !prevDate || 
        currentDate.getDate() !== prevDate.getDate() ||
        currentDate.getMonth() !== prevDate.getMonth() ||
        currentDate.getFullYear() !== prevDate.getFullYear();
        
      // Debug log for date comparison
      if (message.id === '1' || message.id === '2') {
        console.log(`[${message.id}] Date comparison:`, {
          currentDate: currentDate.toISOString(),
          prevDate: prevDate?.toISOString(),
          currentLocal: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
          prevLocal: prevDate ? `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}` : 'none',
          isNewDay
        });
      }
        
      // Debug log for day comparison
      if (message.id === '1' || message.id === '2') {
        console.log('Day comparison (local time):', {
          currentDate: currentDate.toString(),
          prevDate: prevDate?.toString(),
          currentLocalDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
          prevLocalDate: prevDate ? `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}` : 'none',
          isNewDay
        });
      }
      
      // Check if this is a consecutive message from the same sender
      const timeDiff = prevMessage ? new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() : 0;
      const isConsecutive = !!prevMessage && 
        prevMessage.sender === message.sender && 
        !isNewDay &&
        timeDiff < 5 * 60 * 1000; // 5 minutes
        
      // Debug logging
      if (message.id === '3' || message.id === '2') {
        console.log(`Message ${message.id} debug:`, {
          prevMessage: prevMessage ? { 
            id: prevMessage.id, 
            sender: prevMessage.sender, 
            timestamp: prevMessage.timestamp,
            date: prevDate ? format(prevDate, 'yyyy-MM-dd HH:mm:ss') : null
          } : null,
          currentMessage: { 
            id: message.id, 
            sender: message.sender, 
            timestamp: message.timestamp,
            date: format(currentDate, 'yyyy-MM-dd HH:mm:ss')
          },
          sameSender: prevMessage ? prevMessage.sender === message.sender : false,
          isNewDay,
          timeDiff,
          isConsecutive
        });
      }

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
