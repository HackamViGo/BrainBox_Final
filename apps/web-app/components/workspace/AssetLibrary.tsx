'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Zap, Search, ChevronRight } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import type { Item } from '@brainbox/types';

export function AssetLibrary({
  onDragStartAction,
}: {
  onDragStartAction: (event: React.DragEvent, nodeType: string, data: Item) => void;
}) {
  const [mode, setMode] = useState<'navigation' | 'library'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useLibraryStore();

  const chats = items.filter(
    (i) =>
      i.type === 'chat' &&
      !i.deletedAt &&
      (i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const prompts = items.filter(
    (i) =>
      i.type === 'prompt' &&
      !i.deletedAt &&
      (i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="glass-panel z-10 flex h-full w-80 shrink-0 flex-col border-r border-white/10">
      <div className="border-b border-white/5 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600">
            <span className="text-xl font-bold text-white">W</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Workspace</h2>
        </div>

        <div className="relative flex rounded-xl border border-white/5 bg-black/40 p-1">
          <motion.div
            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-white/10 shadow-sm"
            animate={{ left: mode === 'navigation' ? 4 : 'calc(50% + 0px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setMode('navigation')}
            className={`z-10 flex-1 py-2 text-sm font-medium transition-colors ${mode === 'navigation' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            Navigation
          </button>
          <button
            onClick={() => setMode('library')}
            className={`z-10 flex-1 py-2 text-sm font-medium transition-colors ${mode === 'library' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            The Treasure
          </button>
        </div>
      </div>

      {mode === 'library' ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-2 pr-4 pl-10 text-sm text-white placeholder-white/30 transition-colors focus:border-white/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
            <div className="flex min-h-[50%] flex-1 flex-col">
              <div className="mb-3 flex shrink-0 items-center gap-2 px-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-bold tracking-wider text-white/50 uppercase">Chats</h3>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {chats.length > 0 ? (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      draggable
                      onDragStart={(e) => onDragStartAction(e, 'glassNode', chat)}
                      className="group cursor-grab rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10 active:cursor-grabbing"
                    >
                      <h4 className="mb-1 flex items-center justify-between text-sm font-medium text-white/90">
                        {chat.title}
                        <ChevronRight className="h-4 w-4 text-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      </h4>
                      <p className="line-clamp-1 text-xs text-white/40">
                        {chat.description || 'No description'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-white/20">No chats found</div>
                )}
              </div>
            </div>

            <div className="flex min-h-[50%] flex-1 flex-col">
              <div className="mb-3 flex shrink-0 items-center gap-2 px-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold tracking-wider text-white/50 uppercase">
                  Prompts
                </h3>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {prompts.length > 0 ? (
                  prompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      draggable
                      onDragStart={(e) => onDragStartAction(e, 'glassNode', prompt)}
                      className="group cursor-grab rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10 active:cursor-grabbing"
                    >
                      <h4 className="mb-1 flex items-center justify-between text-sm font-medium text-white/90">
                        {prompt.title}
                        <ChevronRight className="h-4 w-4 text-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      </h4>
                      <p className="line-clamp-1 text-xs text-white/40">
                        {prompt.description || 'No description'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-white/20">No prompts found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <p className="text-sm text-white/40">
            Standard navigation mode active. Use the main sidebar.
          </p>
        </div>
      )}
    </div>
  );
}
