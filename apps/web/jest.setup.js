import '@testing-library/jest-dom';

// Mock date-fns
jest.mock('date-fns/format', () => jest.fn((date, formatStr) => {
  // Simple mock implementation for testing
  if (formatStr === 'h:mm a') return '10:00 AM';
  if (formatStr === 'MMM d, yyyy') return 'Jul 1, 2025';
  return date.toISOString();
}));

jest.mock('date-fns/parseISO', () => jest.fn((dateString) => new Date(dateString)));

// Mock date checking functions
const mockDate = new Date('2025-07-13T10:00:00.000Z');

jest.mock('date-fns/isToday', () => jest.fn((date) => {
  return date.toDateString() === mockDate.toDateString();
}));

jest.mock('date-fns/isYesterday', () => jest.fn((date) => {
  const yesterday = new Date(mockDate);
  yesterday.setDate(mockDate.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}));

jest.mock('date-fns/isThisWeek', () => jest.fn((date) => {
  const weekStart = new Date(mockDate);
  weekStart.setDate(mockDate.getDate() - mockDate.getDay() + 1); // Monday of current week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Sunday of current week
  return date >= weekStart && date <= weekEnd;
}));

// Mock any global browser APIs if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
