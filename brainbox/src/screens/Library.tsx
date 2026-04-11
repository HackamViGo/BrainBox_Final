import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MessageSquare, MoreVertical, Sparkles, Activity, ChevronRight, ChevronLeft, Loader2, X, Brain, Zap, FileText, List, Target, MessageCircle, BarChart3, ShieldAlert, Eye, Lightbulb, Scale, CheckCircle2, Folder as FolderIcon, LayoutGrid, Plus, BookOpen } from 'lucide-react';
import { ThemeName, THEMES, Folder, Item } from '../types';
import { ICON_LIBRARY } from '../constants';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { generateGeminiResponse } from '../services/gemini';

interface LibraryProps {
  setTheme: (theme: ThemeName) => void;
  activeFolder?: string | null;
  setActiveFolder: (id: string | null) => void;
  libraryFolders: Folder[];
  items: Item[];
  onDragStart?: (event: React.DragEvent, nodeType: string, data: any) => void;
}

const MOCK_CHATS = [
  { id: 1, title: 'React Performance Optimization', model: 'claude' as ThemeName, tags: ['code', 'react'], date: '2h ago', messages: 14, folderId: 'lib-2-1', content: "React performance optimization involves several techniques to ensure that your application runs smoothly and efficiently. Key areas include memoization using useMemo and useCallback, optimizing re-renders with React.memo, and efficient state management. Additionally, code-splitting with React.lazy and Suspense can significantly reduce initial load times. Profiling your application using the React DevTools Profiler is essential to identify bottlenecks and measure the impact of your optimizations." },
  { id: 2, title: 'Marketing Strategy Q3', model: 'chatgpt' as ThemeName, tags: ['business', 'planning'], date: '5h ago', messages: 32, folderId: 'lib-1', content: "Our Q3 marketing strategy focuses on expanding our digital footprint through targeted social media campaigns and influencer partnerships. We aim to increase brand awareness by 25% and drive a 15% growth in organic traffic. Key initiatives include a revamped content calendar, SEO optimization for our core product pages, and a series of webinars featuring industry experts. We will also be launching a referral program to leverage our existing customer base for new acquisitions." },
  { id: 3, title: 'Creative Writing: Sci-Fi Story', model: 'gemini' as ThemeName, tags: ['creative', 'writing'], date: 'Yesterday', messages: 8, folderId: null, content: "The year was 2145, and the neon-drenched streets of Neo-Tokyo were buzzing with the hum of anti-gravity vehicles. Kael, a rogue data-runner, navigated the shadows of the lower levels, his cybernetic eyes scanning for any sign of the Enforcer drones. He carried a memory shard containing the coordinates to the last remaining seed vault on Earth—a prize that both the Mega-Corps and the Resistance would kill for. As he approached the rendezvous point, a sudden surge of static crackled in his neural link, warning him that he was no longer alone." },
  { id: 4, title: 'System Architecture Review', model: 'deepseek' as ThemeName, tags: ['architecture', 'backend'], date: '2 days ago', messages: 45, folderId: 'lib-2', content: "The current system architecture utilizes a microservices approach with a centralized API gateway. While this provides scalability, we've noticed increased latency in inter-service communication. We are considering migrating to a service mesh like Istio to improve observability and security. Our database layer consists of a primary PostgreSQL instance with several read replicas, but we may need to implement sharding as our write volume continues to grow. A thorough review of our caching strategy using Redis is also underway." },
  { id: 5, title: 'Data Analysis: User Retention', model: 'perplexity' as ThemeName, tags: ['data', 'analytics'], date: '3 days ago', messages: 12, folderId: 'lib-3', content: "Recent data analysis reveals a 10% drop in user retention over the past quarter. The churn rate is highest among users who haven't completed the onboarding process within the first 48 hours. We've identified a correlation between feature discovery and long-term engagement. Users who utilize at least three core features in their first week are 40% more likely to remain active after 30 days. We recommend simplifying the onboarding flow and implementing personalized in-app notifications to guide users toward key features." },
  { id: 6, title: 'Brainstorming App Ideas', model: 'grok' as ThemeName, tags: ['ideas', 'startup'], date: '1 week ago', messages: 56, folderId: null, content: "We're brainstorming several app ideas focused on the intersection of AI and personal productivity. One concept is a 'Neural Journal' that uses sentiment analysis to provide insights into the user's emotional well-being over time. Another idea is an AI-powered 'Meeting Synthesizer' that automatically generates action items and summaries from voice recordings. We're also exploring a 'Contextual Task Manager' that suggests tasks based on the user's current location, time of day, and upcoming calendar events. The goal is to create tools that feel like a natural extension of the user's brain." },
];

const SUMMARIZE_OPTIONS = [
  { id: 'quick', label: 'Quick Summary', icon: Zap, prompt: 'Provide a concise 2-3 sentence summary of this content.' },
  { id: 'detailed', label: 'Detailed Analysis', icon: FileText, prompt: 'Provide a comprehensive and detailed summary of this content, covering all major points.' },
  { id: 'bullets', label: 'Key Bullet Points', icon: List, prompt: 'Extract the most important points from this content and present them as a bulleted list.' },
  { id: 'takeaways', label: 'Key Takeaways', icon: Target, prompt: 'What are the 3-5 most critical takeaways from this content?' },
  { id: 'exec', label: 'Executive Summary', icon: BarChart3, prompt: 'Write a professional executive summary suitable for a high-level briefing.' },
  { id: 'narrative', label: 'Narrative Summary', icon: MessageCircle, prompt: 'Summarize this content in a narrative, storytelling format.' },
  { id: 'actions', label: 'Action Items', icon: CheckCircle2, prompt: 'Identify any explicit or implicit action items or next steps mentioned in this content.' },
];

const ANALYZE_OPTIONS = [
  { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain, prompt: 'Analyze the emotional tone and sentiment of this content. Is it positive, negative, neutral, or mixed?' },
  { id: 'topics', label: 'Topic Modeling', icon: Lightbulb, prompt: 'Identify the primary and secondary topics discussed in this content.' },
  { id: 'entities', label: 'Entity Extraction', icon: Target, prompt: 'Extract all significant entities (people, places, organizations, technologies) mentioned in this content.' },
  { id: 'intent', label: 'Intent Recognition', icon: Eye, prompt: 'What is the primary intent or purpose of the author in this content?' },
  { id: 'tone', label: 'Tone Analysis', icon: MessageCircle, prompt: 'Describe the specific tone of this content (e.g., formal, casual, urgent, persuasive).' },
  { id: 'logic', label: 'Logical Consistency', icon: Scale, prompt: 'Evaluate the logical flow and consistency of the arguments or information presented.' },
  { id: 'bias', label: 'Bias Detection', icon: ShieldAlert, prompt: 'Identify any potential biases, assumptions, or one-sided perspectives in this content.' },
];

export function Library({ setTheme, activeFolder, setActiveFolder, libraryFolders, items, onDragStart }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChatId, setExpandedChatId] = useState<number | null>(null);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentChatForAnalysis, setCurrentChatForAnalysis] = useState<any>(null);

  // Helper to get all subfolder IDs recursively
  const getAllSubfolderIds = useCallback((folderId: string): string[] => {
    const subfolders = libraryFolders.filter(f => f.parentId === folderId);
    let ids = [folderId];
    subfolders.forEach(sub => {
      ids = [...ids, ...getAllSubfolderIds(sub.id)];
    });
    return ids;
  }, [libraryFolders]);

  const filteredFolders = libraryFolders.filter(f => {
    if (searchQuery) {
      return f.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return f.parentId === (activeFolder || null);
  });

  const filteredChats = items.filter(item => {
    if (item.type !== 'chat') return false;

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by folder:
    // If searching, we show all matches
    if (searchQuery) return matchesSearch;

    // Otherwise, show items in current folder
    return item.folderId === (activeFolder || null);
  });

  const handleAction = async (chat: any, option: any) => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      setApiKeyModalOpen(true);
      return;
    }

    setCurrentChatForAnalysis(chat);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setExpandedChatId(chat.id); // Expand the card to show result

    try {
      const prompt = `${option.prompt}\n\nContent:\n${chat.content}`;
      const result = await generateGeminiResponse(prompt, apiKey);
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisResult("Error generating analysis. Please check your API key and connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeFolderData = activeFolder ? libraryFolders.find(f => f.id === activeFolder) : null;
  const ActiveIcon = activeFolderData ? ICON_LIBRARY[activeFolderData.iconIndex % ICON_LIBRARY.length] : BookOpen;

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 lg:p-12 z-10 relative overflow-y-auto">
      <ApiKeyModal 
        isOpen={apiKeyModalOpen} 
        modelId="gemini"
        modelName="Gemini"
        onClose={() => setApiKeyModalOpen(false)} 
        onSave={(key) => console.log("API Key saved")} 
      />

      {/* Header & Search */}
      <div className="max-w-5xl mx-auto w-full flex flex-col">
        <div className="flex items-center justify-between mb-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (activeFolder) {
                  const currentFolder = libraryFolders.find(f => f.id === activeFolder);
                  setActiveFolder(currentFolder?.parentId || null);
                }
              }} 
              className={`p-3 glass-panel-light rounded-xl hover:bg-white/10 transition-colors ${!activeFolder ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-4">
                <ActiveIcon className="w-8 h-8 text-white/20" />
                {activeFolderData ? activeFolderData.name : 'Library'}
              </h2>
              <p className="text-white/40">{activeFolder ? 'Browsing organized intelligence' : 'Access your collective intelligence'}</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-3xl font-mono font-light text-white/40">{filteredChats.length + filteredFolders.length}</span>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/search:text-blue-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search neural archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
            />
          </div>
          <button className="h-12 px-6 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
            <Plus className="w-4 h-4" />
            New Fragment
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-12">
          {/* Folders Grid */}
          {filteredFolders.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {filteredFolders.map((folder) => (
                <motion.button
                  key={folder.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFolder(folder.id)}
                  className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group text-center flex flex-col items-center gap-4 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] max-w-[320px]"
                >
                  {(() => {
                    const FolderIconComp = ICON_LIBRARY[folder.iconIndex % ICON_LIBRARY.length];
                    return (
                      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500 shadow-xl group-hover:shadow-blue-500/10">
                        <FolderIconComp className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
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

          {filteredChats.length > 0 ? (
            <div className="space-y-4">
              {filteredChats.map((chat) => (
                <ChatCard 
                  key={chat.id} 
                  chat={chat} 
                  setTheme={setTheme}
                  onDragStart={onDragStart}
                  onAction={(option: any) => handleAction(chat, option)}
                  onClick={() => {
                    setExpandedChatId(chat.id);
                    setAnalysisResult(null);
                    setCurrentChatForAnalysis(chat);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-white/20">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p>No fragments found in this view.</p>
            </div>
          )}
        </div>
      </div>

      {/* Liquid Expansion Overlay */}
      <AnimatePresence>
        {expandedChatId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 md:p-8 bg-black/80 backdrop-blur-xl"
            onClick={() => {
              setExpandedChatId(null);
              setAnalysisResult(null);
            }}
          >
            <motion.div
              layoutId={`chat-card-${expandedChatId}`}
              className="glass-panel w-full max-w-5xl h-full sm:h-[85vh] rounded-none sm:rounded-[2.5rem] overflow-hidden flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 sm:p-8 border-b border-white/10 flex justify-between items-start bg-white/5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0"
                      style={{ color: THEMES[currentChatForAnalysis?.model as ThemeName]?.color }}
                    >
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 truncate">{currentChatForAnalysis?.model || 'chatgpt'}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl sm:text-3xl font-bold line-clamp-2">{currentChatForAnalysis?.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(currentChatForAnalysis?.tags || []).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setExpandedChatId(null);
                    setAnalysisResult(null);
                  }} 
                  className="p-2 sm:p-3 glass-panel-light rounded-full hover:bg-white/10 transition-colors ml-4 shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/50" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:p-8 space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Original Content
                  </h4>
                  <div className="glass-panel-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 text-sm sm:text-base sm:text-lg leading-relaxed text-white/80 font-light">
                    {currentChatForAnalysis?.content || currentChatForAnalysis?.description}
                  </div>
                </div>

                {(isAnalyzing || analysisResult) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400/50 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Neural Analysis
                    </h4>
                    <div className="glass-panel-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 border border-blue-500/20 bg-blue-500/5 min-h-[200px] relative">
                      {isAnalyzing ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center">
                          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 animate-spin" />
                          <p className="text-xs sm:text-sm text-blue-400/60 animate-pulse">Consulting Gemini Neural Network...</p>
                        </div>
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          <p className="whitespace-pre-wrap text-sm sm:text-base text-white/90 leading-relaxed">
                            {analysisResult}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-4 sm:p-6 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-[10px] sm:text-xs">
                <div className="flex gap-4 sm:gap-6">
                  <span>Created: {currentChatForAnalysis?.date || 'Just now'}</span>
                  <span>Messages: {currentChatForAnalysis?.messages || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 shrink-0" />
                  <span className="text-center sm:text-left">AI generated content may be inaccurate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ChatCard = forwardRef<HTMLDivElement, any>(({ chat, setTheme, onAction, onClick, onDragStart }, ref) => {
  const model = chat.model || 'chatgpt';
  const themeColor = THEMES[model as ThemeName].color;
  const tags = chat.tags || [];
  const date = chat.date || 'Just now';
  const messages = chat.messages || 0;
  const content = chat.content || chat.description || '';
  
  const [showSummarize, setShowSummarize] = useState(false);
  const [showAnalyze, setShowAnalyze] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSummarize(false);
        setShowAnalyze(false);
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={ref}
      layout
      layoutId={`chat-card-${chat.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setTheme(model as ThemeName)}
      onClick={onClick}
      draggable
      onDragStart={(e) => {
        if (onDragStart) {
          onDragStart(e as any, 'glassNode', chat);
        } else {
          e.dataTransfer.setData('application/json', JSON.stringify(chat));
          e.dataTransfer.effectAllowed = 'move';
        }
      }}
      className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group cursor-grab relative overflow-hidden active:scale-[0.98] active:cursor-grabbing"
    >
      <div 
        className="absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: themeColor }}
      />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110 shadow-xl"
            style={{ color: themeColor }}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              {chat.title}
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }} 
              />
            </h3>
            <div className="flex items-center gap-4">
              <p className="text-white/50 text-sm line-clamp-1">{chat.description || tags.join(', ')}</p>
              <span className="text-[10px] font-mono text-white/20 shrink-0">{date}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" ref={dropdownRef}>
          <button 
            className="p-2 rounded-lg hover:bg-white/10 transition-colors" 
            onClick={e => {
              e.stopPropagation();
              setShowSummarize(!showSummarize);
              setShowAnalyze(false);
            }}
          >
            <Sparkles className="w-4 h-4 text-white/50" />
          </button>
          <button 
            className="p-2 rounded-lg hover:bg-white/10 transition-colors" 
            onClick={e => {
              e.stopPropagation();
              setShowAnalyze(!showAnalyze);
              setShowSummarize(false);
            }}
          >
            <Activity className="w-4 h-4 text-white/50" />
          </button>
          <button 
            className="p-2 rounded-lg hover:bg-white/10 transition-colors" 
            onClick={e => {
              e.stopPropagation();
              setShowMore(!showMore);
            }}
          >
            <MoreVertical className="w-4 h-4 text-white/50" />
          </button>

          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-48 glass-panel rounded-2xl overflow-hidden shadow-2xl z-30 border border-white/10"
              >
                <div className="p-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                      setShowMore(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-xs text-white/70 hover:text-white transition-all group/opt"
                  >
                    <Eye className="w-4 h-4 text-white/30 group-hover/opt:text-blue-400 transition-colors" />
                    Open Fragment
                  </button>
                  <div className="h-[1px] bg-white/5 my-1" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMore(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-left text-xs text-red-400/70 hover:text-red-400 transition-all group/opt"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-400/30 group-hover/opt:text-red-400 transition-colors" />
                    Delete Fragment
                  </button>
                </div>
              </motion.div>
            )}
            {showSummarize && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-2xl overflow-hidden shadow-2xl z-30 border border-white/10"
              >
                <div className="p-3 border-b border-white/10 bg-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Summary Types</p>
                </div>
                <div className="p-1">
                  {SUMMARIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction(opt);
                        setShowSummarize(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-xs text-white/70 hover:text-white transition-all group/opt"
                    >
                      <opt.icon className="w-4 h-4 text-white/30 group-hover/opt:text-blue-400 transition-colors" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {showAnalyze && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-2xl overflow-hidden shadow-2xl z-30 border border-white/10"
              >
                <div className="p-3 border-b border-white/10 bg-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Analysis Types</p>
                </div>
                <div className="p-1">
                  {ANALYZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction(opt);
                        setShowAnalyze(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-xs text-white/70 hover:text-white transition-all group/opt"
                    >
                      <opt.icon className="w-4 h-4 text-white/30 group-hover/opt:text-purple-400 transition-colors" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="bg-black/20 rounded-xl p-4 font-mono text-xs text-white/70 leading-relaxed line-clamp-2">
        {content}
      </div>
    </motion.div>
  );
});
