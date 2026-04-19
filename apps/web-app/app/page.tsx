'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';

// Store
import { useAppStore } from '@/store/useAppStore';

// Components
import { PersistentShell } from '@/components/PersistentShell';

// Screens
const MindGraph = dynamic(() => import('@/screens/MindGraph').then(m => m.MindGraph), { ssr: false });
const Workspace = dynamic(() => import('@/screens/Workspace').then(m => m.Workspace), { ssr: false });
const Library = dynamic(() => import('@/screens/Library').then(m => m.Library), { ssr: false });
const Prompts = dynamic(() => import('@/screens/Prompts').then(m => m.Prompts), { ssr: false });

// Standard Screens
import { Dashboard } from '@/screens/Dashboard';
import { AINexus } from '@/screens/AINexus';
import { Archive } from '@/screens/Archive';
import { Settings } from '@/screens/Settings';
import { Identity } from '@/screens/Identity';
import { Extension } from '@/screens/Extension';
import { Login } from '@/screens/Login';

import { useThemeCycle } from '@/hooks/useThemeCycle';
import { useScrollTransition } from '@/hooks/useScrollTransition';

export default function Page() {
  useThemeCycle();
  const { handleWheel, handleTouchStart, handleTouchEnd } = useScrollTransition();

  const {
    activeScreen,
    isLoggedIn,
    _hasHydrated,
  } = useAppStore();

  // 1. HYDRATION BRIDGE: Wait for Zustand persist to load
  if (!_hasHydrated) {
    return (
      <div className="h-dvh w-full bg-background flex items-center justify-center relative overflow-hidden">
        {/* Placeholder AmbientLight/NeuralField can go here if needed, but PersistentShell handles it too */}
        <div className="text-white/20 animate-pulse font-mono uppercase tracking-[0.3em]">Neural Bridge Initializing...</div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-dvh w-full bg-background text-white font-sans overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
        {!isLoggedIn && (
          <div
            data-testid="login-overlay"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <Login />
          </div>
        )}

      <div className={`h-full transition-all duration-1000 ${!isLoggedIn ? 'blur-2xl scale-95 pointer-events-none' : 'blur-0 scale-100'}`}>
        <PersistentShell>
          {activeScreen === 'dashboard' && <Dashboard />}
          {activeScreen === 'library' && <Library />}
          {activeScreen === 'prompts' && <Prompts />}
          {activeScreen === 'studio' && <AINexus />}
          {activeScreen === 'workspace' && <Workspace />}
          {activeScreen === 'analytics' && <MindGraph />}
          {activeScreen === 'archive' && <Archive />}
          {activeScreen === 'settings' && <Settings />}
          {activeScreen === 'profile' && <Identity />}
          {activeScreen === 'extension' && <Extension />}
          
          {!['dashboard', 'library', 'prompts', 'studio', 'workspace', 'analytics', 'archive', 'settings', 'profile', 'extension'].includes(activeScreen) && (
            <div className="h-full flex items-center justify-center z-10 relative">
              <h2 className="text-2xl text-white/50 uppercase font-bold tracking-widest animate-pulse">Neural Path Under Construction</h2>
            </div>
          )}
        </PersistentShell>
      </div>
    </div>
  );
}
