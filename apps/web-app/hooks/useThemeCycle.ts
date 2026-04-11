'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { ThemeName } from '@brainbox/types'

const THEME_KEYS: ThemeName[] = ['chatgpt', 'gemini', 'claude', 'grok', 'perplexity', 'lmarena', 'deepseek', 'qwen']

export function useThemeCycle() {
  const { activeScreen, theme, setTheme } = useAppStore()

  useEffect(() => {
    // Disable auto-switch for specific screens
    if (['library', 'prompts', 'studio'].includes(activeScreen)) return

    const interval = setInterval(() => {
      const otherThemes = THEME_KEYS.filter(t => t !== theme)
      const nextTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)]
      if (nextTheme) setTheme(nextTheme)
    }, 15000)

    return () => clearInterval(interval)
  }, [activeScreen, theme, setTheme])
}
