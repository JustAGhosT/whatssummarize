import { formatChatMessages, formatMessageDate } from '@/utils/chatUtils';

describe('formatChatMessages', () => {
  const baseMessage = {
    id: '1',
    sender: 'Test User',
    content: 'Test message',
    timestamp: '2025-07-13T10:00:00Z',
    isFromMe: false,
  };

  it('should format a single message correctly', () => {
    const messages = [baseMessage];
    const result = formatChatMessages(messages);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      ...baseMessage,
      formattedTime: expect.any(String),
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
    const messages = [
      { ...baseMessage, id: '1', timestamp: '2025-07-13T23:59:00Z' },
      { ...baseMessage, id: '2', timestamp: '2025-07-14T00:01:00Z' }, // Next day
    ];
    
    const result = formatChatMessages(messages);
    
    expect(result[0].showHeader).toBe(true);
    expect(result[1].showHeader).toBe(true); // Should show header for new day
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
  const realDate = Date.now;
  const mockDate = (dateString: string) => {
    global.Date.now = jest.fn(() => new Date(dateString).getTime());
  };

  afterEach(() => {
    global.Date.now = realDate;
  });

  it('should return "Today" for today\'s date', () => {
    mockDate('2025-07-13T12:00:00Z');
    expect(formatMessageDate('2025-07-13T10:00:00Z')).toBe('Today');
  });

  it('should return "Yesterday" for yesterday\'s date', () => {
    mockDate('2025-07-13T12:00:00Z');
    expect(formatMessageDate('2025-07-12T23:59:00Z')).toBe('Yesterday');
  });

  it('should return day name for dates within the current week', () => {
    mockDate('2025-07-13T12:00:00Z'); // Sunday
    expect(formatMessageDate('2025-07-11T10:00:00Z')).toBe('Friday');
  });

  it('should return full date for older dates', () => {
    mockDate('2025-07-13T12:00:00Z');
    expect(formatMessageDate('2025-06-01T10:00:00Z')).toBe('Jun 1, 2025');
  });

  it('should handle invalid date strings', () => {
    expect(formatMessageDate('invalid-date')).toBe('');
  });
});
