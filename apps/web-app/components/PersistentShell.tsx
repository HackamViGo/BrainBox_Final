'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../store/useAppStore';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const NeuralField = dynamic(() => import('@brainbox/ui').then(mod => mod.NeuralField), { ssr: false });
const AmbientLight = dynamic(() => import('@brainbox/ui').then(mod => mod.AmbientLight), { ssr: false });

export function PersistentShell({ children }: { children: React.ReactNode }) {
  const { activeScreen, activeTheme, setActiveScreen } = useAppStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname) {
      const screen = pathname.replace('/', '') || 'dashboard';
      setActiveScreen(screen as any);
    }
  }, [pathname, setActiveScreen]);

  return (
    <div className="relative h-full w-full bg-[#050505] text-white font-sans overflow-hidden flex bg-grain blur-0 scale-100">
      <AmbientLight theme={activeTheme} monochrome={activeScreen === 'archive'} />
      <NeuralField 
        theme={activeTheme} 
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
      
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      
      <main className="flex-1 lg:ml-20 relative h-full overflow-hidden pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
