'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import { useExtensionStore } from '@/store/useExtensionStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const loadData = useLibraryStore((state) => state.loadData)

  useEffect(() => {
    // Manual rehydration after mount to prevent SSR mismatch
    useAppStore.persist.rehydrate()
    useLibraryStore.persist.rehydrate()
    useExtensionStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadData()
    }
  }, [isLoggedIn, loadData])

  return (
    <>
      {children}
    </>
  )
}
