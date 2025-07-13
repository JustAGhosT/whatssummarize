import * as dateFns from 'date-fns';
import { formatChatMessages, formatMessageDate } from '../../frontend/src/utils/chatUtils';

// Mock date-fns functions
jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  return {
    ...actual,
    format: jest.fn((date, formatStr) => {
      // Mock format function implementation
      const dateObj = new Date(date);
      const dateStr = dateObj.toISOString().split('T')[0];
      
      if (formatStr === 'h:mm a') return '10:00 AM';
      if (formatStr === 'yyyy-MM-dd') return dateStr;
      if (formatStr === 'EEEE') {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dateObj.getDay()];
      }
      if (formatStr === 'MMM d, yyyy') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
      }
      return actual.format(date, formatStr);
    }),
    isToday: jest.fn((date) => {
      return new Date(date).toISOString().split('T')[0] === '2025-07-13';
    }),
    isYesterday: jest.fn((date) => {
      return new Date(date).toISOString().split('T')[0] === '2025-07-12';
    }),
    isThisWeek: jest.fn((date) => {
      const testDate = new Date(date);
      const today = new Date('2025-07-13T12:00:00Z');
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return testDate > weekAgo && testDate < today;
    }),
  };
});

describe('formatChatMessages', () => {
  const baseMessage = {
    id: '1',
    sender: 'Test User',
    content: 'Test message',
    timestamp: '2025-07-13T10:00:00Z',
    isFromMe: false,
  };

  it('should format a single message correctly', () => {
    // Mock format to return a specific time string
    (dateFns.format as jest.Mock).mockImplementation((date, formatStr) => {
      if (formatStr === 'h:mm a') return '10:00 AM';
      if (formatStr === 'yyyy-MM-dd') return '2025-07-13';
      return '';
    });

    const result = formatChatMessages([baseMessage]);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      ...baseMessage,
      formattedTime: '10:00 AM',
      isConsecutive: false,
      showHeader: true,
    });
  });

  it('should mark consecutive messages from the same sender', () => {
    const messages = [
      { ...baseMessage, id: '1', timestamp: '2025-07-13T10:00:00Z' },
      { ...baseMessage, id: '2', timestamp: '2025-07-13T10:01:00Z' },
      { ...baseMessage, id: '3', timestamp: '2025-07-13T10:02:00Z' },
    ];
    
    const result = formatChatMessages(messages);
    
    expect(result[0].isConsecutive).toBe(false);
    expect(result[1].isConsecutive).toBe(true);
    expect(result[2].isConsecutive).toBe(true);
  });

  it('should show header for new day messages', () => {
    // Mock format to return different dates for the two messages
    (dateFns.format as jest.Mock).mockImplementation((date, formatStr) => {
      const dateObj = new Date(date);
      if (formatStr === 'h:mm a') return '10:00 AM';
      if (formatStr === 'yyyy-MM-dd') {
        // Return different dates for the two messages
        if (dateObj.getUTCHours() === 23) return '2025-07-13';
        return '2025-07-14';
      }
      return '';
    });

    const messages = [
      {
        ...baseMessage,
        id: '1',
        timestamp: '2025-07-13T23:59:00Z',
      },
      {
        ...baseMessage,
        id: '2',
        timestamp: '2025-07-14T00:01:00Z', // Next day
      },
    ];

    const result = formatChatMessages(messages);
    expect(result[0].showHeader).toBe(true);  // First message should always show header
    expect(result[1].showHeader).toBe(true);  // Second message is on a new day
  });

  it('should handle empty input', () => {
    expect(formatChatMessages([])).toEqual([]);
    // @ts-expect-error Testing invalid input
    expect(formatChatMessages(null)).toEqual([]);
    // @ts-expect-error Testing invalid input
    expect(formatChatMessages(undefined)).toEqual([]);
  });
});

describe('formatMessageDate', () => {
  let formatSpy: jest.SpyInstance;
  let isTodaySpy: jest.SpyInstance;
  let isYesterdaySpy: jest.SpyInstance;
  let isThisWeekSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    formatSpy = jest.spyOn(dateFns, 'format');
    isTodaySpy = jest.spyOn(dateFns, 'isToday');
    isYesterdaySpy = jest.spyOn(dateFns, 'isYesterday');
    isThisWeekSpy = jest.spyOn(dateFns, 'isThisWeek');
  });

  it('should return "Today" for today\'s date', () => {
    const today = new Date('2025-07-13T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(true);
    
    const result = formatMessageDate(today.toISOString());
    expect(result).toBe('Today');
    expect(isTodaySpy).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should return "Yesterday" for yesterday\'s date', () => {
    const yesterday = new Date('2025-07-12T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(false);
    isYesterdaySpy.mockReturnValueOnce(true);
    
    const result = formatMessageDate(yesterday.toISOString());
    expect(result).toBe('Yesterday');
    expect(isYesterdaySpy).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should return day name for dates within the current week', () => {
    const wednesday = new Date('2025-07-09T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(false);
    isYesterdaySpy.mockReturnValueOnce(false);
    isThisWeekSpy.mockReturnValueOnce(true);
    formatSpy.mockReturnValueOnce('Wednesday');
    
    const result = formatMessageDate(wednesday.toISOString());
    expect(result).toBe('Wednesday');
    expect(isThisWeekSpy).toHaveBeenCalledWith(expect.any(Date), { weekStartsOn: 1 });
  });

  it('should return full date for older dates', () => {
    const oldDate = new Date('2025-07-01T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(false);
    isYesterdaySpy.mockReturnValueOnce(false);
    isThisWeekSpy.mockReturnValueOnce(false);
    formatSpy.mockReturnValueOnce('Jul 1, 2025');
    
    const result = formatMessageDate(oldDate.toISOString());
    expect(result).toBe('Jul 1, 2025');
  });

  it('should handle invalid date strings', () => {
    const result = formatMessageDate('invalid-date');
    expect(result).toBe('');
  });
});
