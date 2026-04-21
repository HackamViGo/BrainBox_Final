'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function useScrollHint(ref: React.RefObject<HTMLElement | null>, deps: unknown[]) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

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
          className="pointer-events-none absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <div className="flex h-8 w-5 justify-center rounded-full border-2 border-white/40 bg-black/50 p-1 backdrop-blur-md">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-2 w-1 rounded-full bg-white/80"
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase drop-shadow-md">
            Scroll
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
