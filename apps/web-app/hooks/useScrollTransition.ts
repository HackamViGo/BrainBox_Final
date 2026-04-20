'use client'

import { useRef, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useScrollTransition() {
  const { activeScreen, setActiveScreen } = useAppStore()
  const touchStartRef = useRef<number | null>(null)

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Only on dashboard/extension
    if (!['dashboard', 'extension'].includes(activeScreen)) return

    if (e.deltaY > 50 && activeScreen === 'dashboard') {
      setActiveScreen('extension')
    } else if (e.deltaY < -50 && activeScreen === 'extension') {
      setActiveScreen('dashboard')
    }
  }, [activeScreen, setActiveScreen])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartRef.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !e.changedTouches[0]) return
    
    const deltaY = touchStartRef.current - e.changedTouches[0].clientY
    touchStartRef.current = null

    if (deltaY > 50 && activeScreen === 'dashboard') {
      setActiveScreen('extension')
    } else if (deltaY < -50 && activeScreen === 'extension') {
      setActiveScreen('dashboard')
    }
  }, [activeScreen, setActiveScreen])

  return { handleWheel, handleTouchStart, handleTouchEnd }
}
