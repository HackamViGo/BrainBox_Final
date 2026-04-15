import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isRateLimited } from '../../../lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should allow requests within limit', async () => {
    const key = `test-1-${Date.now()}`;
    // isRateLimited returns true if BLOCKED, false if ALLOWED
    const blocked1 = isRateLimited(key, 2, 60000);
    const blocked2 = isRateLimited(key, 2, 60000);

    expect(blocked1).toBe(false);
    expect(blocked2).toBe(false);
  });

  it('should block requests exceeding limit', async () => {
    const key = `test-2-${Date.now()}`;
    isRateLimited(key, 1, 60000);
    const blocked = isRateLimited(key, 1, 60000);

    expect(blocked).toBe(true);
  });

  it('should reset after window expires', async () => {
    const key = `test-3-${Date.now()}`;
    isRateLimited(key, 1, 60000);
    
    // Fast forward time by 61 seconds
    vi.advanceTimersByTime(61 * 1000);
    
    const blocked = isRateLimited(key, 1, 60000);
    expect(blocked).toBe(false);
  });
});
