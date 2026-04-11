'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, BookOpen, Zap, BarChart2, Users, Settings, Fingerprint, Puzzle, Archive, Network,
  MessageSquare, Cpu, Sparkles, Brain, History, Folder, ChevronRight, ChevronLeft, Hash, Layers,
  Bot, Eye, Compass, Swords, Telescope, Cloud, Workflow, Activity, Search, Pin, Plus,
  FileText, Image, Music, Video, Globe, Terminal, Database, Shield, Lock, Unlock,
  Bell, Mail, Phone, Camera, Map, Calendar, Clock, Star, Heart, Share2,
  Download, Upload, Trash2, Edit3, Check, X, Filter, List, Grid, Maximize2,
  Minimize2, ExternalLink, Link2, Paperclip, Scissors, Copy, Clipboard, Save,
  HardDrive, Monitor, Smartphone, Tablet, Watch, Headphones, Speaker, Mic,
  Volume2, Sun, Moon, Wind, Droplets, Flame, ZapOff, Anchor, Target, Flag
} from 'lucide-react';

import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '../store/useAppStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePromptStore } from '../store/usePromptStore';

import { THEMES, MODELS, ICON_LIBRARY } from '@brainbox/types';
import { NeuralField } from '@brainbox/ui';

import type { ThemeName, Folder as FolderData, Item } from '@brainbox/types';

interface SidebarProps {
  isMobileOpen?: boolean | undefined;
  onCloseMobile?: (() => void) | undefined;
  onDragStart?: ((event: React.DragEvent, nodeType: string, data: any) => void) | undefined;
}

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

export function Sidebar({ 
  isMobileOpen = false,
  onCloseMobile,
  onDragStart
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // App Store
  const { 
    activeScreen, 
    activeTheme: theme, 
    isSidebarExpanded: isExpanded, 
    toggleSidebar, 
    isPinned, 
    setPinned 
  } = useAppStore();
  
  const setIsExpanded = (val: boolean) => toggleSidebar(val);
  const setIsPinned = (val: boolean) => setPinned(val);
  
  // TODO: Implement activeModelId in app store if needed
  const activeModelId = 'chatgpt';
  const onModelSelect = (id: string) => {}; 
  
  // Library Store
  const {
    folders: libraryFolders,
    items: libraryItems,
    activeFolder: activeLibraryFolder,
    setActiveFolder: setLibraryActiveFolder
  } = useLibraryStore();
  
  // Prompt Store
  const {
    folders: promptFolders,
    items: promptItems,
    activeFolder: activePromptFolder,
    setActiveFolder: setPromptActiveFolder
  } = usePromptStore();

  const activeFolder = activeScreen === 'library' ? activeLibraryFolder : activePromptFolder;
  const setActiveFolder = activeScreen === 'library' ? setLibraryActiveFolder : setPromptActiveFolder;

  const items = activeScreen === 'library' ? libraryItems : promptItems;
  const setLibraryFolders = (folders: any[]) => useLibraryStore.getState().setFolders(folders);
  const setPromptFolders = (folders: any[]) => usePromptStore.getState().setFolders(folders);
  const setItems = (items: any[]) => {
    if (activeScreen === 'library') useLibraryStore.getState().setItems(items);
    else usePromptStore.getState().setItems(items);
  };
  const setActiveScreen = (screen: string) => {
    useAppStore.getState().setActiveScreen(screen as any);
    router.push(`/${screen}`);
  };
  // Avoid rewriting component state overrides
  const [slideDirection, setSlideDirection] = useState(1);
  const [switchMode, setSwitchMode] = useState<'global' | 'folders' | 'feathers' | 'pulse' | 'workspace'>('global');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  
  // Form States
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderType, setNewFolderType] = useState<'library' | 'prompt'>('library');
  const [newFolderIconIndex, setNewFolderIconIndex] = useState(0);
  const [newChatData, setNewChatData] = useState({
    title: '',
    url: '',
    source: 'chatgpt',
    description: ''
  });

  useEffect(() => {
    const handleMoveItem = (e: any) => {
      const { itemId, folderId } = e.detail;
      if (activeScreen === 'library') {
        useLibraryStore.getState().updateItem(itemId, { folderId });
      } else {
        usePromptStore.getState().updateItem(itemId, { folderId });
      }
    };

    const handleMoveFolder = (e: any) => {
      const { folderId, parentId } = e.detail;
      if (activeScreen === 'library') {
        useLibraryStore.getState().updateFolder(folderId, { parentId });
      } else {
        usePromptStore.getState().updateFolder(folderId, { parentId });
      }
    };

    window.addEventListener('moveItemToFolder', handleMoveItem);
    window.addEventListener('moveFolderToFolder', handleMoveFolder);
    return () => {
      window.removeEventListener('moveItemToFolder', handleMoveItem);
      window.removeEventListener('moveFolderToFolder', handleMoveFolder);
    };
  }, [activeScreen, setLibraryFolders, setPromptFolders, setItems]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolders = (folders: FolderData[], parentId: string | null = null) => {
    const filteredFolders = folders.filter(f => {
      if (f.parentId !== parentId) return false;
      if (!searchQuery) return true;
      
      // Check if folder name matches
      const nameMatch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (nameMatch) return true;

      // Check if any items in this folder match
      const itemsMatch = items.some(i => i.folderId === f.id && i.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (itemsMatch) return true;

      // Check if any children match (recursive check)
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
      return null; // Return null so the caller can handle "no results"
    }

    return filteredFolders.map(folder => (
      <React.Fragment key={folder.id}>
        <FolderItem 
          folder={folder}
          isActive={activeFolder === folder.id}
          isExpandedInRail={expandedFolders.has(folder.id) || !!searchQuery}
          onToggle={() => toggleFolder(folder.id)}
          onClick={() => setActiveFolder?.(folder.id)}
          isExpanded={isExpanded}
          isPinned={isPinned}
          isMobileOpen={isMobileOpen}
          items={items.filter(i => i.folderId === folder.id && (!searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase())))}
          onDragStart={onDragStart}
        />
        {(expandedFolders.has(folder.id) || !!searchQuery) && (isExpanded || isPinned || isMobileOpen) && (
          <div className="ml-3 border-l border-white/5 pl-1">
            {renderFolders(folders, folder.id)}
          </div>
        )}
      </React.Fragment>
    ));
  };
  
  // Auto-switch modes based on screen - Enabled for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    if (activeScreen === 'ainexus') {
      setSlideDirection(switchMode === 'global' ? 1 : -1);
      setSwitchMode('feathers');
    } else if (activeScreen === 'library' || activeScreen === 'prompts') {
      setSlideDirection(switchMode === 'global' ? 1 : -1);
      setSwitchMode('folders');
    } else {
      setSlideDirection(switchMode !== 'global' ? -1 : 1);
      setSwitchMode('global');
    }
  }, [activeScreen, isMobileOpen]);

  const chats = [
    { id: 'c1', title: 'Brainstorming Session', description: 'Ideas for the new marketing campaign', type: 'chat' },
    { id: 'c2', title: 'Code Review', description: 'Reviewing the latest PR for the backend', type: 'chat' },
    { id: 'c3', title: 'Project Planning', description: 'Q3 roadmap and milestones', type: 'chat' },
  ];

  const prompts = [
    { id: 'p1', title: 'Summarize Text', description: 'Extract key points from a long article', type: 'prompt' },
    { id: 'p2', title: 'Generate Code', description: 'Create a React component from a description', type: 'prompt' },
    { id: 'p3', title: 'Write Email', description: 'Draft a professional email to a client', type: 'prompt' },
  ];

  const globalItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'library', icon: BookOpen, label: 'Library' },
    { id: 'prompts', icon: Zap, label: 'Prompts' },
    { id: 'ainexus', icon: MessageSquare, label: 'AI Nexus' },
    { id: 'workspace', icon: Workflow, label: 'Workspace' },
    { id: 'analytics', icon: Brain, label: 'Mind Graph' },
    { id: 'archive', icon: History, label: 'Archive' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'profile', icon: Fingerprint, label: 'Identity' },
    { id: 'extension', icon: Puzzle, label: 'Extension' },
  ];

  const feathers = [
    { id: 'chatgpt', icon: Brain, label: 'ChatGPT', color: 'text-emerald-500' },
    { id: 'gemini', icon: Sparkles, label: 'Gemini', color: 'text-blue-400' },
    { id: 'claude', icon: Bot, label: 'Claude', color: 'text-orange-400' },
    { id: 'grok', icon: Eye, label: 'Grok', color: 'text-gray-200' },
    { id: 'perplexity', icon: Compass, label: 'Perplexity', color: 'text-cyan-400' },
    { id: 'lmarena', icon: Swords, label: 'LM Arena', color: 'text-amber-400' },
    { id: 'deepseek', icon: Telescope, label: 'DeepSeek', color: 'text-blue-600' },
    { id: 'qwen', icon: Cloud, label: 'Qwen', color: 'text-purple-500' },
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
        className={`absolute inset-y-0 left-0 z-[100] lg:z-50 flex flex-col glass-panel border-r border-white/10 transition-all duration-300 overflow-hidden
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} 
          ${isExpanded || isPinned || isMobileOpen ? 'lg:w-64 shadow-2xl shadow-black/50' : 'lg:w-20 shadow-none'}`}
        initial={false}
      >
        {/* Subtle Sidebar Neural Background */}
        <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
          <NeuralField 
            theme={theme} 
            mode="wander" 
            particleCount={20} 
            speedMultiplier={0.5}
            monochrome
          />
        </div>

        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4 z-[110]">
          <button 
            onClick={onCloseMobile}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>
      {/* Switch Toggle Area - Hidden on Mobile */}
      <div className={`lg:flex hidden p-4 border-b border-white/10 items-center h-20 overflow-hidden ${isExpanded || isPinned || isMobileOpen ? 'px-4 justify-start' : 'justify-center'}`}>
        <div className={`flex items-center min-w-0 ${isExpanded || isPinned || isMobileOpen ? 'gap-3' : 'gap-0'}`}>
          <div 
            onClick={() => {
              const nextPinned = !isPinned;
              setIsPinned(nextPinned);
              setIsExpanded(nextPinned);
            }}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
              isPinned 
                ? 'bg-white/20 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                : 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-white/10 hover:bg-white/10'
            }`}
          >
            <Brain className={`w-6 h-6 text-white transition-transform ${isPinned ? 'scale-110' : 'scale-100'}`} />
          </div>
          
          <div className={`flex flex-col transition-all duration-300 overflow-hidden ${isExpanded || isPinned || isMobileOpen ? 'opacity-100 w-40 ml-3' : 'opacity-0 w-0 ml-0'}`}>
            <div className="flex items-center justify-between w-full">
              <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">BrainBox</span>
              {isPinned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-red-500"
                >
                  <Pin className="w-3.5 h-3.5 fill-current" />
                </motion.div>
              )}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">Neural OS</span>
          </div>
        </div>
      </div>

      {/* Content Area with Slide & Blur transition */}
      <motion.div 
        className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide cursor-grab active:cursor-grabbing"
        drag={['dashboard', 'analytics', 'archive', 'settings', 'profile', 'extension'].includes(activeScreen) ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, info) => {
          if (['dashboard', 'analytics', 'archive', 'settings', 'profile', 'extension'].includes(activeScreen)) return;
          const threshold = 40;
          if (info.offset.x < -threshold) {
            // Sliding Left
            if (switchMode === 'global') {
              if (activeScreen === 'ainexus') {
                setSlideDirection(1);
                setSwitchMode('feathers');
              } else if (activeScreen === 'workspace') {
                setSlideDirection(1);
                setSwitchMode('workspace');
              } else {
                setSlideDirection(1);
                setSwitchMode('folders');
              }
            } else if (switchMode === 'feathers') {
              setSlideDirection(1);
              setSwitchMode('pulse');
            }
          } else if (info.offset.x > threshold) {
            // Sliding Right
            if (switchMode === 'folders' || switchMode === 'workspace') {
              setSlideDirection(-1);
              setSwitchMode('global');
            } else if (switchMode === 'pulse') {
              setSlideDirection(-1);
              setSwitchMode('feathers');
            } else if (switchMode === 'feathers') {
              setSlideDirection(-1);
              setSwitchMode('global');
            }
          }
        }}
      >
        <AnimatePresence mode="wait" custom={slideDirection}>
          
          {/* GLOBAL NAVIGATION */}
          {switchMode === 'global' && (
            <motion.div
              key="global"
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="py-6 flex flex-col gap-2 px-3 h-full"
            >
              <div className="flex-1 space-y-2">
                {globalItems.map((item) => (
                  <NavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activeScreen === item.id} 
                    onClick={() => {
                      setActiveScreen(item.id);
                      if (item.id === 'library' || item.id === 'prompts') {
                        setSlideDirection(1); 
                        setSwitchMode('folders'); 
                        setActiveFolder?.(null);
                      } else if (item.id === 'ainexus') {
                        setSlideDirection(1); 
                        setSwitchMode('feathers'); 
                        setActiveFolder?.(null);
                      } else if (item.id === 'workspace') {
                        setSlideDirection(1); 
                        setSwitchMode('workspace');
                      }
                    }} 
                    isExpanded={isExpanded} 
                    isPinned={isPinned}
                    isMobileOpen={isMobileOpen}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* FOLDER RAIL (Independent Universes) */}
          {switchMode === 'folders' && (
            <motion.div
              key="folders"
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="py-6 flex flex-col gap-1 px-3 h-full"
            >
              <button 
                onClick={() => { setSlideDirection(-1); setSwitchMode('global'); }}
                className={`flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
              >
                <ChevronLeft className="w-6 h-6 shrink-0" />
                <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
                  Back to Menu
                </span>
              </button>

              <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${activeScreen === 'library' ? 'text-blue-400/40' : 'text-amber-400/40'} mb-4 transition-opacity flex items-center justify-between ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-2">
                  {activeScreen === 'library' ? <BookOpen className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                  {activeScreen === 'library' ? 'Library' : 'Prompts'}
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                      setNewFolderType(activeScreen === 'library' ? 'library' : 'prompt');
                      setIsNewFolderModalOpen(true);
                    }}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors group relative"
                    title="New Folder"
                  >
                    <Folder className="w-3 h-3" />
                  </button>
                  {activeScreen === 'library' && (
                    <button 
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors group relative"
                      title="New Chat"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                <div className="space-y-1">
                  <button 
                    onClick={() => setActiveFolder?.(null)}
                    className={`flex items-center transition-all relative group rounded-xl ${!activeFolder ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white'} ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 relative overflow-hidden ${isExpanded || isPinned || isMobileOpen ? 'mr-3' : 'mr-0'} ${
                      !activeFolder 
                        ? (activeScreen === 'library' 
                            ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] text-white' 
                            : 'bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 shadow-[0_0_20px_rgba(251,191,36,0.5)] text-white') 
                        : 'bg-white/5 text-white/20 group-hover:bg-white/10 group-hover:text-white/40'
                    }`}>
                      {/* Animated Glow */}
                      {!activeFolder && (
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 bg-white/20 blur-md pointer-events-none"
                        />
                      )}
                      {activeScreen === 'library' ? <BookOpen className="w-4 h-4 relative z-10" /> : <Zap className="w-4 h-4 relative z-10" />}
                    </div>
                    <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
                      Main {activeScreen === 'library' ? 'Library' : 'Prompts'}
                    </span>
                  </button>
                  
                  {/* Root Items */}
                  {!activeFolder && (isExpanded || isPinned || isMobileOpen) && (
                    <div className="ml-8 mt-1 space-y-1 max-h-[105px] overflow-y-auto scrollbar-hide">
                      {(() => {
                        const filtered = items.filter(i => (i.folderId === null || i.folderId === 'root' || !i.folderId) && i.type === (activeScreen === 'library' ? 'chat' : 'prompt') && (!searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase())));
                        return filtered.map(item => (
                          <button
                            key={item.id}
                            draggable
                            onDragStart={(e) => onDragStart?.(e, 'glassNode', item)}
                            className="w-full group/item flex items-center gap-2 p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all text-left relative"
                          >
                            {activeScreen === 'library' ? <MessageSquare className="w-3 h-3 shrink-0" /> : <Zap className="w-3 h-3 shrink-0" />}
                            <span className="text-[11px] truncate flex-1">{item.title}</span>
                          </button>
                        ));
                      })()}
                    </div>
                  )}
                </div>
                {renderFolders(activeScreen === 'library' ? libraryFolders : promptFolders)}
              </div>
            </motion.div>
          )}

          {/* THE FEATHERS (Models) */}
          {switchMode === 'feathers' && (
            <motion.div
              key="feathers"
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="py-6 flex flex-col gap-2 px-3 h-full"
            >
              <button 
                onClick={() => { setSlideDirection(-1); setSwitchMode('global'); }}
                className={`flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
              >
                <ChevronLeft className="w-6 h-6 shrink-0" />
                <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
                  Back to Menu
                </span>
              </button>

              <button 
                onClick={() => { setSlideDirection(1); setSwitchMode('pulse'); }}
                className={`flex items-center rounded-xl transition-all text-white/50 hover:bg-white/5 hover:text-white mb-4 ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
              >
                <History className="w-6 h-6 shrink-0" />
                <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
                  Pulse (History)
                </span>
                <ChevronRight className={`w-4 h-4 ml-auto ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'}`} />
              </button>

              <div className={`px-3 py-2 text-xs font-mono text-white/40 uppercase tracking-widest transition-opacity whitespace-nowrap ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'}`}>Models</div>

              {feathers.map((feather) => {
                const isActive = feather.id === activeModelId;
                return (
                  <button 
                    key={feather.id} 
                    onClick={() => {
                      if (activeScreen !== 'ainexus') {
                        setActiveScreen('ainexus');
                      }
                      onModelSelect?.(feather.id);
                    }}
                    className={`flex items-center border transition-all relative group rounded-xl ${isActive ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10'} ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
                  >
                    <feather.icon className={`w-6 h-6 shrink-0 ${feather.color} transition-transform group-hover:scale-110`} />
                    <div className={`flex items-center transition-all duration-300 overflow-hidden ${isExpanded || isPinned || isMobileOpen ? 'opacity-100 ml-4 max-w-[200px] gap-2' : 'opacity-0 ml-0 max-w-0 gap-0'}`}>
                      <div className={`w-1 h-1 rounded-full ${feather.color} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                      <span className={`font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-white/70'}`}>
                        {feather.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* PULSE (History) */}
          {switchMode === 'pulse' && (
            <motion.div
              key="pulse"
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="py-6 flex flex-col gap-2 px-3 h-full"
            >
              <button 
                onClick={() => { setSlideDirection(-1); setSwitchMode('feathers'); }}
                className={`flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
              >
                <ChevronLeft className="w-6 h-6 shrink-0" />
                <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
                  Back to Models
                </span>
              </button>

              <div className={`px-3 py-2 text-xs font-mono text-white/40 uppercase tracking-widest transition-opacity whitespace-nowrap ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'}`}>Recent Threads</div>
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} className={`flex items-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}>
                  <MessageSquare className="w-6 h-6 shrink-0" />
                  <div className={`text-left transition-all duration-300 overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
                    <div className="text-sm font-medium text-white truncate whitespace-nowrap">Chat Session {i}</div>
                    <div className="text-xs text-white/40 truncate whitespace-nowrap">2 hours ago</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* WORKSPACE RAIL (50/50 Integration) */}
          {switchMode === 'workspace' && (
            <motion.div
              key="workspace"
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="py-6 flex flex-col gap-0 px-3 h-full"
            >
              <button 
                onClick={() => { setSlideDirection(-1); setSwitchMode('global'); }}
                className={`flex items-center transition-all text-white/50 hover:bg-white/5 hover:text-white mb-2 rounded-xl ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
              >
                <ChevronLeft className="w-6 h-6 shrink-0" />
                <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
                  Back to Menu
                </span>
              </button>

              {/* SEARCH BAR */}
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </motion.div>

              {/* TOP: Library Folders */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/40 mb-2 transition-opacity flex items-center justify-between ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Library
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setNewFolderType('library');
                        setIsNewFolderModalOpen(true);
                      }}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors group relative"
                      title="New Folder"
                    >
                      <Folder className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors group relative"
                      title="New Chat"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pr-1">
                  {/* Root Library Items */}
                  {(isExpanded || isPinned || isMobileOpen) && (
                    <div className="space-y-1 mb-1 max-h-[105px] overflow-y-auto scrollbar-hide">
                      {items.filter(i => (i.folderId === null || i.folderId === 'root' || !i.folderId) && i.type === 'chat' && (!searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(item => (
                        <button
                          key={item.id}
                          draggable
                          onDragStart={(e) => onDragStart?.(e, 'glassNode', item)}
                          onClick={() => setActiveScreen('library')}
                          className="w-full group/item flex items-center gap-2 p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all text-left relative"
                        >
                          <MessageSquare className="w-3 h-3 shrink-0" />
                          <span className="text-[11px] truncate flex-1">{item.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {(() => {
                    const content = renderFolders(libraryFolders);
                    if (searchQuery && !content) {
                      return <div className="px-3 py-4 text-xs text-white/20 italic">No results in Library</div>;
                    }
                    return content;
                  })()}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-white/5 my-4 mx-3 shrink-0" />

              {/* BOTTOM: Prompts Folders */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/40 mb-2 transition-opacity flex items-center justify-between ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    Prompts
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setNewFolderType('prompt');
                        setIsNewFolderModalOpen(true);
                      }}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors group relative"
                      title="New Folder"
                    >
                      <Folder className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pr-1">
                  {/* Root Prompt Items */}
                  {(isExpanded || isPinned || isMobileOpen) && (
                    <div className="space-y-1 mb-1 max-h-[105px] overflow-y-auto scrollbar-hide">
                      {items.filter(i => (i.folderId === null || i.folderId === 'root' || !i.folderId) && i.type === 'prompt' && (!searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(item => (
                        <button
                          key={item.id}
                          draggable
                          onDragStart={(e) => onDragStart?.(e, 'glassNode', item)}
                          onClick={() => setActiveScreen('prompts')}
                          className="w-full group/item flex items-center gap-2 p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all text-left relative"
                        >
                          <Zap className="w-3 h-3 shrink-0" />
                          <span className="text-[11px] truncate flex-1">{item.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {(() => {
                    const content = renderFolders(promptFolders);
                    if (searchQuery && !content) {
                      return <div className="px-3 py-4 text-xs text-white/20 italic">No results in Prompts</div>;
                    }
                    return content;
                  })()}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* MODALS */}
        <AnimatePresence>
          {isNewFolderModalOpen && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Create New Folder</h3>
                  <button onClick={() => setIsNewFolderModalOpen(false)} className="text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Folder Name</label>
                    <input 
                      type="text" 
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="e.g. Project Alpha"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setIsNewFolderModalOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (newFolderName) {
                          const newFolder: FolderData = {
                            id: `${newFolderType === 'library' ? 'lib' : 'prm'}-${Date.now()}`,
                            name: newFolderName,
                            iconIndex: 0,
                            parentId: null,
                            type: newFolderType,
                            level: 0
                          };
                          if (newFolderType === 'library') {
                            setLibraryFolders([...libraryFolders, newFolder]);
                          } else {
                            setPromptFolders([...promptFolders, newFolder]);
                          }
                          setNewFolderName('');
                          setIsNewFolderModalOpen(false);
                        }
                      }}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                    >
                      Create Folder
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {isNewChatModalOpen && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Save New Chat</h3>
                  <button onClick={() => setIsNewChatModalOpen(false)} className="text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Title</label>
                    <input 
                      type="text" 
                      value={newChatData.title}
                      onChange={(e) => setNewChatData({...newChatData, title: e.target.value})}
                      placeholder="Enter chat title..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Chat URL</label>
                    <input 
                      type="text" 
                      value={newChatData.url}
                      onChange={(e) => setNewChatData({...newChatData, url: e.target.value})}
                      placeholder="https://chat.openai.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Source Platform</label>
                    <div className="relative">
                      <select 
                        value={newChatData.source}
                        onChange={(e) => setNewChatData({...newChatData, source: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="chatgpt">ChatGPT</option>
                        <option value="claude">Claude</option>
                        <option value="gemini">Gemini</option>
                        <option value="perplexity">Perplexity</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {(() => {
                          const SOURCE_THEMES: Record<string, { color: string, icon: any }> = {
                            chatgpt: { color: 'text-emerald-500', icon: Brain },
                            claude: { color: 'text-orange-400', icon: Bot },
                            gemini: { color: 'text-blue-400', icon: Sparkles },
                            perplexity: { color: 'text-cyan-400', icon: Compass },
                            other: { color: 'text-gray-400', icon: MessageSquare }
                          };
                      const theme = (SOURCE_THEMES[newChatData.source] || SOURCE_THEMES.other)!;
                      const Icon = theme.icon;
                          return <Icon className={`w-5 h-5 ${theme.color}`} />;
                        })()}
                      </div>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none rotate-90" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                      value={newChatData.description}
                      onChange={(e) => setNewChatData({...newChatData, description: e.target.value})}
                      placeholder="Summarize the chat in 2-3 sentences..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setIsNewChatModalOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (newChatData.title) {
                          const parentFolder = [...libraryFolders, ...promptFolders].find(f => f.id === activeFolder);
                          const newItem: Item = {
                            id: `item-${Date.now()}`,
                            title: newChatData.title,
                            description: newChatData.description,
                            type: 'chat',
                            folderId: activeFolder || null,
                            url: newChatData.url,
                            source: newChatData.source
                          };
                          setItems([...items, newItem]);
                          setNewChatData({ title: '', url: '', source: 'chatgpt', description: '' });
                          setIsNewChatModalOpen(false);
                        }
                      }}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                    >
                      Save Chat
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom Navigation - Always Visible */}
      <div className={`p-3 space-y-2 shrink-0 bg-transparent`}>
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

    {/* Mobile Overlay */}
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

    {/* MODALS */}
    <AnimatePresence>
      {isNewFolderModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="text-lg font-semibold text-white">Create New Folder</h3>
              <button onClick={() => setIsNewFolderModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Project Alpha"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Select Icon</label>
                <div className="space-y-6">
                  {ICON_CATEGORIES.map((category) => (
                    <div key={category.name}>
                      <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">{category.name}</h4>
                      <div className="grid grid-cols-8 gap-2">
                        {category.icons.map((idx) => {
                          const Icon = ICON_LIBRARY[idx] as React.ElementType;
                          return (
                            <button
                              key={idx}
                              onClick={() => setNewFolderIconIndex(idx)}
                              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                                newFolderIconIndex === idx 
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' 
                                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-white/5 shrink-0">
              <button 
                onClick={() => setIsNewFolderModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newFolderName) {
                    const parentFolder = [...libraryFolders, ...promptFolders].find(f => f.id === activeFolder);
                    const newFolder: FolderData = {
                      id: `${newFolderType === 'library' ? 'lib' : 'prm'}-${Date.now()}`,
                      name: newFolderName,
                      iconIndex: newFolderIconIndex,
                      parentId: activeFolder || null,
                      type: newFolderType,
                      level: parentFolder ? parentFolder.level + 1 : 0
                    };
                    if (newFolderType === 'library') {
                      setLibraryFolders([...libraryFolders, newFolder]);
                    } else {
                      setPromptFolders([...promptFolders, newFolder]);
                    }
                    setNewFolderName('');
                    setNewFolderIconIndex(0);
                    setIsNewFolderModalOpen(false);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                Create Folder
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isNewChatModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Save New Chat</h3>
              <button onClick={() => setIsNewChatModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Title</label>
                <input 
                  type="text" 
                  value={newChatData.title}
                  onChange={(e) => setNewChatData({...newChatData, title: e.target.value})}
                  placeholder="Enter chat title..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Chat URL</label>
                <input 
                  type="text" 
                  value={newChatData.url}
                  onChange={(e) => setNewChatData({...newChatData, url: e.target.value})}
                  placeholder="https://chat.openai.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Source Platform</label>
                <div className="relative">
                  <select 
                    value={newChatData.source}
                    onChange={(e) => setNewChatData({...newChatData, source: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="chatgpt">ChatGPT</option>
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini</option>
                    <option value="perplexity">Perplexity</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {(() => {
                      const SOURCE_THEMES: Record<string, { color: string, icon: any }> = {
                        chatgpt: { color: 'text-emerald-500', icon: Brain },
                        claude: { color: 'text-orange-400', icon: Bot },
                        gemini: { color: 'text-blue-400', icon: Sparkles },
                        perplexity: { color: 'text-cyan-400', icon: Compass },
                        other: { color: 'text-gray-400', icon: MessageSquare }
                      };
                      const theme = (SOURCE_THEMES[newChatData.source] || SOURCE_THEMES.other)!;
                      const Icon = theme.icon;
                      return <Icon className={`w-5 h-5 ${theme.color}`} />;
                    })()}
                  </div>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none rotate-90" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={newChatData.description}
                  onChange={(e) => setNewChatData({...newChatData, description: e.target.value})}
                  placeholder="Summarize the chat in 2-3 sentences..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newChatData.title) {
                      const newItem: Item = {
                        id: `item-${Date.now()}`,
                        title: newChatData.title,
                        description: newChatData.description,
                        type: 'chat',
                        folderId: 'lib-1', // Default to first folder for now
                        url: newChatData.url,
                        source: newChatData.source
                      };
                      setItems([...items, newItem]);
                      setNewChatData({ title: '', url: '', source: 'chatgpt', description: '' });
                      setIsNewChatModalOpen(false);
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                >
                  Save Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
);
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
  items = [], 
  onDragStart 
}: { 
  folder: FolderData, 
  isActive: boolean, 
  isExpandedInRail: boolean, 
  onToggle: () => void, 
  onClick: () => void, 
  isExpanded: boolean, 
  isPinned: boolean, 
  isMobileOpen?: boolean | undefined, 
  items: Item[], 
  onDragStart?: ((event: React.DragEvent, nodeType: string, data: any) => void) | undefined 
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
      <div className={`flex items-center transition-all duration-300 ${isExpanded || isPinned || isMobileOpen ? 'px-1 gap-1' : 'px-0 justify-center gap-0'}`}>
        <button
          onClick={onToggle}
          className={`p-1 rounded-lg hover:bg-white/5 transition-colors overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 max-w-[40px]' : 'opacity-0 max-w-0'}`}
        >
          <ChevronRight className={`w-3 h-3 text-white/30 transition-transform ${isExpandedInRail ? 'rotate-90' : ''}`} />
        </button>
        <button
          onClick={onClick}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({ ...folder, type: 'folder' }));
            e.dataTransfer.effectAllowed = 'move';
          }}
          className={`flex items-center rounded-xl transition-all relative ${
            isActive ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white'
          } ${isExpanded || isPinned || isMobileOpen ? 'flex-1 p-2 justify-start' : 'w-12 h-12 justify-center mx-auto'}`}
        >
          <Icon className="w-5 h-5 shrink-0" />
          
          <AnimatePresence>
            {(isHovered && !isExpanded && !isPinned && !isMobileOpen) && (
              <motion.div
                initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                className="absolute left-full ml-4 px-3 py-1.5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap z-50 pointer-events-none shadow-xl"
              >
                {folder.name}
              </motion.div>
            )}
          </AnimatePresence>

          <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-3 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
            {folder.name}
          </span>
        </button>
      </div>

      {/* Items inside folder */}
      {isExpandedInRail && (isExpanded || isPinned || isMobileOpen) && items.length > 0 && (
        <div className="ml-8 mt-1 space-y-1 max-h-[105px] overflow-y-auto scrollbar-hide">
          {items.map((item: any) => {
            const theme = item.source ? SOURCE_THEMES[item.source] || SOURCE_THEMES.other : null;
            const ItemIcon = theme ? theme.icon : (item.type === 'chat' ? MessageSquare : Zap);
            
            return (
              <button
                key={item.id}
                draggable
                onDragStart={(e) => onDragStart?.(e, 'glassNode', item)}
                className="w-full group/item flex items-center gap-2 p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all text-left relative"
              >
                <ItemIcon className={`w-3 h-3 shrink-0 ${theme?.color || ''}`} />
                <span className="text-[11px] truncate flex-1">{item.title}</span>
                {item.url && (
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-40 transition-opacity shrink-0" />
                )}
              </button>
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
      className={`relative flex items-center rounded-xl transition-all duration-200 ${
        isActive ? 'bg-white/10 text-white shadow-lg shadow-white/5 border border-white/10' : 'text-white/50 lg:hover:bg-white/5 hover:text-white'
      } ${isExpanded || isPinned || isMobileOpen ? 'w-full p-3 justify-start px-4' : 'w-12 h-12 justify-center mx-auto'}`}
    >
      <Icon className="w-6 h-6 shrink-0" />
      <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${(isExpanded || isPinned || isMobileOpen) ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}>
        {item.label}
      </span>
    </button>
  );
}
