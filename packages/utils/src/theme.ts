import { THEMES, THEME_KEYS, type ThemeName } from '@brainbox/types';

export function getThemeColor(theme: ThemeName): string {
  return THEMES[theme].color;
}

export function getNextTheme(current: ThemeName, exclude?: ThemeName[]): ThemeName {
  const available = THEME_KEYS.filter(t => t !== current && (!exclude || !exclude.includes(t)));
  if (available.length === 0) return current;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] ?? current;
}
