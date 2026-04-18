'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Sparkles, Zap, Brain, MessageSquare, Download, Layers } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';

/**
 * Dashboard Screen
 * The primary entry point for the BrainBox Neural Interface.
 */
export function Dashboard() {
  const { setActiveScreen } = useAppStore();
  const { libraryFolders, promptFolders, items } = useLibraryStore(useShallow(s => ({
    libraryFolders: s.libraryFolders,
    promptFolders: s.promptFolders,
    items: s.items
  })));
  const [showHint, setShowHint] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 50) {
      setActiveScreen('extension');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0]?.clientY;
    if (touchEnd !== undefined && touchStart - touchEnd > 50) {
      setActiveScreen('extension');
    }
  };

  return (
    <div 
      className="h-full flex items-center px-6 sm:px-12 md:px-16 lg:pl-56 lg:pr-32 z-10 relative overflow-hidden transition-all duration-700 no-scrollbar"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-2xl py-10 lg:py-0 relative">
        {/* Glowing aura background */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mb-8 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 font-mono">Neural Interface Online</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-8"
        >
          Вторият ти мозък,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">подреден до съвършенство</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="space-y-8 text-white/60 font-medium max-w-xl"
        >
          <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed">
            Тишина вместо хаос. Контрол вместо разсейване. Една система, създадена специално за твоя интелектуален поток
          </p>
          
          {/* Redundant navigation icons removed for a cleaner, focused BrainBox experience */}

        </motion.div>
      </div>

      {/* BrainBox Extension Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer z-20 group"
        onClick={() => setActiveScreen('extension')}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 group-hover:text-white/60 transition-all duration-500 transform group-hover:translate-y-[-2px]">
          И да — това е само началото
        </span>
        <motion.div
          animate={showHint ? { y: [0, 8, 0] } : { y: 0 }}
          transition={showHint ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
        >
          <ChevronDown className={`w-5 h-5 transition-all duration-500 ${showHint ? 'text-white/40' : 'text-white/10'} group-hover:text-white group-hover:scale-110`} />
        </motion.div>
      </motion.div>
    </div>
  );
}
