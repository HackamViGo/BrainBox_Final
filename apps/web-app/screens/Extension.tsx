'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Puzzle, Download, ChevronUp, ExternalLink, Zap, Shield, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useExtensionStore } from '@/store/useExtensionStore';
import { useShallow } from 'zustand/react/shallow';

export function Extension() {
  const { setActiveScreen } = useAppStore();
  const { isConnected, version, lastSyncAt, error, activePaltforms } = useExtensionStore(
    useShallow((s) => ({
      isConnected: s.isConnected,
      version: s.version,
      lastSyncAt: s.lastSyncAt,
      error: s.error,
      activePaltforms: s.activePaltforms
    }))
  );
  
  const [touchStart, setTouchStart] = useState(0);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < -50) {
      setActiveScreen('dashboard');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0]?.clientY;
    if (touchEnd !== undefined && touchEnd - touchStart > 50) {
      setActiveScreen('dashboard');
    }
  };

  return (
    <div 
      className="h-full flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto relative no-scrollbar"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Back to Dashboard Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group"
        onClick={() => setActiveScreen('dashboard')}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronUp className="w-5 h-5 text-white/30 group-hover:text-white/80 transition-all duration-500" />
        </motion.div>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 group-hover:text-white/60 transition-all duration-500">
          Neural Ascent
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full mt-20 sm:mt-24 pb-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12 group">
          <div className={`w-14 h-14 rounded-3xl ${isConnected ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-gradient-to-br from-amber-400 to-orange-600 shadow-2xl'} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shrink-0 relative`}>
            <Puzzle className="w-7 h-7 text-white" />
            {isConnected && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              </motion.div>
            )}
          </div>
          <div className="transition-transform duration-300 group-hover:translate-x-1 min-w-0">
             <div className="flex items-center gap-3">
               <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter truncate uppercase italic">Cortex Extension</h1>
               <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                 {version || '4.0.0'}
               </div>
             </div>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] font-mono mt-1">
               {isConnected ? 'Neural Connection Established' : 'Direct Neural Integration for Chrome'}
             </p>
          </div>
          
          {isConnected && (
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Last Sync</div>
                <div className="text-xs text-white/60 font-mono italic">{lastSyncAt ? new Date(lastSyncAt).toLocaleTimeString() : 'Never'}</div>
              </div>
              <div className="flex -space-x-2">
                {activePaltforms.map(p => (
                  <div key={p} className="w-8 h-8 rounded-full border-2 border-black bg-white/5 flex items-center justify-center text-[8px] font-bold uppercase text-white/40">
                    {p[0]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
           <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all" />
              <Zap className="w-8 h-8 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Seamless Capture</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">Запвзвайте всяка мисъл, статия или код директно от браузъра с един клик. Моментална синхронизация с вашия BrainBox.</p>
           </div>
           
           <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />
              <Shield className="w-8 h-8 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Private & Secure</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">Вашите данни са криптирани и достъпни само за вас. Без проследяване, без реклами, само чист интелект.</p>
           </div>
        </div>

        {!isConnected ? (
          <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group animate-pulse">
               <Download className="w-10 h-10 text-white/40 group-hover:text-white transition-colors" />
             </div>
             
             <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-tighter">Свържете вашия поток</h2>
             <p className="text-white/40 text-sm sm:text-base max-w-md mb-10 leading-relaxed font-medium font-serif italic">
               "BrainBox Extension превръща хаотичното сърфиране в структуриран интелектуален процес."
             </p>
             
             <button className="group relative px-10 py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center gap-3">
               <ExternalLink className="w-5 h-5" />
               Install on Chrome
               <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm" />
             </button>
             
             <p className="mt-8 text-[10px] font-bold font-mono text-white/20 uppercase tracking-[0.4em]">Official Release • Free for All Users</p>
          </div>
        ) : (
          <div className="glass-panel p-10 sm:p-12 rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-tighter">Синхронизирани Платформи</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['chatgpt', 'gemini', 'claude', 'grok'].map(p => (
                <div key={p} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 group hover:border-white/10 transition-all">
                  <div className={`w-2 h-2 rounded-full ${activePaltforms.includes(p) ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 capitalize">{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-white/20" />
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Auto-sync active</span>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors font-bold"
              >
                Reconnect Extension
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
