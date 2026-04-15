'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Plus, Search, BookOpen, Zap, Copy, Edit2, Trash2
} from 'lucide-react';
import type { ThemeName, Folder, Item } from '@brainbox/types';
import { THEMES, ICON_LIBRARY } from '@brainbox/types';
import type { LucideIcon } from 'lucide-react';

interface SavedPromptsViewProps {
  onBack: () => void;
  activeFolder?: string | null;
  setActiveFolder: (id: string | null) => void;
  onNewPrompt: () => void;
  onSelectTheme: (theme: ThemeName) => void;
  promptFolders: Folder[];
  items: Item[];
  onDragStart?: (event: React.DragEvent, nodeType: string, data: any) => void;
  onDeletePrompt?: (id: string) => void;
  onEditPrompt?: (item: Item) => void;
}

export function SavedPromptsView({ 
  onBack, activeFolder, setActiveFolder, onNewPrompt, 
  onSelectTheme, promptFolders, items, onDragStart,
  onDeletePrompt, onEditPrompt
}: SavedPromptsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolders = promptFolders.filter(f => {
    if (searchQuery) {
      return f.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return f.parentId === (activeFolder || null);
  });

  const filteredPrompts = items.filter(item => {
    if (item.type !== 'prompt') return false;
    if (item.deletedAt) return false;

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery) return matchesSearch;
    return item.folderId === (activeFolder || null);
  });

  const activeFolderData = activeFolder ? promptFolders.find(f => f.id === activeFolder) : null;
  const ActiveIcon = activeFolderData ? (ICON_LIBRARY[(activeFolderData.iconIndex || 0) % ICON_LIBRARY.length] as LucideIcon) : Zap;

  return (
    <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (activeFolder) {
                setActiveFolder(activeFolderData?.parentId || null);
              } else {
                onBack();
              }
            }} 
            className="p-3 glass-panel-light rounded-xl hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-4">
              {ActiveIcon && <ActiveIcon className="w-8 h-8 text-white/20" />}
              {activeFolderData ? activeFolderData.name : 'Saved Prompts'}
            </h2>
            <p className="text-white/40">{activeFolderData ? 'Viewing items in this folder' : 'Your main prompt collection'}</p>
          </div>
        </div>
        
        <button 
          onClick={onNewPrompt}
          title="Create New Prompt"
          className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-5 h-5" /> New Prompt
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your prompts..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-12 scrollbar-hide">
        {filteredFolders.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {filteredFolders.map((folder) => (
              <motion.button
                key={folder.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFolder(folder.id)}
                className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group text-center flex flex-col items-center gap-4 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] max-w-[320px]"
              >
                {(() => {
                  const FolderIconComp = ICON_LIBRARY[(folder.iconIndex || 0) % ICON_LIBRARY.length] as LucideIcon;
                  return (
                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500 shadow-xl group-hover:shadow-amber-500/10">
                      {FolderIconComp && <FolderIconComp className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform" />}
                    </div>
                  );
                })()}
                <div>
                  <h3 className="font-bold text-xl mb-1">{folder.name}</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Neural Archive</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onMouseEnter={() => onSelectTheme(((prompt as any).modelId as ThemeName) || 'chatgpt')}
              onMouseLeave={() => onSelectTheme(null as any)}
              draggable
              onDragStart={(e) => {
                if (onDragStart) {
                  onDragStart(e as any, 'glassNode', prompt);
                } else {
                  const dragEvent = e as unknown as React.DragEvent;
                  dragEvent.dataTransfer.setData('application/json', JSON.stringify(prompt));
                  dragEvent.dataTransfer.effectAllowed = 'move';
                }
              }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group cursor-grab relative overflow-hidden active:scale-[0.98] active:cursor-grabbing"
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: THEMES[((prompt as any).modelId as ThemeName) || 'chatgpt']?.color || '#ffffff' }}
              />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110 shadow-xl"
                    style={{ color: THEMES[((prompt as any).modelId as ThemeName) || 'chatgpt']?.color || '#ffffff' }}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition-colors flex items-center gap-3">
                      {prompt.title}
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: THEMES[((prompt as any).modelId as ThemeName) || 'chatgpt']?.color || '#ffffff', boxShadow: `0 0 10px ${THEMES[((prompt as any).modelId as ThemeName) || 'chatgpt']?.color || '#ffffff'}` }} 
                      />
                    </h3>
                    <p className="text-white/50 text-sm">{prompt.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors" 
                    title="Copy Prompt"
                    onClick={e => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(prompt.content || prompt.description || '');
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors" 
                    title="Edit Prompt"
                    onClick={e => {
                      e.stopPropagation();
                      if (onEditPrompt) onEditPrompt(prompt);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" 
                    title="Delete Prompt"
                    onClick={e => {
                      e.stopPropagation();
                      if (onDeletePrompt) onDeletePrompt(prompt.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-black/20 rounded-xl p-4 font-mono text-xs text-white/70 leading-relaxed">
                {prompt.content || prompt.description}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-white/20">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p>No prompts found in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
