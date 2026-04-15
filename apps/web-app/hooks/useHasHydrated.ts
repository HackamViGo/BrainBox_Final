'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to track if the client-side hydration is complete.
 * Used to avoid hydration mismatch errors when using persisted Zustand stores.
 */
export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}
