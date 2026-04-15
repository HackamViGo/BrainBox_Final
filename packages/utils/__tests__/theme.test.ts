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
      const current: ThemeName = 'brainbox';
      const next = getNextTheme(current);
      expect(next).not.toBe(current);
      expect(THEME_KEYS).toContain(next);
    });

    it('should exclude specified themes', () => {
      const current: ThemeName = 'brainbox';
      const exclude: ThemeName[] = ['nebula', 'forest'];
      
      // Run multiple times to reduce chance of lucky pick
      for (let i = 0; i < 20; i++) {
        const next = getNextTheme(current, exclude);
        expect(next).not.toBe(current);
        expect(exclude).not.toContain(next);
      }
    });

    it('should return current if no other themes available', () => {
      // If we exclude everything else... 
      // THEME_KEYS has 3 themes usually: 'brainbox', 'nebula', 'forest'
      // Wait, let's see how many themes there are
      const allExceptCurrent = THEME_KEYS.filter(t => t !== 'brainbox');
      const next = getNextTheme('brainbox', allExceptCurrent);
      expect(next).toBe('brainbox');
    });
  });
});
