import { formatChatMessages, formatMessageDate } from '../../frontend/src/utils/chatUtils';

// Mock date-fns functions individually
jest.mock('date-fns/format', () => ({
  __esModule: true,
  format: jest.fn((date, formatStr) => {
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
    return dateStr;
  })
}));

jest.mock('date-fns/isToday', () => ({
  __esModule: true,
  isToday: jest.fn((date) => new Date(date).toISOString().split('T')[0] === '2025-07-13')
}));

jest.mock('date-fns/isYesterday', () => ({
  __esModule: true,
  isYesterday: jest.fn((date) => new Date(date).toISOString().split('T')[0] === '2025-07-12')
}));

jest.mock('date-fns/isThisWeek', () => ({
  __esModule: true,
  isThisWeek: jest.fn((date) => {
    const testDate = new Date(date);
    const today = new Date('2025-07-13T12:00:00Z');
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return testDate > weekAgo && testDate < today;
  })
}));

// Mock parseISO since it's used in the implementation
jest.mock('date-fns/parseISO', () => ({
  __esModule: true,
  parseISO: jest.fn((dateString) => new Date(dateString))
}));

describe('formatChatMessages', () => {
  const baseMessage = {
    id: '1',
    sender: 'Test User',
    content: 'Test message',
    timestamp: '2025-07-13T10:00:00Z',
    isFromMe: false,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should format a single message correctly', () => {
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
    // Get the format mock
    const formatModule = require('date-fns/format');
    const formatSpy = jest.spyOn(formatModule, 'format');
    
    // Mock format to return different dates for the two messages
    formatSpy.mockImplementation((...args: any[]) => {
      const [date, formatStr] = args;
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

  // Import the mocked modules
  const formatModule = require('date-fns/format');
  const isTodayModule = require('date-fns/isToday');
  const isYesterdayModule = require('date-fns/isYesterday');
  const isThisWeekModule = require('date-fns/isThisWeek');
  const parseISOModule = require('date-fns/parseISO');

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup spies on the mocked modules
    formatSpy = jest.spyOn(formatModule, 'format');
    isTodaySpy = jest.spyOn(isTodayModule, 'isToday');
    isYesterdaySpy = jest.spyOn(isYesterdayModule, 'isYesterday');
    isThisWeekSpy = jest.spyOn(isThisWeekModule, 'isThisWeek');
    
    // Default mock implementations
    formatSpy.mockImplementation((date, formatStr) => {
      if (formatStr === 'EEEE') return 'Wednesday';
      if (formatStr === 'MMM d, yyyy') return 'Jul 1, 2025';
      return '';
    });
  });

  it('should return "Today" for today\'s date', () => {
    const today = new Date('2025-07-13T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(true);
    
    const result = formatMessageDate(today.toISOString());
    expect(result).toBe('Today');
    expect(parseISOModule.parseISO).toHaveBeenCalledWith(today.toISOString());
    expect(isTodaySpy).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should return "Yesterday" for yesterday\'s date', () => {
    const yesterday = new Date('2025-07-12T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(false);
    isYesterdaySpy.mockReturnValueOnce(true);
    
    const result = formatMessageDate(yesterday.toISOString());
    expect(result).toBe('Yesterday');
    expect(parseISOModule.parseISO).toHaveBeenCalledWith(yesterday.toISOString());
    expect(isYesterdaySpy).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should return day name for dates within the current week', () => {
    const wednesday = new Date('2025-07-09T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(false);
    isYesterdaySpy.mockReturnValueOnce(false);
    isThisWeekSpy.mockReturnValueOnce(true);
    
    const result = formatMessageDate(wednesday.toISOString());
    expect(result).toBe('Wednesday');
    expect(parseISOModule.parseISO).toHaveBeenCalledWith(wednesday.toISOString());
    expect(isThisWeekSpy).toHaveBeenCalledWith(expect.any(Date), { weekStartsOn: 1 });
  });

  it('should return full date for older dates', () => {
    const oldDate = new Date('2025-07-01T12:00:00Z');
    isTodaySpy.mockReturnValueOnce(false);
    isYesterdaySpy.mockReturnValueOnce(false);
    isThisWeekSpy.mockReturnValueOnce(false);
    
    const result = formatMessageDate(oldDate.toISOString());
    expect(result).toBe('Jul 1, 2025');
    expect(parseISOModule.parseISO).toHaveBeenCalledWith(oldDate.toISOString());
  });

  it('should handle invalid date strings', () => {
    const result = formatMessageDate('invalid-date');
    expect(result).toBe('');
  });
});
