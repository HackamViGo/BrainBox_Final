'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, X, GitCommit, Trash2
} from 'lucide-react';
import type { ThemeName } from '@brainbox/types';
import { MATRIX_DATA } from '@/lib/prompts-data';

interface FrameworksViewProps {
  onBack: () => void;
  setTheme: (theme: ThemeName) => void;
}

export function FrameworksView({ onBack, setTheme }: FrameworksViewProps) {
  const [selectedCell, setSelectedCell] = useState<any>(null);

  return (
    <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={onBack} className="p-3 glass-panel-light rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">Frameworks</h2>
          <p className="text-white/40">The 7x7 Matrix</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-8">
        <div className="min-w-[1000px] grid grid-cols-7 gap-6 h-full">
          {MATRIX_DATA.map((col) => (
            <div key={col.id} className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center p-4 glass-panel-light rounded-2xl mb-2">
                <col.icon className={`w-6 h-6 mb-2 bg-gradient-to-br ${col.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
                <span className="text-sm font-bold uppercase tracking-wider text-white/70">{col.label}</span>
              </div>
              
              {col.cells.map((cell) => {
                const hasBranches = cell.branches.length > 0;
                return (
                  <motion.div
                    key={cell.id}
                    onClick={() => setSelectedCell({ ...cell, category: col })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square glass-panel-light rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                      hasBranches ? `ring-1 ${col.ring} shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'hover:bg-white/10'
                    }`}
                  >
                    {hasBranches && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${col.color} opacity-10 pointer-events-none`} />
                    )}
                    <col.icon className={`w-8 h-8 mb-3 ${hasBranches ? 'text-white' : 'text-white/40'}`} />
                    <span className={`text-xs font-medium ${hasBranches ? 'text-white' : 'text-white/60'}`}>{cell.title}</span>
                    
                    {hasBranches && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCell && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-2xl rounded-[2rem] p-8 relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCell(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCell.category.color} flex items-center justify-center shadow-lg`}>
                  <selectedCell.category.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{selectedCell.title}</h3>
                  <p className="text-white/50">{selectedCell.category.label} Category</p>
                </div>
              </div>

              <div className="relative pl-8 space-y-8">
                <div className="absolute left-[2.4rem] top-10 bottom-10 w-0.5 bg-gradient-to-b from-white/40 to-white/5" />

                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.5)] shrink-0">
                    v1.0
                  </div>
                  <div className="glass-panel-light p-5 rounded-2xl flex-1 border border-white/20">
                    <h4 className="font-bold text-lg mb-1">Main Trunk</h4>
                    <p className="text-sm text-white/50">The original, universal prompt.</p>
                  </div>
                </div>

                {selectedCell.branches.length > 0 ? (
                  selectedCell.branches.map((branch: any, i: number) => (
                    <motion.div 
                      key={branch.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (i + 1) }}
                      className="relative z-10 flex items-center gap-6 group"
                    >
                      <div className="absolute left-[-1.5rem] top-1/2 w-6 h-0.5 bg-white/20" />
                      
                      <div className="w-12 h-12 rounded-full glass-panel-light flex items-center justify-center font-mono text-sm shrink-0 border border-white/10 group-hover:border-white/40 transition-colors">
                        v1.{i+1}
                      </div>
                      
                      <div className="glass-panel-light p-4 rounded-2xl flex-1 flex items-center justify-between group-hover:bg-white/5 transition-colors">
                        <span className="font-medium text-white/80 group-hover:text-white">{branch.name}</span>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <GitCommit className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="pl-16 text-white/30 italic">No branches created yet.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
