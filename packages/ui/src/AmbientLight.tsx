'use client';

import { motion } from 'motion/react';
import { THEMES } from '@brainbox/types';
import type { ThemeName } from '@brainbox/types';

/**
 * AmbientLight provides a subtle, animated radial gradient background
 * that changes position and color based on the selected theme.
 */
export function AmbientLight({ theme, monochrome = false }: { theme: ThemeName, monochrome?: boolean }) {
  const currentTheme = THEMES[theme];

  const getPosition = (pos: string) => {
    switch (pos) {
      case 'top-left': return { top: '-20%', left: '-20%' };
      case 'top-right': return { top: '-20%', right: '-20%' };
      case 'bottom-left': return { bottom: '-20%', left: '-20%' };
      case 'bottom-right': return { bottom: '-20%', right: '-20%' };
      case 'top-center': return { top: '-20%', left: '30%' };
      case 'bottom-center': return { bottom: '-20%', left: '30%' };
      case 'center-right': return { top: '30%', right: '-20%' };
      case 'center': return { top: '30%', left: '30%' };
      default: return { top: '-20%', left: '-20%' };
    }
  };

  return (
    <motion.div
      className="fixed w-[80vw] h-[80vw] rounded-full pointer-events-none mix-blend-screen opacity-30 blur-[120px]"
      animate={{
        background: `radial-gradient(circle, ${monochrome ? '#111111' : currentTheme.color} 0%, transparent 70%)`,
        ...getPosition(currentTheme.lightPosition)
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{ zIndex: 0 }}
    />
  );
}
