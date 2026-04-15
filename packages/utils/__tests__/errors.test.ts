import { describe, it, expect } from 'vitest';
import { AppError, ErrorCode } from '../src/errors';

describe('AppError', () => {
  it('should create an error with code and default message', () => {
    const error = new AppError(ErrorCode.AUTH_UNAUTHORIZED);
    expect(error.code).toBe(ErrorCode.AUTH_UNAUTHORIZED);
    expect(error.message).toBe(`Error [${ErrorCode.AUTH_UNAUTHORIZED}]`);
    expect(error.name).toBe('AppError');
  });

  it('should create an error with custom message', () => {
    const message = 'Custom Error Message';
    const error = new AppError(ErrorCode.SYSTEM_INTERNAL_ERROR, {}, message);
    expect(error.message).toBe(message);
    expect(error.code).toBe(ErrorCode.SYSTEM_INTERNAL_ERROR);
  });

  it('should store metadata', () => {
    const metadata = { userId: '123' };
    const error = new AppError(ErrorCode.LIBRARY_ITEM_NOT_FOUND, metadata);
    expect(error.metadata).toEqual(metadata);
  });
});
