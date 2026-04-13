'use client';

import { motion } from 'motion/react';
import { THEMES } from '@brainbox/types';
import type { ThemeName } from '@brainbox/types';

/**
 * AmbientLight provides a subtle, animated radial gradient background
 * that changes position and color based on the selected theme.
 * Enhanced with dual-gradient depth for V2.
 */
export function AmbientLight({ theme, monochrome = false }: { theme: ThemeName, monochrome?: boolean }) {
  const currentTheme = THEMES[theme];

  const getPosition = (pos: string) => {
    switch (pos) {
      case 'top-left': return { top: '-10%', left: '-10%' };
      case 'top-right': return { top: '-10%', right: '-10%' };
      case 'bottom-left': return { bottom: '-10%', left: '-10%' };
      case 'bottom-right': return { bottom: '-10%', right: '-10%' };
      case 'top-center': return { top: '-15%', left: '50%', x: '-50%' };
      case 'bottom-center': return { bottom: '-15%', left: '50%', x: '-50%' };
      case 'center-right': return { top: '50%', right: '-15%', y: '-50%' };
      case 'center': return { top: '50%', left: '50%', x: '-50%', y: '-50%' };
      default: return { top: '-10%', left: '-10%' };
    }
  };

  const baseOpacity = monochrome ? 0.15 : 0.25;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary Light */}
      <motion.div
        className="absolute w-[100vw] h-[100vw] rounded-full mix-blend-screen blur-[140px]"
        animate={{
          background: `radial-gradient(circle, ${monochrome ? '#1a1a2e' : currentTheme.color} 0%, transparent 65%)`,
          opacity: baseOpacity,
          ...getPosition(currentTheme.lightPosition)
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      
      {/* Secondary Depth Light (Slow Drift) */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] rounded-full mix-blend-soft-light blur-[100px]"
        animate={{
          background: `radial-gradient(circle, ${monochrome ? '#0f0f15' : currentTheme.color} 0%, transparent 70%)`,
          opacity: baseOpacity * 0.5,
          top: ['20%', '40%', '20%'],
          left: ['20%', '60%', '20%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
