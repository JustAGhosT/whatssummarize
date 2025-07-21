import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should run a simple test', () => {
    console.log('Running simple test...');
    expect(1 + 1).toBe(2);
  });

  it('should run an async test', async () => {
    console.log('Running async test...');
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});
