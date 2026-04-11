import { describe, it, expect } from 'vitest';
import { cn } from '../src/cn';

describe('cn utility', () => {
  it('should merge classes', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('should resolve tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('should ignore falsey values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c');
  });
});
