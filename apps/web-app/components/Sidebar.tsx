'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Home, BookOpen, Zap, BarChart2, Users, Settings, Fingerprint, Puzzle, Archive, Network,
  MessageSquare, Cpu, Sparkles, Brain, History, Folder, ChevronRight, ChevronLeft, Hash, Layers,
  Bot, Eye, Compass, Swords, Telescope, Cloud, Workflow, Activity, Search, Pin, Plus,
  FileText, Image, Music, Video, Globe, Terminal, Database, Shield, Lock, Unlock,
  Bell, Mail, Phone, Camera, Map, Calendar, Clock, Star, Heart, Share2,
  Download, Upload, Trash2, Edit3, Check, X, Filter, List, Grid, Maximize2,
  Minimize2, ExternalLink, Link2, Paperclip, Scissors, Copy, Clipboard, Save,
  HardDrive, Monitor, Smartphone, Tablet, Watch, Headphones, Speaker, Mic,
  Volume2, Sun, Moon, Wind, Droplets, Flame, ZapOff, Anchor, Target, Flag,
  MoreVertical, Key
} from 'lucide-react'

import { ICON_LIBRARY } from '@brainbox/ui'

const NeuralField = dynamic(
  () => import('@brainbox/ui').then(m => ({ default: m.NeuralField })),
  { ssr: false }
)
import { useAppStore } from '@/store/useAppStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import type { ScreenName, Folder as FolderData, Item } from '@brainbox/types'
import { cn } from '@brainbox/utils'

const ICON_CATEGORIES = [
  {
    name: 'Essentials',
    icons: [76, 74, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 75]
  },
  {
    name: 'AI & Tech',
    icons: [5, 7, 6, 4, 72, 71, 20, 21, 12, 13, 14, 73, 2, 1]
  },
  {
    name: 'Media & Sound',
    icons: [16, 17, 18, 58, 59, 60, 61]
  },
  {
    name: 'Devices',
    icons: [54, 55, 56, 57, 53]
  },
  {
    name: 'Actions & Tools',
    icons: [35, 36, 44, 45, 46, 47, 48, 49, 50, 51, 52]
  },
  {
    name: 'Nature & Symbols',
    icons: [62, 63, 64, 65, 66, 67, 68, 69, 70, 9, 10, 11, 19]
  }
];

export function Sidebar() {
  const { 
    activeScreen, setActiveScreen, 
    theme, 
    isSidebarExpanded: isExpanded, setIsSidebarExpanded: setIsExpanded,
    isPinned, setPinned,
    isMobileSidebarOpen: isMobileOpen, closeMobileSidebar: onCloseMobile,
    switchMode, setSwitchMode,
    slideDirection,
    searchQuery, setSearchQuery,
    activeFolder, setActiveFolder,
    activeModelId, setActiveModelId,
    expandedFolders, toggleFolder,
    setModalOpen
  } = useAppStore()

  const { libraryFolders, promptFolders, items, updateItem, updateFolder } = useLibraryStore()

  useEffect(() => {
    const handleMoveItem = (e: any) => {
      const { itemId, folderId } = e.detail;
      updateItem(itemId, { folderId });
    };

    const handleMoveFolder = (e: any) => {
      const { folderId, parentId } = e.detail;
      updateFolder(folderId, { parentId });
    };

    window.addEventListener('moveItemToFolder', handleMoveItem);
    window.addEventListener('moveFolderToFolder', handleMoveFolder);
    return () => {
      window.removeEventListener('moveItemToFolder', handleMoveItem);
      window.removeEventListener('moveFolderToFolder', handleMoveFolder);
    };
  }, [updateItem, updateFolder]);

  const renderFolders = (folders: FolderData[], parentId: string | null = null) => {
    const filteredFolders = folders.filter(f => {
      if (f.parentId !== parentId) return false;
      if (!searchQuery) return true;
      
      const nameMatch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (nameMatch) return true;

      const itemsMatch = items.some(i => i.folderId === f.id && i.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (itemsMatch) return true;

      const hasMatchingChild = (fid: string): boolean => {
        const children = folders.filter(child => child.parentId === fid);
        return children.some(child => 
          child.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          items.some(i => i.folderId === child.id && i.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          hasMatchingChild(child.id)
        );
      };
      
      return hasMatchingChild(f.id);
    });

    if (filteredFolders.length === 0 && parentId === null && searchQuery) {
      return null;
    }

    return filteredFolders.map(folder => (
      <React.Fragment key={folder.id}>
        <FolderItem 
          folder={folder}
          isActive={activeFolder === folder.id}
          isExpandedInRail={expandedFolders.includes(folder.id) || !!searchQuery}
          onToggle={() => toggleFolder(folder.id)}
          onClick={() => setActiveFolder(folder.id)}
          isExpanded={isExpanded}
          isPinned={isPinned}
          isMobileOpen={isMobileOpen}
          items={items.filter(i => i.folderId === folder.id && (!searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase())))}
        />
        {(expandedFolders.includes(folder.id) || !!searchQuery) && (isExpanded || isPinned || isMobileOpen) && (
          <div className="ml-3 border-l border-white/10 pl-1">
            {renderFolders(folders, folder.id)}
          </div>
        )}
      </React.Fragment>
    ));
  };
  
  const globalItems = [
    { id: 'dashboard' as ScreenName, icon: Home, label: 'Dashboard' },
    { id: 'library' as ScreenName, icon: BookOpen, label: 'Library' },
    { id: 'prompts' as ScreenName, icon: Zap, label: 'Prompts' },
    { id: 'studio' as ScreenName, icon: MessageSquare, label: 'AI Nexus' },
    { id: 'workspace' as ScreenName, icon: Workflow, label: 'Workspace' },
    { id: 'analytics' as ScreenName, icon: Brain, label: 'Mind Graph' },
    { id: 'archive' as ScreenName, icon: History, label: 'Archive' },
  ];

  const bottomItems = [
    { id: 'settings' as ScreenName, icon: Settings, label: 'Settings' },
    { id: 'profile' as ScreenName, icon: Fingerprint, label: 'Identity' },
    { id: 'extension' as ScreenName, icon: Puzzle, label: 'Extension' },
  ];

  const feathers = [
    { id: 'chatgpt', icon: Brain, label: 'ChatGPT', color: 'text-emerald-500', gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { id: 'gemini', icon: Sparkles, label: 'Gemini', color: 'text-blue-400', gradient: 'from-blue-400 to-indigo-600', bg: 'bg-blue-400/10', border: 'border-blue-400/20', text: 'text-blue-400' },
    { id: 'claude', icon: Bot, label: 'Claude', color: 'text-orange-400', gradient: 'from-orange-400 to-red-500', bg: 'bg-orange-400/10', border: 'border-orange-400/20', text: 'text-orange-400' },
    { id: 'grok', icon: Eye, label: 'Grok', color: 'text-gray-200', gradient: 'from-gray-200 to-gray-600', bg: 'bg-white/5', border: 'border-white/10', text: 'text-white' },
    { id: 'perplexity', icon: Compass, label: 'Perplexity', color: 'text-cyan-400', gradient: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', text: 'text-cyan-400' },
    { id: 'lmarena', icon: Swords, label: 'LM Arena', color: 'text-amber-400', gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-400/10', border: 'border-amber-400/20', text: 'text-amber-400' },
    { id: 'deepseek', icon: Telescope, label: 'DeepSeek', color: 'text-blue-600', gradient: 'from-blue-600 to-blue-800', bg: 'bg-blue-600/10', border: 'border-blue-600/20', text: 'text-blue-600' },
    { id: 'qwen', icon: Cloud, label: 'Qwen', color: 'text-purple-500', gradient: 'from-purple-500 to-indigo-700', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500' },
  ];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(10px)'
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(10px)'
    })
  };

  return (
    <>
      <motion.nav
        onMouseEnter={() => !isPinned && !isMobileOpen && setIsExpanded(true)}
        onMouseLeave={() => !isPinned && !isMobileOpen && setIsExpanded(false)}
        className={cn(
          "absolute inset-y-0 left-0 z-[100] lg:z-50 flex flex-col transition-all duration-300 overflow-hidden",
          isMobileOpen ? 'translate-x-0 w-64 glass-panel bg-black/80' : '-translate-x-full lg:translate-x-0',
          isExpanded || isPinned || isMobileOpen ? 'lg:w-64 shadow-2xl shadow-black/80 glass-panel bg-[#080808]/95' : 'lg:w-20 shadow-none glass-panel'
        )}
        initial={false}
      >
        <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none">
          <NeuralField 
            theme={theme} 
            mode="wander" 
            particleCount={20} 
            speedMultiplier={0.5}
            monochrome
          />
        </div>

        <div className="lg:hidden absolute top-4 right-4 z-[110]">
          <button 
            onClick={onCloseMobile}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className={cn(
          "lg:flex hidden p-4 border-b border-white/10 items-center h-20 overflow-hidden",
          isExpanded || isPinned || isMobileOpen ? 'px-4 justify-start' : 'justify-center'
        )}>
          <div className={cn("flex items-center min-w-0 font-display", isExpanded || isPinned || isMobileOpen ? 'gap-3' : 'gap-0')}>
            <div 
              onClick={() => {
                const nextPinned = !isPinned;
                setPinned(nextPinned);
                setIsExpanded(nextPinned);
              }}
              className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-all",
                isPinned 
                  ? 'bg-white/20 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-white/10 hover:bg-white/10'
              )}
            >
              <Brain className={cn("w-6 h-6 text-white transition-transform", isPinned ? 'scale-110' : 'scale-100')} />
            </div>
            
            <div className={cn("flex flex-col transition-all duration-300 overflow-hidden", isExpanded || isPinned || isMobileOpen ? 'opacity-100 w-40 ml-3' : 'opacity-0 w-0 ml-0')}>
              <div className="flex items-center justify-between w-full">
                <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">BrainBox</span>
                {isPinned && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500">
                    <Pin className="w-3.5 h-3.5 fill-current" />
                  </motion.div>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">Neural OS</span>
            </div>
          </div>
        </div>

        <motion.div 
          className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide cursor-grab active:cursor-grabbing"
          drag={['dashboard', 'analytics', 'archive', 'settings', 'profile', 'extension'].includes(activeScreen) ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            if (['dashboard', 'analytics', 'archive', 'settings', 'profile', 'extension'].includes(activeScreen)) return;
            const threshold = 40;
            if (info.offset.x < -threshold) {
              if (switchMode === 'global') {
                if (activeScreen === 'studio') setSwitchMode('feathers');
                else if (activeScreen === 'workspace') setSwitchMode('workspace');
                else setSwitchMode('folders');
              } else if (switchMode === 'feathers') {
                setSwitchMode('pulse');
              }
            } else if (info.offset.x > threshold) {
              if (switchMode === 'folders' || switchMode === 'workspace') setSwitchMode('global');
              else if (switchMode === 'pulse') setSwitchMode('feathers');
              else if (switchMode === 'feathers') setSwitchMode('global');
            }
          }}
        >
          <AnimatePresence mode="wait" custom={slideDirection}>
            {switchMode === 'global' && (
              <motion.div
                key="global"
                custom={slideDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="py-6 flex flex-col gap-2 px-3 min-h-full"
              >
                <div className="flex-1 space-y-2">
                  {globalItems.map((item) => (
                    <NavItem 
                      key={item.id} 
                      item={item} 
                      isActive={activeScreen === item.id} 
                      onClick={() => setActiveScreen(item.id)} 
                      isExpanded={isExpanded} 
                      isPinned={isPinned}
                      isMobileOpen={isMobileOpen}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {switchMode === 'folders' && (
              <motion.div
                key="folders"
                custom={slideDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="py-6 flex flex-col gap-1 px-3 min-h-full"
              >
                <button 
                  onClick={() => setSwitchMode('global')}
                  className={cn(
                    "flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl",
                    isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
                  )}
                >
                  <ChevronLeft className="w-6 h-6 shrink-0" />
                  <span className={cn(
                    "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
                    (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'
                  )}>
                    Back to Menu
                  </span>
                </button>

                <div className={cn(
                  "px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 transition-opacity flex items-center justify-between font-mono",
                  activeScreen === 'library' ? 'text-blue-400/40' : 'text-amber-400/40',
                  (isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'
                )}>
                  <div className="flex items-center gap-2">
                    {activeScreen === 'library' ? <BookOpen className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                    {activeScreen === 'library' ? 'Library' : 'Prompts'}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setModalOpen('newFolder', true)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors group relative"
                    >
                      <Folder className="w-3 h-3" />
                    </button>
                    {activeScreen === 'library' && (
                      <button 
                        onClick={() => setModalOpen('newChat', true)}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors group relative"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                  <div className="space-y-1">
                    <button 
                      onClick={() => setActiveFolder(null)}
                      className={cn(
                        "flex items-center transition-all relative group rounded-xl",
                        !activeFolder ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white border border-transparent',
                        isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 relative overflow-hidden",
                        isExpanded || isPinned || isMobileOpen ? 'mr-3' : 'mr-0',
                        !activeFolder 
                          ? (activeScreen === 'library' 
                              ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] text-white' 
                              : 'bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 shadow-[0_0_20px_rgba(251,191,36,0.5)] text-white') 
                          : 'bg-white/5 text-white/20 group-hover:bg-white/10 group-hover:text-white/40'
                      )}>
                        {!activeFolder && (
                          <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-white/20 blur-md pointer-events-none"
                          />
                        )}
                        {activeScreen === 'library' ? <BookOpen className="w-4 h-4 relative z-10" /> : <Zap className="w-4 h-4 relative z-10" />}
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
                        (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
                      )}>
                        Main {activeScreen === 'library' ? 'Library' : 'Prompts'}
                      </span>
                    </button>
                    
                    {!activeFolder && (isExpanded || isPinned || isMobileOpen) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {items.filter(i => (i.folderId === null || i.folderId === 'root' || !i.folderId) && i.type === (activeScreen === 'library' ? 'chat' : 'prompt') && (!searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(item => (
                          <div
                            key={item.id}
                            className="w-full group/item flex items-center gap-2 p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all text-left relative cursor-pointer"
                          >
                            {activeScreen === 'library' ? <MessageSquare className="w-3 h-3 shrink-0" /> : <Zap className="w-3 h-3 shrink-0" />}
                            <span className="text-[11px] truncate flex-1 font-display">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {renderFolders(activeScreen === 'library' ? libraryFolders : promptFolders)}
                </div>
              </motion.div>
            )}

            {switchMode === 'feathers' && (
              <motion.div
                key="feathers"
                custom={slideDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="py-6 flex flex-col gap-2 px-3 min-h-full"
              >
                <button 
                  onClick={() => setSwitchMode('global')}
                  className={cn(
                    "flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl",
                    isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
                  )}
                >
                  <ChevronLeft className="w-6 h-6 shrink-0" />
                  <span className={cn(
                    "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
                    (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'
                  )}>
                    Back to Menu
                  </span>
                </button>

                <button 
                  onClick={() => setSwitchMode('pulse')}
                  className={cn(
                    "flex items-center rounded-xl transition-all text-white/50 hover:bg-white/5 hover:text-white mb-4",
                    isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
                  )}
                >
                  <History className="w-6 h-6 shrink-0" />
                  <span className={cn(
                    "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
                    (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'
                  )}>
                    Pulse (History)
                  </span>
                  <ChevronRight className={cn("w-4 h-4 ml-auto", (isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0')} />
                </button>

                <div className={cn(
                  "px-3 py-2 text-xs font-mono text-white/40 uppercase tracking-widest transition-opacity whitespace-nowrap",
                  (isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'
                )}>Models</div>

                {feathers.map((feather) => {
                  const isActive = feather.id === activeModelId;
                  return (
                    <div key={feather.id} className="relative group">
                      <button 
                        onClick={() => {
                          if (activeScreen !== 'studio') setActiveScreen('studio');
                          if (activeModelId === feather.id) return;
                          setModalOpen('smartSwitch', true, feather);
                        }}
                        onMouseEnter={() => useAppStore.getState().setHoverTheme(feather.id as any)}
                        onMouseLeave={() => useAppStore.getState().setHoverTheme(null)}
                        className={cn(
                          "flex items-center border transition-all relative group rounded-xl",
                          isActive ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/5',
                          isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
                        )}
                      >
                        <feather.icon className={cn("w-6 h-6 shrink-0 transition-transform group-hover:scale-110", feather.color)} />
                        <div className={cn(
                          "flex items-center transition-all duration-300 overflow-hidden",
                          isExpanded || isPinned || isMobileOpen ? 'opacity-100 ml-4 max-w-[200px] gap-2' : 'opacity-0 ml-0 max-w-0 gap-0'
                        )}>
                          <div className={cn("w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300", feather.color)} />
                          <span className={cn("font-medium whitespace-nowrap font-display", isActive ? 'text-white' : 'text-white/70')}>
                            {feather.label}
                          </span>
                        </div>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalOpen('apiKey', true, { id: feather.id, name: feather.label });
                        }}
                        className={cn(
                          "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20",
                          !(isExpanded || isPinned || isMobileOpen) && "hidden"
                        )}
                      >
                        <Key className="w-3.5 h-3.5 text-white/70" />
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {switchMode === 'pulse' && (
              <motion.div
                key="pulse"
                custom={slideDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="py-6 flex flex-col gap-2 px-3 min-h-full"
              >
                <button 
                  onClick={() => setSwitchMode('feathers')}
                  className={cn(
                    "flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl",
                    isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
                  )}
                >
                  <ChevronLeft className="w-6 h-6 shrink-0" />
                  <span className={cn(
                    "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
                    (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'
                  )}>
                    Back to Models
                  </span>
                </button>

                <div className={cn(
                  "px-3 py-2 text-xs font-mono text-white/40 uppercase tracking-widest transition-opacity whitespace-nowrap",
                  (isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'
                )}>Recent Threads</div>
                {[1, 2, 3].map((i) => (
                  <button key={i} className={cn(
                    "flex items-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all",
                    isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4 border border-transparent hover:border-white/10' : 'w-12 h-12 justify-center mx-auto border border-transparent'
                  )}>
                    <MessageSquare className="w-6 h-6 shrink-0" />
                    <div className={cn("text-left transition-all duration-300 overflow-hidden", (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0')}>
                      <div className="text-sm font-medium text-white truncate whitespace-nowrap font-display">Chat Session {i}</div>
                      <div className="text-xs text-white/40 truncate whitespace-nowrap font-mono uppercase">2 hours ago</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {switchMode === 'workspace' && (
              <motion.div
                key="workspace"
                custom={slideDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="py-6 flex flex-col gap-0 px-3 min-h-full"
              >
                <button 
                  onClick={() => setSwitchMode('global')}
                  className={cn(
                    "flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl",
                    isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
                  )}
                >
                  <ChevronLeft className="w-6 h-6 shrink-0" />
                  <span className={cn(
                    "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
                    (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'
                  )}>
                    Back to Menu
                  </span>
                </button>

                <motion.div 
                  initial={false}
                  animate={{ 
                    height: (isExpanded || isPinned) ? 'auto' : 0,
                    opacity: (isExpanded || isPinned) ? 1 : 0,
                    marginBottom: (isExpanded || isPinned) ? 24 : 0,
                    pointerEvents: (isExpanded || isPinned) ? 'auto' : 'none'
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="px-2 overflow-hidden"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search workspace..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-display"
                    />
                  </div>
                </motion.div>

                <div className="flex-1 flex flex-col min-h-0">
                  <div className={cn(
                    "px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/40 mb-2 transition-opacity flex items-center justify-between font-mono",
                    (isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'
                  )}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3" />
                      Library
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pr-1">
                    {renderFolders(libraryFolders)}
                  </div>
                </div>

                <div className="h-px bg-white/5 my-4 mx-3 shrink-0" />

                <div className="flex-1 flex flex-col min-h-0">
                  <div className={cn(
                    "px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/40 mb-2 transition-opacity flex items-center justify-between font-mono",
                    (isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'
                  )}>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      Prompts
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pr-1">
                    {renderFolders(promptFolders)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="p-3 space-y-2 shrink-0 bg-transparent">
          {bottomItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={activeScreen === item.id} 
              onClick={() => setActiveScreen(item.id)} 
              isExpanded={isExpanded} 
              isPinned={isPinned} 
              isMobileOpen={isMobileOpen}
            />
          ))}
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="lg:hidden absolute inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>
    </>
  )
}

function FolderItem({ 
  folder, 
  isActive, 
  isExpandedInRail, 
  onToggle, 
  onClick, 
  isExpanded, 
  isPinned, 
  isMobileOpen, 
  items = []
}: { 
  folder: FolderData, 
  isActive: boolean, 
  isExpandedInRail: boolean, 
  onToggle: () => void, 
  onClick: () => void, 
  isExpanded: boolean, 
  isPinned: boolean, 
  isMobileOpen: boolean, 
  items: Item[]
}) {
  const Icon = ICON_LIBRARY[folder.iconIndex] || Folder;
  const [isHovered, setIsHovered] = useState(false);

  const SOURCE_THEMES: Record<string, { color: string, icon: any }> = {
    chatgpt: { color: 'text-emerald-500', icon: Brain },
    claude: { color: 'text-orange-400', icon: Bot },
    gemini: { color: 'text-blue-400', icon: Sparkles },
    perplexity: { color: 'text-cyan-400', icon: Compass },
    other: { color: 'text-gray-400', icon: MessageSquare }
  };

  return (
    <div 
      className="relative group/folder"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("flex items-center transition-all duration-300", isExpanded || isPinned || isMobileOpen ? 'px-1 gap-1' : 'px-0 justify-center gap-0')}>
        <button
          onClick={onToggle}
          className={cn(
            "p-1 rounded-lg hover:bg-white/5 transition-colors overflow-hidden",
            (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 max-w-[40px]' : 'opacity-0 max-w-0'
          )}
        >
          <ChevronRight className={cn("w-3 h-3 text-white/30 transition-transform", isExpandedInRail ? 'rotate-90' : '')} />
        </button>
        <button
          onClick={onClick}
          className={cn(
            "flex items-center rounded-xl transition-all relative",
            isActive ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white border border-transparent',
            isExpanded || isPinned || isMobileOpen ? 'flex-1 p-2 justify-start' : 'w-12 h-12 justify-center mx-auto'
          )}
        >
          <Icon className="w-5 h-5 shrink-0" />
          
          <AnimatePresence>
            {(isHovered && !isExpanded && !isPinned && !isMobileOpen) && (
              <motion.div
                initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                className="absolute left-full ml-4 px-3 py-1.5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap z-50 pointer-events-none shadow-xl font-display"
              >
                {folder.name}
              </motion.div>
            )}
          </AnimatePresence>

          <span className={cn(
            "text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
            (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-3 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'
          )}>
            {folder.name}
          </span>
        </button>
      </div>

      {isExpandedInRail && (isExpanded || isPinned || isMobileOpen) && items.length > 0 && (
        <div className="ml-8 mt-1 space-y-1">
          {items.map((item: any) => {
            const theme = item.source ? SOURCE_THEMES[item.source] || SOURCE_THEMES.other : null;
            const ItemIcon = theme ? theme.icon : (item.type === 'chat' ? MessageSquare : Zap);
            
            return (
              <div
                key={item.id}
                className="w-full group/item flex items-center gap-2 p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all text-left relative cursor-pointer"
              >
                <ItemIcon className={cn("w-3 h-3 shrink-0", theme?.color || '')} />
                <span className="text-[11px] truncate flex-1 font-display">{item.title}</span>
                {item.url && (
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-40 transition-opacity shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavItem({ item, isActive, onClick, isExpanded, isPinned, isMobileOpen }: any) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center rounded-xl transition-all duration-200",
        isActive ? 'bg-white/10 text-white shadow-lg shadow-white/5 border border-white/10' : 'text-white/50 lg:hover:bg-white/5 hover:text-white border border-transparent',
        isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'
      )}
    >
      <Icon className="w-6 h-6 shrink-0" />
      <span className={cn(
        "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden font-display",
        (isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'
      )}>
        {item.label}
      </span>
    </button>
  );
}
