import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../src/logger';

describe('Logger', () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log info messages with JSON format', () => {
    logger.info('TestContext', 'Hello Info', { foo: 'bar' });
    
    expect(logSpy).toHaveBeenCalled();
    const output = JSON.parse(logSpy.mock.calls[0][0]);
    expect(output.level).toBe('INFO');
    expect(output.context).toBe('TestContext');
    expect(output.message).toBe('Hello Info');
    expect(output.data).toEqual({ foo: 'bar' });
    expect(output.timestamp).toBeDefined();
  });

  it('should log warn messages', () => {
    logger.warn({ id: 'Context', phase: 'init' }, 'Warning msg');
    
    expect(logSpy).toHaveBeenCalled();
    const output = JSON.parse(logSpy.mock.calls[0][0]);
    expect(output.level).toBe('WARN');
    expect(output.phase).toBe('init');
  });

  it('should log error messages using console.error', () => {
    logger.error('Errors', 'Something went wrong');
    
    expect(errorSpy).toHaveBeenCalled();
    const output = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(output.level).toBe('ERROR');
    expect(output.message).toBe('Something went wrong');
  });

  it('should handle Error objects in logger.error', () => {
    const error = new Error('Original Error');
    logger.error('System', error, { extra: 'info' });
    
    expect(errorSpy).toHaveBeenCalled();
    const output = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(output.message).toBe('Original Error');
    expect(output.data.stack).toBeDefined();
    expect(output.data.extra).toBe('info');
  });

  it('should log debug messages only in non-production', () => {
    // Save original env
    const originalEnv = process.env.NODE_ENV;
    
    // Test non-production
    process.env.NODE_ENV = 'development';
    logger.debug('Debug', 'Debug message');
    expect(logSpy).toHaveBeenCalled();
    
    vi.clearAllMocks();
    
    // Test production
    process.env.NODE_ENV = 'production';
    logger.debug('Debug', 'Debug message');
    expect(logSpy).not.toHaveBeenCalled();
    
    // Restore env
    process.env.NODE_ENV = originalEnv;
  });
});
