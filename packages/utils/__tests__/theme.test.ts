import { describe, it, expect } from 'vitest';
import { getThemeColor, getNextTheme } from '../src/theme';
import { THEMES, THEME_KEYS, type ThemeName } from '@brainbox/types';

describe('theme utils', () => {
  describe('getThemeColor', () => {
    it('should return the correct color for a theme', () => {
      THEME_KEYS.forEach((theme) => {
        expect(getThemeColor(theme)).toBe(THEMES[theme].color);
      });
    });
  });

  describe('getNextTheme', () => {
    it('should return a different theme than current', () => {
      const current: ThemeName = 'chatgpt';
      const next = getNextTheme(current);
      expect(next).not.toBe(current);
      expect(THEME_KEYS).toContain(next);
    });

    it('should exclude specified themes', () => {
      const current: ThemeName = 'chatgpt';
      const exclude: ThemeName[] = ['gemini', 'claude'];
      
      // Run multiple times to reduce chance of lucky pick
      for (let i = 0; i < 20; i++) {
        const next = getNextTheme(current, exclude);
        expect(next).not.toBe(current);
        expect(exclude).not.toContain(next);
      }
    });

    it('should return current if no other themes available', () => {
      const allExceptCurrent = THEME_KEYS.filter(t => t !== 'chatgpt');
      const next = getNextTheme('chatgpt', allExceptCurrent);
      expect(next).toBe('chatgpt');
    });
  });
});
