'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../store/useAppStore';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const NeuralField = dynamic(() => import('@brainbox/ui').then(mod => ({ default: mod.NeuralField })), { ssr: false });
const AmbientLight = dynamic(() => import('@brainbox/ui').then(mod => ({ default: mod.AmbientLight })), { ssr: false });
import { ApiKeyModal } from './ApiKeyModal';
import { SmartSwitchModal } from './SmartSwitchModal';
import { NewFolderModal } from './NewFolderModal';
import { NewChatModal } from './NewChatModal';
import { useHasHydrated } from '../hooks/useHasHydrated';
import { Loader2 } from 'lucide-react';

export function PersistentShell({ children }: { children: React.ReactNode }) {
  const { 
    activeScreen, theme, hoverTheme, setActiveScreen,
    isMobileSidebarOpen, setIsMobileSidebarOpen,
    isPinned, isSidebarExpanded
  } = useAppStore();
  const pathname = usePathname();
  const hasHydrated = useHasHydrated();

  React.useEffect(() => {
    if (pathname) {
      const screen = pathname.replace('/', '') || 'dashboard';
      setActiveScreen(screen as any);
    }
  }, [pathname, setActiveScreen]);

  if (!hasHydrated) {
    return (
      <div className="h-dvh w-full bg-[#050505] flex items-center justify-center relative overflow-hidden">
        <AmbientLight theme="chatgpt" />
        <NeuralField theme="chatgpt" mode="wander" />
        <Loader2 className="w-8 h-8 text-white/20 animate-spin relative z-10" />
      </div>
    );
  }

  const effectiveTheme = hoverTheme ?? theme;

  return (
    <div className="relative h-full w-full bg-[#050505] text-white font-sans overflow-hidden flex bg-grain blur-0 scale-100">
      <AmbientLight theme={effectiveTheme} monochrome={activeScreen === 'archive'} />
      <NeuralField 
        theme={effectiveTheme} 
        mode={activeScreen === 'dashboard' ? 'brain' : activeScreen === 'extension' ? 'extension' : 'wander'} 
        speedMultiplier={activeScreen === 'archive' ? 0.25 : 1}
        monochrome={activeScreen === 'archive'}
      />
      
      {/* Mobile Header */}
      <header className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-transparent z-[80] flex items-center justify-between px-6 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </header>
      
      <Sidebar />
      
      <motion.main 
        initial={false}
        animate={{ 
          marginLeft: (isPinned || isSidebarExpanded) ? 256 : 80
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 relative h-full overflow-hidden pt-16 lg:pt-0 hidden lg:block"
      >
        {children}
      </motion.main>

      <main className="flex-1 relative h-full overflow-hidden pt-16 lg:hidden">
        {children}
      </main>

      {/* Global Modals */}
      <SmartSwitchModal />
      <ApiKeyModal />
      <NewFolderModal />
      <NewChatModal />
    </div>
  );
}
