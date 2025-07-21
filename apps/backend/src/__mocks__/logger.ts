// Mock logger for testing
const mockLogger = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  child: vi.fn(() => mockLogger),
  trace: vi.fn(),
  fatal: vi.fn(),
  silent: vi.fn(),
};

// Mock the createLogger function
export const createLogger = vi.fn((name?: string) => {
  if (name) {
    return {
      ...mockLogger,
      child: () => ({
        ...mockLogger,
        child: () => mockLogger,
      }),
    };
  }
  return mockLogger;
});

// Export the logger instance
export const logger = mockLogger;
