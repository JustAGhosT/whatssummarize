// Mock date-fns to return consistent values for testing
const mockFormat = jest.fn().mockReturnValue('12:00 PM');
const mockParseISO = jest.fn();

jest.mock('date-fns', () => ({
  __esModule: true,
  format: mockFormat,
  parseISO: mockParseISO,
  isToday: jest.fn().mockReturnValue(false),
  isYesterday: jest.fn().mockReturnValue(false),
  isThisWeek: jest.fn().mockReturnValue(false),
}));

import { formatChatMessages } from '@/utils/chatUtils';

describe('formatChatMessages', () => {
  const testMessage = {
    id: '1',
    sender: 'John',
    content: 'Hello',
    timestamp: '2025-01-01T12:00:00Z',
    isFromMe: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormat.mockReturnValue('12:00 PM');
  });

  it('should show header for messages on different days', () => {
    // Create two dates that are definitely on different days
    const firstDate = new Date(2025, 0, 1, 12, 0, 0); // Jan 1, 2025
    const secondDate = new Date(2025, 0, 2, 12, 0, 0); // Jan 2, 2025
    
    // Mock parseISO to return our test dates
    mockParseISO.mockImplementation((dateString) => {
      if (dateString === '2025-01-01T12:00:00Z') return firstDate;
      if (dateString === '2025-01-02T12:00:00Z') return secondDate;
      return new Date(dateString);
    });

    const messages = [
      { ...testMessage, id: '1', timestamp: '2025-01-01T12:00:00Z' },
      { ...testMessage, id: '2', timestamp: '2025-01-02T12:00:00Z' }
    ];

    const result = formatChatMessages(messages);
    
    // Verify the results
    expect(result).toHaveLength(2);
    expect(result[0].showHeader).toBe(true); // First message always shows header
    expect(result[1].showHeader).toBe(true); // Second message shows header because it's a new day
  });

  it('should not show header for messages on the same day', () => {
    // Create two dates on the same day
    const firstDate = new Date(2025, 0, 1, 12, 0, 0);
    const secondDate = new Date(2025, 0, 1, 14, 0, 0); // Same day, 2 hours later
    
    mockParseISO.mockImplementation((dateString) => {
      if (dateString === '2025-01-01T12:00:00Z') return firstDate;
      if (dateString === '2025-01-01T14:00:00Z') return secondDate;
      return new Date(dateString);
    });

    const messages = [
      { ...testMessage, id: '1', timestamp: '2025-01-01T12:00:00Z' },
      { ...testMessage, id: '2', timestamp: '2025-01-01T14:00:00Z' }
    ];

    const result = formatChatMessages(messages);
    
    expect(result).toHaveLength(2);
    expect(result[0].showHeader).toBe(true); // First message shows header
    expect(result[1].showHeader).toBe(false); // Second message on same day doesn't show header
  });

  it('should handle empty messages array', () => {
    const result = formatChatMessages([]);
    expect(result).toEqual([]);
  });
});
