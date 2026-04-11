import { motion } from 'motion/react';
import { Puzzle, Download, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

interface ExtensionProps {
  setActiveScreen: (screen: string) => void;
}

export function Extension({ setActiveScreen }: ExtensionProps) {
  const [touchStart, setTouchStart] = useState(0);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < -50) {
      setActiveScreen('dashboard');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    if (touchEnd - touchStart > 50) {
      setActiveScreen('dashboard');
    }
  };

  return (
    <div 
      className="h-full flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto relative"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Back to Dashboard Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
        onClick={() => setActiveScreen('dashboard')}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 transition-colors hover:text-white/80" />
        </motion.div>
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-medium hover:text-white/70 transition-colors">
          Back to Dashboard
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full mt-12 sm:mt-16 pb-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shrink-0">
            <Puzzle className="w-6 h-6 text-white" />
          </div>
          <div className="transition-transform duration-300 group-hover:translate-x-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">BrainBox Extension</h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0" />
              <p className="text-white/50 text-sm sm:text-base truncate">Information and download links for the Chrome extension.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[400px]">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Puzzle className="w-6 h-6 sm:w-8 sm:h-8 text-white/20" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">BrainBox Extension</h2>
          <p className="text-white/50 text-sm sm:text-base max-w-md mb-8">
            Enhance your browsing experience with the BrainBox Chrome extension. Access your second brain from anywhere on the web.
          </p>
          
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-colors text-sm sm:text-base">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Download from Chrome Web Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}
