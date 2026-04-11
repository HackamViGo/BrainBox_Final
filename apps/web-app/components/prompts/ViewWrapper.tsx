'use client'

import React from 'react';
import { motion } from 'motion/react';

interface ViewWrapperProps {
  children: React.ReactNode;
  id: string;
}

export function ViewWrapper({ children, id }: ViewWrapperProps) {
  return (
    <motion.div 
      className="absolute inset-0 z-10 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div 
        layoutId={`gateway-${id}-bg`}
        className="absolute inset-0 glass-panel z-0"
        style={{ borderRadius: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-8 lg:pl-56 lg:pr-12 lg:py-12"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
