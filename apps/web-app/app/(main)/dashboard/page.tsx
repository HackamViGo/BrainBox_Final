'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false); // Stop chevron animation after 10s
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 50) {
      router.push('/extension');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches[0]) {
      const touchEnd = e.changedTouches[0].clientY;
      if (touchStart - touchEnd > 50) {
        router.push('/extension');
      }
    }
  };

  return (
    <div 
      className="h-full flex items-center px-6 sm:px-12 md:px-16 lg:pl-56 lg:pr-32 z-10 relative overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-2xl py-10 lg:py-0">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6 lg:mb-10"
        >
          Вторият ти мозък,<br />
          подреден до съвършенство.<br />
          <span className="text-white/60 font-medium text-lg sm:text-xl lg:text-2xl">Всички чатове. Всички AI-та.</span><br />
          <span className="text-white/40 font-light text-sm sm:text-base lg:text-lg">Една система, създадена по теб.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-4 sm:space-y-6 text-white/80 font-light max-w-xl"
        >
          <p className="italic text-sm sm:text-base lg:text-lg">
            Тишина вместо хаос. Контрол вместо разсейване.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button 
              onClick={() => router.push('/library')}
              className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all text-left group"
            >
              <div className="text-xs uppercase tracking-widest text-blue-400/60 mb-2 group-hover:text-blue-400 transition-colors">Библиотека</div>
              <div className="text-sm font-medium text-white/90">8 активни чата</div>
            </button>
            <button 
              onClick={() => router.push('/prompts')}
              className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all text-left group"
            >
              <div className="text-xs uppercase tracking-widest text-amber-400/60 mb-2 group-hover:text-amber-400 transition-colors">Промптове</div>
              <div className="text-sm font-medium text-white/90">12 запазени</div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* BrainBox Extension Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
        onClick={() => router.push('/extension')}
      >
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-medium hover:text-white/70 transition-colors">
          И да — това е само началото.
        </span>
        <motion.div
          animate={showAnimation ? { y: [0, 6, 0] } : { y: 0 }}
          transition={showAnimation ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
        >
          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${showAnimation ? 'text-white/50' : 'text-white/20'}`} />
        </motion.div>
      </motion.div>
    </div>
  );
}
