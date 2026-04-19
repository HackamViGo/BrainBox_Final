'use client';

import { motion } from 'motion/react';
import { THEMES } from '@brainbox/types';
import type { ThemeName } from '@brainbox/types';

export function AmbientLight({
  theme,
  monochrome = false,
}: {
  theme: ThemeName;
  monochrome?: boolean;
}) {
  const currentTheme = THEMES[theme];
  const color = monochrome ? '#111111' : currentTheme.color;

  const getPosition = (pos: string): Record<string, string> => {
    switch (pos) {
      case 'top-left':      return { top: '-55%', left: '-35%' };
      case 'top-right':     return { top: '-55%', right: '-35%' };
      case 'bottom-left':   return { bottom: '-55%', left: '-35%' };
      case 'bottom-right':  return { bottom: '-55%', right: '-35%' };
      case 'top-center':    return { top: '-55%', left: '15%' };
      case 'bottom-center': return { bottom: '-55%', left: '15%' };
      case 'center-right':  return { top: '35%', right: '-55%' };
      case 'center':        return { top: '-55%', left: '35%' };
      default:              return { top: '-55%', left: '-35%' };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute rounded-full"
        style={{ width: '140vw', height: '140vw', mixBlendMode: 'screen' }}
        animate={{
          background: `radial-gradient(circle at center, ${color}38 0%, ${color}12 40%, transparent 70%)`,
          filter: 'blur(72px)',
          opacity: 1,
          ...getPosition(currentTheme.lightPosition),
        }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: '90vw', height: '90vw', mixBlendMode: 'screen' }}
        animate={{
          background: `radial-gradient(circle at center, ${color}18 0%, transparent 65%)`,
          filter: 'blur(100px)',
          opacity: monochrome ? 0 : 1,
          top: ['25%', '45%', '25%'],
          left: ['25%', '55%', '25%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          background: { duration: 2.5, ease: 'easeInOut' },
        }}
      />
    </div>
  );
}
