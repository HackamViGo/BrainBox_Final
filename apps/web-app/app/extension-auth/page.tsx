'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'motion/react'
import { CheckCircle, Loader2 } from 'lucide-react'

/**
 * Extension Auth Bridge
 * This page is used by the Chrome Extension to securely retrieve the Supabase JWT.
 * It uses postMessage to communicate with the extension content script.
 */
export default function ExtensionAuth() {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthorized'>('checking')
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      // 1. SECURITY: Always use getUser() FIRST — validates with Supabase Auth server
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        setStatus('unauthorized')
        return
      }

      setStatus('authenticated')

      // Listen for handshake from extension
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'BRAINBOX_EXT_REQUEST_TOKEN') {
          // 2. REFRESH/GET SESSION: Only after user is verified
          const { data: { session }, error: sessionError } = await supabase.auth.refreshSession()
          
          if (sessionError || !session) {
            window.parent.postMessage({ type: 'BRAINBOX_EXT_AUTH_ERROR', error: 'Session refresh failed' }, '*')
            return
          }

          window.parent.postMessage({
            type: 'BRAINBOX_EXT_RECEIVE_TOKEN',
            token: session.access_token,
            user: {
              id: user.id,
              email: user.email
            }
          }, '*')
        }
      }

      window.addEventListener('message', handleMessage)
      
      // Proactively send if we catch a known listener (standard for BrainBox bridge)
      window.parent.postMessage({
        type: 'BRAINBOX_EXT_AUTH_READY',
        authenticated: true
      }, '*')

      return () => window.removeEventListener('message', handleMessage)
    }

    checkAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center bg-black p-6 font-sans">
      <div className="max-w-xs w-full glass-panel p-8 rounded-3xl flex flex-col items-center text-center">
        {status === 'checking' && (
          <>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h1 className="text-xl font-semibold text-white/90">Authentication Bridge</h1>
            <p className="text-sm text-white/50 mt-2">Checking session status...</p>
          </>
        )}

        {status === 'authenticated' && (
          <>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
            <h1 className="text-xl font-semibold text-white/90">Connected</h1>
            <p className="text-sm text-white/50 mt-2">BrainBox Extension successfully authenticated.</p>
            <div className="mt-8 text-[10px] uppercase tracking-widest text-white/20">
              You can close this window
            </div>
          </>
        )}

        {status === 'unauthorized' && (
          <>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-500 font-bold text-xl">
              !
            </div>
            <h1 className="text-xl font-semibold text-white/90">Sign In Required</h1>
            <p className="text-sm text-white/50 mt-2">Please login to BrainBox in the main dashboard first.</p>
          </>
        )}
      </div>
      
      {/* Decorative Neural Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/30 rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
