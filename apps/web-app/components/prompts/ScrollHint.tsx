'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function useScrollHint(ref: React.RefObject<HTMLElement | null>, deps: any[]) {
  const [showHint, setShowHint] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkScroll = () => {
      if (el.scrollHeight > el.clientHeight && !hasShownRef.current) {
        setShowHint(true);
        hasShownRef.current = true;
        setTimeout(() => setShowHint(false), 3000);
      } else if (el.scrollHeight <= el.clientHeight) {
        hasShownRef.current = false;
      }
    };

    checkScroll();
    
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    
    return () => observer.disconnect();
  }, deps);

  return showHint;
}

export function ScrollHint({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none"
        >
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center p-1 bg-black/50 backdrop-blur-md">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-white/80 rounded-full"
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-mono drop-shadow-md">Scroll</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
