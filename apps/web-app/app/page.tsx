'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';

// Store
import { useAppStore } from '@/store/useAppStore';

// Components (Placeholder components for now where indicated)
import { Login } from '@/components/Login'; // Assume this is ready
const Sidebar = dynamic(() => import('@/components/Sidebar').then(m => m.Sidebar), { ssr: false });
const AmbientLight = dynamic(() => import('@brainbox/ui').then(m => m.AmbientLight), { ssr: false });
const NeuralField = dynamic(() => import('@brainbox/ui').then(m => m.NeuralField), { ssr: false });

// Screens (Browser-only)
const MindGraph = dynamic(() => import('@/screens/MindGraph').then(m => m.MindGraph), { ssr: false });
const Workspace = dynamic(() => import('@/screens/Workspace').then(m => m.Workspace), { ssr: false });

// Standard Screens (Assume converted to client components if needed)
import { Dashboard } from '@/screens/Dashboard';
import { Library } from '@/screens/Library';
import { Prompts } from '@/screens/Prompts';
import { AINexus } from '@/screens/AINexus';
import { Archive } from '@/screens/Archive';
import { Settings } from '@/screens/Settings';
import { Identity } from '@/screens/Identity';
import { Extension } from '@/screens/Extension';

import { useThemeCycle } from '@/hooks/useThemeCycle';
import { useScrollTransition } from '@/hooks/useScrollTransition';

export default function Page() {
  useThemeCycle();
  const { handleWheel, handleTouchStart, handleTouchEnd } = useScrollTransition();

  const {
    activeScreen,
    theme,
    isLoggedIn,
    setIsLoggedIn,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    activeModelId,
    pendingModelId,
    activeFolder,
    setActiveFolder,
    setActiveScreen,
    setTheme
  } = useAppStore();

  const getNeuralMode = (screen: string) => {
    if (screen === 'dashboard') return 'brain';
    if (screen === 'extension') return 'extension';
    return 'wander';
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className="relative h-dvh w-full bg-[#050505] text-white font-sans overflow-hidden flex bg-grain"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {!isLoggedIn && (
          <motion.div
            key="login-overlay"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.2,
              filter: 'blur(20px)',
              transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <Login onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative flex flex-1 h-full w-full transition-all duration-1000 ${!isLoggedIn ? 'blur-2xl scale-95 pointer-events-none' : 'blur-0 scale-100'}`}>
        <AmbientLight theme={theme} monochrome={activeScreen === 'archive'} />
        <NeuralField 
          theme={theme} 
          mode={getNeuralMode(activeScreen)} 
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
        
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onDragStart={onDragStart}
        />
        
        <main className="flex-1 lg:ml-20 relative h-full overflow-hidden pt-16 lg:pt-0">
          {activeScreen === 'dashboard' && <Dashboard />}
          {activeScreen === 'library' && <Library />}
          {activeScreen === 'prompts' && <Prompts />}
          {activeScreen === 'studio' && <AINexus />}
          {activeScreen === 'workspace' && <Workspace />}
          {activeScreen === 'analytics' && <MindGraph />}
          {activeScreen === 'archive' && <Archive />}
          {activeScreen === 'settings' && <Settings />}
          {activeScreen === 'profile' && <Identity />}
          {activeScreen === 'extension' && <Extension setActiveScreen={setActiveScreen} />}
          
          {!['dashboard', 'library', 'prompts', 'studio', 'workspace', 'analytics', 'archive', 'settings', 'profile', 'extension'].includes(activeScreen) && (
            <div className="h-full flex items-center justify-center z-10 relative">
              <h2 className="text-2xl text-white/50">Screen under construction</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
