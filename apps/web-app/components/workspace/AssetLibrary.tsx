'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Zap, Search, ChevronRight } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import type { Item } from '@brainbox/types';

export function AssetLibrary({ onDragStart }: { onDragStart: (event: React.DragEvent, nodeType: string, data: any) => void }) {
  const [mode, setMode] = useState<'navigation' | 'library'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useLibraryStore();

  const chats = items.filter(i => 
    i.type === 'chat' && 
    !i.deletedAt && 
    (i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (i.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const prompts = items.filter(i => 
    i.type === 'prompt' && 
    !i.deletedAt && 
    (i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (i.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-80 h-full glass-panel border-r border-white/10 flex flex-col z-10 shrink-0">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Workspace</h2>
        </div>

        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 relative">
          <motion.div
            className="absolute inset-y-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm"
            animate={{ left: mode === 'navigation' ? 4 : 'calc(50% + 0px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setMode('navigation')}
            className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${mode === 'navigation' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            Navigation
          </button>
          <button
            onClick={() => setMode('library')}
            className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${mode === 'library' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            The Treasure
          </button>
        </div>
      </div>

      {mode === 'library' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
            <div className="flex-1 flex flex-col min-h-[50%]">
              <div className="flex items-center gap-2 mb-3 px-2 shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Chats</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {chats.length > 0 ? chats.map((chat) => (
                  <div
                    key={chat.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, 'glassNode', chat)}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <h4 className="text-sm font-medium text-white/90 mb-1 flex items-center justify-between">
                      {chat.title}
                      <ChevronRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-white/40 line-clamp-1">{chat.description || 'No description'}</p>
                  </div>
                )) : (
                  <div className="text-center py-8 text-white/20 text-xs">No chats found</div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-[50%]">
              <div className="flex items-center gap-2 mb-3 px-2 shrink-0">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Prompts</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {prompts.length > 0 ? prompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, 'glassNode', prompt)}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <h4 className="text-sm font-medium text-white/90 mb-1 flex items-center justify-between">
                      {prompt.title}
                      <ChevronRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-white/40 line-clamp-1">{prompt.description || 'No description'}</p>
                  </div>
                )) : (
                  <div className="text-center py-8 text-white/20 text-xs">No prompts found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 flex items-center justify-center text-center">
          <p className="text-white/40 text-sm">Standard navigation mode active. Use the main sidebar.</p>
        </div>
      )}
    </div>
  );
}
