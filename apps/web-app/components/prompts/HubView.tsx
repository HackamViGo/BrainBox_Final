'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Lock, LayoutGrid, GitBranch, Zap, Wand2, Download, ArrowRight } from 'lucide-react';

interface HubViewProps {
  onNavigate: (view: 'frameworks' | 'refine' | 'captures' | 'saved-prompts') => void;
}

export function HubView({ onNavigate }: HubViewProps) {
  const [chestOpen, setChestOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto w-full space-y-12 py-8">
      {/* Daily Prompt */}
      <motion.div 
        className="glass-panel rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden group cursor-pointer"
        onClick={() => setChestOpen(true)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-600/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.3)] shrink-0 z-10">
          {chestOpen ? <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-black" /> : <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-black" />}
        </div>
        
        <div className="flex-1 text-center md:text-left z-10">
          <h2 className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] text-yellow-500/80 mb-2">Prompt of the Day</h2>
          {!chestOpen ? (
            <>
              <h3 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Unlock Today's Masterpiece</h3>
              <p className="text-white/50 text-base sm:text-lg">A carefully crafted template designed to push the boundaries of AI reasoning.</p>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-yellow-400">"The Socratic Challenger"</h3>
              <p className="text-white/80 text-base sm:text-lg mb-6">Act as a critical thinker and challenge my assumptions on [TOPIC]. Identify logical fallacies, propose counter-arguments, and force me to defend my position with rigorous evidence.</p>
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors">
                Use Template
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Gateways */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-white/50" /> Gateways
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <GatewayCard 
            id="frameworks"
            title="Frameworks" 
            subtitle="The 7x7 Matrix"
            icon={GitBranch} 
            color="from-blue-500 to-cyan-500"
            desc="Access your 49 professional structures and their model-specific branches." 
            onClick={() => onNavigate('frameworks')} 
          />
          <GatewayCard 
            id="saved-prompts"
            title="Saved Prompts" 
            subtitle="Your Collection"
            icon={Zap} 
            color="from-amber-500 to-orange-500"
            desc="Access your saved prompts, organized by folders or in the main feed." 
            onClick={() => onNavigate('saved-prompts')} 
          />
          <GatewayCard 
            id="refine"
            title="Refine" 
            subtitle="The 7-Way Optimizer"
            icon={Wand2} 
            color="from-purple-500 to-pink-500"
            desc="Instantly enhance raw thoughts into professional prompts without diffs." 
            onClick={() => onNavigate('refine')} 
          />
          <GatewayCard 
            id="captures"
            title="Captures" 
            subtitle="The Raw Feed"
            icon={Download} 
            color="from-emerald-500 to-teal-500"
            desc="Direct pipeline from the BrainBox Extension. Raw text ready for processing." 
            onClick={() => onNavigate('captures')} 
          />
        </div>
      </div>
    </div>
  );
}

function GatewayCard({ id, title, subtitle, icon: Icon, color, desc, onClick }: any) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative cursor-pointer h-64 sm:h-72"
    >
      <motion.div 
        layoutId={`gateway-${id}-bg`}
        className="absolute inset-0 glass-panel overflow-hidden"
        style={{ borderRadius: 24 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      </motion.div>
      
      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white/80 group-hover:text-white" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold mb-1 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">{subtitle}</p>
        <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-auto line-clamp-3">{desc}</p>
        
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
