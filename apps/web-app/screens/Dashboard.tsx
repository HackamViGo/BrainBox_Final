'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Brain } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

/**
 * Dashboard Screen
 * The primary entry point for the BrainBox Neural Interface.
 */
export function Dashboard() {
  const { setActiveScreen } = useAppStore();
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
      className="no-scrollbar relative z-10 flex h-full items-center overflow-hidden px-6 transition-all duration-700 sm:px-12 md:px-16 lg:pr-32 lg:pl-56"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full max-w-2xl py-10 lg:py-0">
        {/* Glowing aura background */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Brain className="h-5 w-5 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">
            Neural Interface Online
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-7xl"
        >
          Вторият ти мозък,
          <br />
          <span className="bg-linear-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            подреден до съвършенство
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="max-w-xl space-y-8 font-medium text-white/60"
        >
          <p className="text-base leading-relaxed font-light sm:text-lg lg:text-xl">
            Тишина вместо хаос. Контрол вместо разсейване. Една система, създадена специално за твоя
            интелектуален поток
          </p>

          {/* Redundant navigation icons removed for a cleaner, focused BrainBox experience */}
        </motion.div>
      </div>

      {/* BrainBox Extension Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="group absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-4"
        onClick={() => setActiveScreen('extension')}
      >
        <span className="transform text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase transition-all duration-500 group-hover:translate-y-[-2px] group-hover:text-white/60">
          И да — това е само началото
        </span>
        <motion.div
          animate={showHint ? { y: [0, 8, 0] } : { y: 0 }}
          transition={
            showHint ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.5 }
          }
        >
          <ChevronDown
            className={`h-5 w-5 transition-all duration-500 ${showHint ? 'text-white/40' : 'text-white/10'} group-hover:scale-110 group-hover:text-white`}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
