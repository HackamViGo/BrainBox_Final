'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Snowflake, 
  Diamond, 
  Trash2, 
  Clock, 
  Database, 
  Wind,
  CheckCircle2,
  Circle,
  AlertTriangle
} from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import type { Item } from '@brainbox/types';

export function Archive() {
  const { items: allItems, deleteItem, freezeItem } = useLibraryStore();
  const [activeLayer, setActiveLayer] = useState<'echoes' | 'artifacts'>('echoes');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [retentionDays, setRetentionDays] = useState(30);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDays = localStorage.getItem('vault_retention_days');
      if (savedDays && savedDays !== 'never') {
        setRetentionDays(parseInt(savedDays, 10));
      }
    }
  }, []);

  // Filter items that are "deleted" (in Archive)
  const archivedItems = allItems.filter((item: Item) => !!item.deletedAt);

  const displayedItems = archivedItems.filter((item: Item) => 
    activeLayer === 'echoes' ? !item.isPermanent : item.isPermanent
  ).sort((a: Item, b: Item) => {
    return new Date(b.deletedAt || 0).getTime() - new Date(a.deletedAt || 0).getTime();
  });

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === displayedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedItems.map((i: Item) => i.id)));
    }
  };

  const handleFreeze = async (id: string) => {
    await freezeItem(id);
  };

  const handlePermanentDelete = async (id: string) => {
    // In a real app involving Supabase, this would be a separate hard delete action
    // For now we just use deleteItem which acts as soft delete in our store but we are already in archive
    await deleteItem(id);
  };

  const emptyTheVoid = async () => {
    // Logic to delete all currently displayed echoes
    for (const item of displayedItems) {
      await handlePermanentDelete(item.id);
    }
    setSelectedIds(new Set());
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto no-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full pb-20"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className={`w-14 h-14 rounded-3xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-2xl shrink-0 ${activeLayer === 'echoes' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
              {activeLayer === 'echoes' ? <Wind className="w-8 h-8 text-blue-400" /> : <Diamond className="w-8 h-8 text-amber-400" />}
            </div>
            <div className="transition-transform duration-300 group-hover:translate-x-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter truncate uppercase italic">Neural Vault</h1>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] font-mono mt-1">Fragment Management & Retention</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
            <button 
              onClick={() => { setActiveLayer('echoes'); setSelectedIds(new Set()); }}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeLayer === 'echoes' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
            >
              Echoes
            </button>
            <button 
              onClick={() => { setActiveLayer('artifacts'); setSelectedIds(new Set()); }}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeLayer === 'artifacts' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
            >
              Artifacts
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              <div className="w-4 h-4 rounded-md border border-white/20 flex items-center justify-center">
                {selectedIds.size === displayedItems.length && displayedItems.length > 0 && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              Select All ({displayedItems.length})
            </button>
            
            {selectedIds.size > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 ml-4"
              >
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                  <Trash2 className="w-3.5 h-3.5" /> Purge
                </button>
                {activeLayer === 'echoes' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                    <Snowflake className="w-3.5 h-3.5" /> Freeze
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {activeLayer === 'echoes' && displayedItems.length > 0 && (
            <button 
              onClick={emptyTheVoid}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
            >
              <Wind className="w-4 h-4" /> Empty the Void
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {displayedItems.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-20 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4"
              >
                <Database className="w-12 h-12 text-white/5" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white/20">The vault is silent</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/10">No {activeLayer} detected in neural storage</p>
              </motion.div>
            ) : (
              displayedItems.map((item: Item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative glass-panel p-6 rounded-3xl border transition-all duration-300 flex items-center gap-6 ${
                    selectedIds.has(item.id) ? 'bg-white/10 border-white/20 border-l-4 border-l-white/40' : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <button 
                    onClick={() => toggleSelection(item.id)}
                    className="shrink-0"
                  >
                    {selectedIds.has(item.id) 
                      ? <CheckCircle2 className="w-5 h-5 text-white/90" /> 
                      : <Circle className="w-5 h-5 text-white/10 group-hover:text-white/30" />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white/90 truncate uppercase tracking-tight">{item.title}</h3>
                      {item.isPermanent && <Diamond className="w-3 h-3 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/20 font-mono">Deleted {new Date(item.deletedAt!).toLocaleDateString()}</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-white/20">1.2 MB Neural Weight</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleFreeze(item.id)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-amber-500/20 text-white/20 hover:text-amber-400 transition-all"
                      title="Freeze into Artifact"
                    >
                      <Snowflake className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handlePermanentDelete(item.id)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all"
                      title="Erase Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        {activeLayer === 'echoes' && displayedItems.length > 0 && (
          <div className="mt-12 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-6">
            <AlertTriangle className="w-8 h-8 text-blue-400/40 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/60 leading-relaxed font-mono">
                Items in the Void are automatically erased after {retentionDays} days. 
                Synchronize them into Artifacts (Freeze) to prevent automatic neural dissolution.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
