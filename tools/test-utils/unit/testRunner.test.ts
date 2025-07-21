import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runCommand, TEST_CONFIG } from '../../tests/test-runner';

// Mock the child_process module
const mockExec = vi.fn();

// Use dynamic import for the mock setup
const setupMocks = async () => {
  const childProcess = await import('node:child_process');
  vi.spyOn(childProcess, 'exec').mockImplementation(mockExec);
};

// Setup mocks before tests
beforeAll(async () => {
  await setupMocks();
});

describe('Test Runner', () => {
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Store original console methods
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    
    // Mock console methods
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('runCommand', () => {
    it('should handle command errors', async () => {
      const error = new Error('Command failed');
      const mockStdout = 'Partial output';
      const mockStderr = 'Error occurred';
      
      // Mock exec to reject with an error
      mockExec.mockRejectedValueOnce({
        stdout: mockStdout,
        stderr: mockStderr,
        message: error.message
      });
      
      const result = await runCommand('fail-command');
      
      expect(mockExec).toHaveBeenCalled();
      expect(result.stdout).toBe(mockStdout);
      expect(result.stderr).toContain(error.message);
    });
    
    it('should pass options to exec', async () => {
      const mockStdout = 'Command output';
      const mockStderr = '';
      const options = { cwd: '/test/dir' };
      
      // Mock exec to resolve successfully
      mockExec.mockResolvedValueOnce({
        stdout: mockStdout,
        stderr: mockStderr
      });
      
      await runCommand('echo test', options);
      
      expect(mockExec).toHaveBeenCalledWith('echo test', options);
    });

    it('should handle command errors', async () => {
      const mockError = new Error('Command failed');
      const mockStderr = 'Error output';
      
      // Mock exec to call the callback with an error
      mockExec.mockImplementation((command, options, callback) => {
        if (typeof callback === 'function') {
          callback(mockError, { stdout: '', stderr: mockStderr });
        }
        return { 
          stdout: { on: vi.fn() }, 
          stderr: { on: vi.fn() },
          on: vi.fn()
        };
      });
      
      // Test that the error is thrown
      await expect(runCommand('invalid-command')).rejects.toThrow('Command failed');
    });
  });

  describe('TEST_CONFIG', () => {
    it('should have the correct test command and patterns', () => {
      expect(TEST_CONFIG).toEqual({
        testCommand: 'vitest run',
        testMatch: ['**/*.test.ts', '**/*.spec.ts'],
        testIgnore: ['**/node_modules/**', '**/dist/**', '**/coverage/**']
      });
    });
  });
});
