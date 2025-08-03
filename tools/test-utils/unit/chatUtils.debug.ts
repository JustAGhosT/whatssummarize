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
      
      // Debug log for the current message
      console.log(`\n--- Processing message ${message.id} (${message.timestamp}) ---`);
      console.log('Current date (local):', {
        dateString: currentDate.toString(),
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate(),
        hours: currentDate.getHours(),
        minutes: currentDate.getMinutes(),
        seconds: currentDate.getSeconds(),
        timezoneOffset: currentDate.getTimezoneOffset(),
        toLocaleString: currentDate.toLocaleString(),
        toISOString: currentDate.toISOString()
      });
      
      // Check if this is the first message of the day by comparing local dates
      const isNewDay = !prevDate || 
        currentDate.getDate() !== prevDate.getDate() ||
        currentDate.getMonth() !== prevDate.getMonth() ||
        currentDate.getFullYear() !== prevDate.getFullYear();
      
      // Detailed debug log for day comparison
      if (prevDate) {
        console.log('Previous date (local):', {
          dateString: prevDate.toString(),
          year: prevDate.getFullYear(),
          month: prevDate.getMonth(),
          day: prevDate.getDate(),
          hours: prevDate.getHours(),
          minutes: prevDate.getMinutes(),
          seconds: prevDate.getSeconds(),
          timezoneOffset: prevDate.getTimezoneOffset(),
          toLocaleString: prevDate.toLocaleString(),
          toISOString: prevDate.toISOString()
        });
        
        console.log('Day comparison:', {
          currentDate: currentDate.getDate(),
          prevDate: prevDate.getDate(),
          currentMonth: currentDate.getMonth(),
          prevMonth: prevDate.getMonth(),
          currentYear: currentDate.getFullYear(),
          prevYear: prevDate.getFullYear(),
          isNewDay
        });
      }
      
      // Check if this is a consecutive message from the same sender
      const timeDiff = prevMessage ? new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() : 0;
      const isConsecutive = !!prevMessage && 
        prevMessage.sender === message.sender && 
        !isNewDay &&
        timeDiff < 5 * 60 * 1000; // 5 minutes
      
      // Format the time
      const formattedTime = format(currentDate, 'h:mm a');
      
      const result = {
        ...message,
        formattedTime,
        isConsecutive,
        showHeader: !prevMessage || isNewDay,
      };
      
      console.log('Resulting message:', JSON.stringify(result, null, 2));
      
      return result;
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

// Test the function directly
const testMessages = [
  { 
    id: '1',
    sender: 'test',
    content: 'End of day',
    timestamp: '2025-07-13T23:59:59Z',
    isFromMe: false
  },
  { 
    id: '2',
    sender: 'test',
    content: 'Start of new day',
    timestamp: '2025-07-14T00:00:01Z',
    isFromMe: false
  }
];

console.log('=== Starting test ===');
const result = formatChatMessages(testMessages);
console.log('\n=== Final Result ===');
console.log(JSON.stringify(result, null, 2));
console.log('\nTest assertions:');
console.log('1. Result length:', result.length === 2 ? 'PASS' : 'FAIL');
console.log('2. First message showHeader:', result[0]?.showHeader === true ? 'PASS' : 'FAIL');
console.log('3. Second message showHeader:', result[1]?.showHeader === true ? 'PASS' : 'FAIL');
