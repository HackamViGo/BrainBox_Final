'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Rocket, Star, Plus, Download
} from 'lucide-react';

interface CapturesViewProps {
  onBack: () => void;
  onRefine: (text: string) => void;
  onSaveToPrompts: (text: string) => void;
  captures: any[];
  onDrop: (e: React.DragEvent) => void;
}

export function CapturesView({ onBack, onRefine, onSaveToPrompts, captures, onDrop }: CapturesViewProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div 
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        setIsDraggingOver(false);
        onDrop(e);
      }}
      className={`max-w-4xl mx-auto w-full space-y-8 min-h-[500px] transition-all duration-300 rounded-[2rem] p-4 ${
        isDraggingOver ? 'bg-white/5 ring-2 ring-amber-500/50 scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 glass-panel-light rounded-xl hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold">Captures</h2>
            <p className="text-white/40">The Raw Feed (Vertical Stream)</p>
          </div>
        </div>
        
        {isDraggingOver && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Drop to Capture
          </motion.div>
        )}
      </div>

      <div className="relative pl-8 sm:pl-12 pb-20">
        <div className="absolute left-[15px] sm:left-[23px] top-4 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />

        <div className="space-y-12">
          {captures.map((capture, i) => (
            <motion.div 
              key={capture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="absolute -left-8 sm:-left-12 top-6 w-4 h-4 rounded-full bg-white/20 border-2 border-[#0a0a0a] ring-2 ring-white/10 group-hover:bg-white transition-colors z-10" />

              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
                <div className="bg-white/5 px-6 py-3 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${capture.domain}&sz=32`} 
                      alt={capture.domain} 
                      className="w-5 h-5 rounded-sm opacity-80"
                    />
                    <span className="text-sm font-medium text-white/70 truncate max-w-[200px] sm:max-w-sm">{capture.url}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onRefine(capture.text)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold shadow-lg backdrop-blur-md border border-purple-500/30"
                      >
                        <Rocket className="w-3 h-3" /> Refine
                      </button>
                      <button 
                        onClick={() => onSaveToPrompts(capture.text)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold shadow-lg backdrop-blur-md border border-amber-500/30"
                      >
                        <Star className="w-3 h-3" /> Save
                      </button>
                    </div>
                    <span className="text-xs font-mono text-white/40 shrink-0">{capture.date}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="font-mono text-sm text-white/80 leading-relaxed">
                    {capture.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          {captures.length === 0 && (
            <div className="text-center py-20 text-white/20">
              <Download className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No captures yet. Drop content here or from the extension.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
