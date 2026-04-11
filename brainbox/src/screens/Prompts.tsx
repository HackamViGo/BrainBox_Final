import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Lock, Edit2, Play, GitBranch, Wand2, Download, ChevronLeft, 
  Zap, FileText, Target, Code, Maximize, UserCheck, ArrowRight, Link, 
  LayoutGrid, Trash2, GitCommit, FolderPlus, Globe, Briefcase, FlaskConical, 
  Database, PenTool, Check, Copy, X, Rocket, Star, Search, Plus, BookOpen
} from 'lucide-react';
import { ThemeName, THEMES, Folder, Item } from '../types';
import { ICON_LIBRARY } from '../constants';
import { generateGeminiResponse } from '../services/gemini';
import { ApiKeyModal } from '../components/ApiKeyModal';

interface PromptsProps {
  setTheme: (theme: ThemeName) => void;
  activeFolder?: string | null;
  setActiveFolder: (id: string | null) => void;
  promptFolders: Folder[];
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  onDragStart?: (event: React.DragEvent, nodeType: string, data: any) => void;
}

// --- MOCK DATA ---

const MOCK_SAVED_PROMPTS = [
  { id: 1, title: 'Socratic Tutor', description: 'Guides users through complex topics using questions.', folderId: 'prm-1', content: 'Act as a Socratic tutor. When I ask a question, do not give me the answer. Instead, ask me a question that will help me find the answer myself.', theme: 'chatgpt' as ThemeName },
  { id: 2, title: 'Code Architect', description: 'Designs scalable system architectures.', folderId: 'prm-2', content: 'You are a senior software architect. Design a system that handles 1M requests per second with low latency.', theme: 'deepseek' as ThemeName },
  { id: 3, title: 'Creative Muse', description: 'Generates poetic and artistic descriptions.', folderId: null, content: 'Write a poem about the intersection of technology and nature in the style of Emily Dickinson.', theme: 'qwen' as ThemeName },
  { id: 4, title: 'Business Strategist', description: 'Analyzes market trends and provides strategic advice.', folderId: 'prm-3', content: 'Analyze the current trends in the AI industry and suggest a strategy for a small startup.', theme: 'claude' as ThemeName },
  { id: 5, title: 'Logic Master', description: 'Solves complex logical puzzles.', folderId: 'prm-2', content: 'Solve the following logical puzzle step by step, explaining your reasoning at each stage.', theme: 'perplexity' as ThemeName },
];

const FRAMEWORK_CATEGORIES = [
  { id: 'persona', label: 'Persona', icon: UserCheck, color: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/50', ring: 'ring-blue-500/50' },
  { id: 'logic', label: 'Logic', icon: GitBranch, color: 'from-purple-400 to-purple-600', shadow: 'shadow-purple-500/50', ring: 'ring-purple-500/50' },
  { id: 'code', label: 'Code', icon: Code, color: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/50', ring: 'ring-emerald-500/50' },
  { id: 'content', label: 'Content', icon: PenTool, color: 'from-yellow-400 to-yellow-600', shadow: 'shadow-yellow-500/50', ring: 'ring-yellow-500/50' },
  { id: 'data', label: 'Data', icon: Database, color: 'from-cyan-400 to-cyan-600', shadow: 'shadow-cyan-500/50', ring: 'ring-cyan-500/50' },
  { id: 'business', label: 'Business', icon: Briefcase, color: 'from-amber-400 to-amber-600', shadow: 'shadow-amber-500/50', ring: 'ring-amber-500/50' },
  { id: 'experimental', label: 'Experimental', icon: FlaskConical, color: 'from-pink-400 to-pink-600', shadow: 'shadow-pink-500/50', ring: 'ring-pink-500/50' },
];

// Generate 7x7 matrix
const MATRIX_DATA = FRAMEWORK_CATEGORIES.map(cat => ({
  ...cat,
  cells: Array.from({ length: 7 }).map((_, i) => {
    const hasBranches = Math.random() > 0.6;
    return {
      id: `${cat.id}-${i}`,
      title: `${cat.label} ${i + 1}`,
      branches: hasBranches ? [
        { id: 'b1', name: 'v1.1 - Claude Optimized' },
        { id: 'b2', name: 'v1.2 - GPT-4o Concise' },
        { id: 'b3', name: 'v1.3 - Creative Variant' }
      ] : []
    };
  })
}));

const REFINE_CRYSTALS = [
  { id: 'clarity', label: 'Clarity', color: 'bg-white', shadow: 'shadow-white/50', glow: 'bg-white', desc: 'Clears ambiguities and sharpens instructions.' },
  { id: 'structure', label: 'Structure', color: 'bg-blue-500', shadow: 'shadow-blue-500/50', glow: 'bg-blue-400', desc: 'Organizes prompt into Markdown with clear boundaries.' },
  { id: 'creative', label: 'Creative', color: 'bg-purple-500', shadow: 'shadow-purple-500/50', glow: 'bg-purple-400', desc: 'Injects metaphors and out-of-the-box thinking.' },
  { id: 'technical', label: 'Technical', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', glow: 'bg-emerald-400', desc: 'Optimizes for programming and logical tasks.' },
  { id: 'efficiency', label: 'Efficiency', color: 'bg-amber-500', shadow: 'shadow-amber-500/50', glow: 'bg-amber-400', desc: 'Removes fluff, making it concise and API-cost effective.' },
  { id: 'role', label: 'Role', color: 'bg-cyan-500', shadow: 'shadow-cyan-500/50', glow: 'bg-cyan-400', desc: 'Strengthens the AI model\'s role and authority.' },
  { id: 'context', label: 'Context', color: 'bg-pink-500', shadow: 'shadow-pink-500/50', glow: 'bg-pink-400', desc: 'Adds necessary details for better AI understanding.' },
];

const MOCK_CAPTURES = [
  { id: 1, domain: 'github.com', url: 'https://github.com/reactwg/react-18/discussions/21', text: 'React 18 introduces concurrent rendering, which allows React to interrupt a long-running render to handle a high-priority event.', date: '2h ago' },
  { id: 2, domain: 'paulgraham.com', url: 'https://paulgraham.com/ds.html', text: 'Do things that don\'t scale. A lot of would-be founders believe that startups either take off or don\'t.', date: '5h ago' },
  { id: 3, domain: 'stripe.com', url: 'https://stripe.com/docs/api', text: 'The Stripe API uses REST, has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes.', date: '1d ago' },
];

// --- MODALS ---

interface NewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; content: string; theme: ThemeName }) => void;
  initialData?: { title: string; description: string; content: string };
}

function NewPromptModal({ isOpen, onClose, onSave, initialData }: NewPromptModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('chatgpt');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Create New Prompt</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Socratic Tutor"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Short Description</label>
                <input 
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g., Guides users through complex topics..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Prompt Content</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Select Theme Color</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {(Object.keys(THEMES) as ThemeName[]).map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => setSelectedTheme(themeName)}
                      className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center ${
                        selectedTheme === themeName 
                          ? 'border-white scale-110 shadow-lg' 
                          : 'border-transparent hover:border-white/30'
                      }`}
                      style={{ backgroundColor: THEMES[themeName].color }}
                    >
                      {selectedTheme === themeName && <Check className="w-4 h-4 text-black" />}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => onSave({ title, description, content, theme: selectedTheme })}
                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all mt-4"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- MAIN COMPONENT ---

export function Prompts({ setTheme, activeFolder, setActiveFolder, promptFolders, items, setItems, onDragStart }: PromptsProps) {
  const [activeView, setActiveView] = useState<'hub' | 'frameworks' | 'refine' | 'captures' | 'saved-prompts'>('hub');
  const [refineInput, setRefineInput] = useState('');
  const [isNewPromptModalOpen, setIsNewPromptModalOpen] = useState(false);
  const [initialPromptData, setInitialPromptData] = useState<{ title: string; description: string; content: string } | undefined>(undefined);
  const [captures, setCaptures] = useState(MOCK_CAPTURES);

  // Effect to handle folder selection from sidebar
  useEffect(() => {
    if (activeFolder) {
      setActiveView('saved-prompts');
    }
  }, [activeFolder]);

  const handleNavigateToRefine = (initialText?: string) => {
    if (initialText) setRefineInput(initialText);
    setActiveView('refine');
  };

  const handleOpenNewPromptModal = (data?: { title: string; description: string; content: string }) => {
    setInitialPromptData(data);
    setIsNewPromptModalOpen(true);
  };

  const handleSaveNewPrompt = (data: { title: string; description: string; content: string; theme: ThemeName }) => {
    const newItem: Item = {
      id: `prm-${Date.now()}`,
      ...data,
      type: 'prompt',
      folderId: activeFolder || null
    };
    setItems(prev => [newItem, ...prev]);
    setIsNewPromptModalOpen(false);
    setActiveView('saved-prompts');
  };

  const handleCaptureDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const text = parsed.content || parsed.text || parsed.description;
        if (text) {
          const newCapture = {
            id: Date.now(),
            domain: parsed.domain || 'manual.drop',
            url: parsed.url || 'Dropped Content',
            text: text,
            date: 'Just now'
          };
          setCaptures(prev => [newCapture, ...prev]);
        }
      } catch (err) {
        console.error('Failed to parse dropped data', err);
      }
    }
  };

  return (
    <div className="h-full relative overflow-hidden z-10">
      <AnimatePresence>
        {activeView === 'hub' && (
          <motion.div 
            key="hub"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(12px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-y-auto p-4 sm:p-8 lg:pl-56 lg:pr-12 lg:py-12 z-0"
          >
            <HubView onNavigate={setActiveView} />
          </motion.div>
        )}
        
        {activeView === 'frameworks' && (
          <ViewWrapper key="frameworks" id="frameworks">
            <FrameworksView onBack={() => setActiveView('hub')} setTheme={setTheme} />
          </ViewWrapper>
        )}
        
        {activeView === 'refine' && (
          <ViewWrapper key="refine" id="refine">
            <RefineView 
              onBack={() => setActiveView('hub')} 
              initialInput={refineInput} 
              onSave={(text) => handleOpenNewPromptModal({ title: 'Refined Prompt', description: 'Optimized via Refine', content: text })}
            />
          </ViewWrapper>
        )}
        
        {activeView === 'captures' && (
          <ViewWrapper key="captures" id="captures">
            <CapturesView 
              onBack={() => setActiveView('hub')} 
              onRefine={handleNavigateToRefine} 
              onSaveToPrompts={(text) => handleOpenNewPromptModal({ title: 'New Capture', description: 'Captured from web', content: text })} 
              captures={captures}
              onDrop={handleCaptureDrop}
            />
          </ViewWrapper>
        )}

        {activeView === 'saved-prompts' && (
          <ViewWrapper key="saved-prompts" id="saved-prompts">
            <SavedPromptsView 
              onBack={() => setActiveView('hub')} 
              activeFolder={activeFolder} 
              setActiveFolder={setActiveFolder}
              promptFolders={promptFolders}
              items={items}
              onNewPrompt={() => handleOpenNewPromptModal()}
              onSelectTheme={setTheme}
              onDragStart={onDragStart}
            />
          </ViewWrapper>
        )}
      </AnimatePresence>

      <NewPromptModal 
        isOpen={isNewPromptModalOpen}
        onClose={() => setIsNewPromptModalOpen(false)}
        onSave={handleSaveNewPrompt}
        initialData={initialPromptData}
      />
    </div>
  );
}

// --- SHARED WRAPPER ---

function ViewWrapper({ children, id }: { children: React.ReactNode, id: string, key?: string | number }) {
  return (
    <motion.div 
      className="absolute inset-0 z-10 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div 
        layoutId={`gateway-${id}-bg`}
        className="absolute inset-0 glass-panel z-0"
        style={{ borderRadius: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-8 lg:pl-56 lg:pr-12 lg:py-12"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// --- HUB VIEW ---

function HubView({ onNavigate }: { onNavigate: (view: 'frameworks' | 'refine' | 'captures' | 'saved-prompts') => void }) {
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

// --- FRAMEWORKS VIEW (The 7x7 Matrix) ---

function FrameworksView({ onBack, setTheme }: { onBack: () => void, setTheme: (theme: ThemeName) => void }) {
  const [selectedCell, setSelectedCell] = useState<any>(null);

  return (
    <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={onBack} className="p-3 glass-panel-light rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">Frameworks</h2>
          <p className="text-white/40">The 7x7 Matrix</p>
        </div>
      </div>

      {/* The Grid */}
      <div className="flex-1 overflow-x-auto pb-8">
        <div className="min-w-[1000px] grid grid-cols-7 gap-6 h-full">
          {MATRIX_DATA.map((col) => (
            <div key={col.id} className="flex flex-col gap-4">
              {/* Column Header */}
              <div className="flex flex-col items-center justify-center p-4 glass-panel-light rounded-2xl mb-2">
                <col.icon className={`w-6 h-6 mb-2 bg-gradient-to-br ${col.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
                <span className="text-sm font-bold uppercase tracking-wider text-white/70">{col.label}</span>
              </div>
              
              {/* Cells */}
              {col.cells.map((cell) => {
                const hasBranches = cell.branches.length > 0;
                return (
                  <motion.div
                    key={cell.id}
                    onClick={() => setSelectedCell({ ...cell, category: col })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square glass-panel-light rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                      hasBranches ? `ring-1 ${col.ring} shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'hover:bg-white/10'
                    }`}
                  >
                    {hasBranches && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${col.color} opacity-10 pointer-events-none`} />
                    )}
                    <col.icon className={`w-8 h-8 mb-3 ${hasBranches ? 'text-white' : 'text-white/40'}`} />
                    <span className={`text-xs font-medium ${hasBranches ? 'text-white' : 'text-white/60'}`}>{cell.title}</span>
                    
                    {hasBranches && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Branching Tree Modal */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-2xl rounded-[2rem] p-8 relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedCell(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCell.category.color} flex items-center justify-center shadow-lg`}>
                  <selectedCell.category.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{selectedCell.title}</h3>
                  <p className="text-white/50">{selectedCell.category.label} Category</p>
                </div>
              </div>

              {/* Tree */}
              <div className="relative pl-8 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[2.4rem] top-10 bottom-10 w-0.5 bg-gradient-to-b from-white/40 to-white/5" />

                {/* Main Trunk */}
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.5)] shrink-0">
                    v1.0
                  </div>
                  <div className="glass-panel-light p-5 rounded-2xl flex-1 border border-white/20">
                    <h4 className="font-bold text-lg mb-1">Main Trunk</h4>
                    <p className="text-sm text-white/50">The original, universal prompt.</p>
                  </div>
                </div>

                {/* Branches */}
                {selectedCell.branches.length > 0 ? (
                  selectedCell.branches.map((branch: any, i: number) => (
                    <motion.div 
                      key={branch.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (i + 1) }}
                      className="relative z-10 flex items-center gap-6 group"
                    >
                      {/* Branch connector line */}
                      <div className="absolute left-[-1.5rem] top-1/2 w-6 h-0.5 bg-white/20" />
                      
                      <div className="w-12 h-12 rounded-full glass-panel-light flex items-center justify-center font-mono text-sm shrink-0 border border-white/10 group-hover:border-white/40 transition-colors">
                        v1.{i+1}
                      </div>
                      
                      <div className="glass-panel-light p-4 rounded-2xl flex-1 flex items-center justify-between group-hover:bg-white/5 transition-colors">
                        <span className="font-medium text-white/80 group-hover:text-white">{branch.name}</span>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors tooltip-trigger" title="Make Main Trunk">
                            <GitCommit className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors tooltip-trigger" title="Delete Branch">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="pl-16 text-white/30 italic">No branches created yet.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useScrollHint(ref: React.RefObject<HTMLElement | null>, deps: any[]) {
  const [showHint, setShowHint] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkScroll = () => {
      if (el.scrollHeight > el.clientHeight && !hasShownRef.current) {
        setShowHint(true);
        hasShownRef.current = true;
        setTimeout(() => setShowHint(false), 3000);
      } else if (el.scrollHeight <= el.clientHeight) {
        hasShownRef.current = false;
      }
    };

    checkScroll();
    
    // Check on resize as well
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    
    return () => observer.disconnect();
  }, deps);

  return showHint;
}

function ScrollHint({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none"
        >
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center p-1 bg-black/50 backdrop-blur-md">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-white/80 rounded-full"
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-mono drop-shadow-md">Scroll</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- REFINE VIEW (The 7-Way Optimizer) ---

function RefineView({ onBack, initialInput, onSave }: { onBack: () => void, initialInput: string, onSave: (text: string) => void }) {
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState('');
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [waveColor, setWaveColor] = useState('bg-white');
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const showInputScrollHint = useScrollHint(inputRef, [input]);
  const showOutputScrollHint = useScrollHint(outputRef, [output]);

  const handleRefine = async (mode: any) => {
    if (!input) return;
    
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      setApiKeyModalOpen(true);
      return;
    }

    setActiveMode(mode.id);
    setWaveColor(mode.glow);
    setIsRefining(true);
    setOutput('');
    
    try {
      const prompt = `You are an expert prompt engineer. Your task is to refine the following raw text into a high-quality, professional AI prompt.
      
Mode: ${mode.label}
Description of mode: ${mode.desc}

Raw Text:
"""
${input}
"""

Please provide ONLY the final refined prompt. Do not include any explanations, greetings, or markdown code blocks unless they are part of the prompt itself.`;

      const result = await generateGeminiResponse(prompt, apiKey);
      
      // Stop refining animation
      setIsRefining(false);
      setOutput(result);
      
    } catch (error) {
      console.error("Error refining prompt:", error);
      setIsRefining(false);
      setOutput("Error: Failed to refine prompt. Please check your API key and try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.content) {
          setInput(prev => prev ? `${prev}\n\n${parsed.content}` : parsed.content);
        } else if (parsed.description) {
          setInput(prev => prev ? `${prev}\n\n${parsed.description}` : parsed.description);
        } else if (typeof parsed === 'string') {
          setInput(prev => prev ? `${prev}\n\n${parsed}` : parsed);
        }
      } catch (err) {
        // If it's not JSON, try plain text
        const text = e.dataTransfer.getData('text/plain');
        if (text) setInput(prev => prev ? `${prev}\n\n${text}` : text);
      }
    } else {
      const text = e.dataTransfer.getData('text/plain');
      if (text) setInput(prev => prev ? `${prev}\n\n${text}` : text);
    }
  };

  const handleResultToInput = () => {
    if (output) {
      setInput(output);
      setOutput('');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={onBack} className="p-3 glass-panel-light rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">Refine</h2>
          <p className="text-white/40">The 7-Way Optimizer</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 pb-8">
        {/* Input Zone */}
        <div className="lg:w-[40%] flex flex-col relative">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="glass-panel rounded-[2rem] p-6 flex-1 flex flex-col relative overflow-hidden group/input"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex justify-between items-center">
              Input (Paste & Drop)
              <span className="text-[10px] opacity-0 group-hover/input:opacity-100 transition-opacity">Drop prompt here</span>
            </h3>
            <textarea 
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full flex-1 bg-transparent resize-none text-lg text-white placeholder-white/20 focus:outline-none"
              placeholder="Paste your raw thought, messy text, or capture here..."
            />
            <ScrollHint show={showInputScrollHint} />
          </div>
        </div>

        {/* The 7 Modes (Central Console) */}
        <div className="lg:w-[20%] flex flex-col justify-center items-center gap-4 py-4">
          {REFINE_CRYSTALS.map((crystal) => (
            <motion.button
              key={crystal.id}
              onClick={() => handleRefine(crystal)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-48 h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 ${
                activeMode === crystal.id ? 'bg-white/20' : 'glass-panel-light hover:bg-white/10'
              }`}
            >
              {activeMode === crystal.id && (
                <motion.div 
                  layoutId="active-crystal-glow"
                  className={`absolute inset-0 rounded-full ${crystal.shadow} shadow-[0_0_20px_currentColor] opacity-50`}
                  style={{ color: 'inherit' }}
                />
              )}
              <div className={`w-3 h-3 rounded-full ${crystal.color} shadow-[0_0_10px_currentColor]`} style={{ color: 'inherit' }} />
              <span className="font-bold tracking-wide">{crystal.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Result Zone */}
        <div className="lg:w-[40%] flex flex-col relative">
          <div className="glass-panel rounded-[2rem] p-6 flex-1 flex flex-col relative overflow-hidden">
            
            {/* Neural Wave Animation */}
            <AnimatePresence>
              {isRefining && (
                <motion.div 
                  initial={{ left: '-50%', opacity: 0 }}
                  animate={{ left: '150%', opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                  className={`absolute top-0 bottom-0 w-64 blur-[50px] ${waveColor} z-0 pointer-events-none`}
                />
              )}
            </AnimatePresence>

            {/* Background Glow when finished */}
            <AnimatePresence>
              {output && !isRefining && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.2, scale: 1.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute inset-0 blur-[120px] ${waveColor} z-0 pointer-events-none`}
                />
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Final Polish</h3>
              {output && !isRefining && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => onSave(output)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold border border-amber-500/30"
                    title="Save to Collection"
                  >
                    <Star className="w-3 h-3" /> Save
                  </button>
                  <button 
                    onClick={handleResultToInput}
                    className="px-3 py-1.5 rounded-lg glass-panel-light hover:bg-white/10 transition-colors flex items-center gap-2 text-[10px] font-bold"
                    title="Move to Input"
                  >
                    <ArrowRight className="w-3 h-3" /> Use as Input
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(output);
                    }}
                    className="p-2 rounded-lg glass-panel-light hover:bg-white/10 transition-colors"
                    title="Copy to Clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div 
              draggable={!!output && !isRefining}
              onDragStart={(e) => {
                if (output) {
                  e.dataTransfer.setData('application/json', JSON.stringify({ content: output }));
                  e.dataTransfer.setData('text/plain', output);
                }
              }}
              className="flex-1 overflow-y-auto relative z-10 cursor-grab active:cursor-grabbing" 
              ref={outputRef}
            >
              {isRefining ? (
                <div className="h-full flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <Sparkles className="w-12 h-12 text-white/20 animate-pulse" />
                  </div>
                  <p className="text-white/50 font-mono text-sm uppercase tracking-widest animate-pulse">Purifying Idea...</p>
                </div>
              ) : output ? (
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-white/90 leading-relaxed font-mono text-sm">{output}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <Wand2 className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-center max-w-xs">Select a crystal mode to transform your input into a powerful prompt.</p>
                </div>
              )}
            </div>
            <ScrollHint show={showOutputScrollHint} />

            {/* Bottom Progress Bar */}
            <AnimatePresence>
              {isRefining && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 overflow-hidden z-20">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                    className={`h-full w-full ${waveColor} shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ApiKeyModal 
        isOpen={apiKeyModalOpen} 
        modelId="gemini"
        modelName="Gemini"
        onClose={() => setApiKeyModalOpen(false)} 
        onSave={(key) => {
          localStorage.setItem('GEMINI_API_KEY', key);
          setApiKeyModalOpen(false);
        }}
      />
    </div>
  );
}

// --- CAPTURES VIEW (The Raw Feed) ---

function CapturesView({ onBack, onRefine, onSaveToPrompts, captures, onDrop }: { onBack: () => void, onRefine: (text: string) => void, onSaveToPrompts: (text: string) => void, captures: any[], onDrop: (e: React.DragEvent) => void }) {
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
        {/* Timeline Line */}
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
              {/* Timeline Dot */}
              <div className="absolute -left-8 sm:-left-12 top-6 w-4 h-4 rounded-full bg-white/20 border-2 border-[#0a0a0a] ring-2 ring-white/10 group-hover:bg-white transition-colors z-10" />

              {/* Card */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
                {/* Header */}
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
                    {/* Hover Actions */}
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
                        <Star className="w-3 h-3" /> Save to Saved Prompts
                      </button>
                    </div>
                    <span className="text-xs font-mono text-white/40 shrink-0">{capture.date}</span>
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-6">
                  <p className="font-mono text-sm text-white/80 leading-relaxed">
                    {capture.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- SAVED PROMPTS VIEW ---

function SavedPromptsView({ onBack, activeFolder, setActiveFolder, onNewPrompt, onSelectTheme, promptFolders, items, onDragStart }: { onBack: () => void, activeFolder?: string | null, setActiveFolder: (id: string | null) => void, onNewPrompt: () => void, onSelectTheme: (theme: ThemeName) => void, promptFolders: Folder[], items: Item[], onDragStart?: (event: React.DragEvent, nodeType: string, data: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to get all subfolder IDs recursively
  const getAllSubfolderIds = (folderId: string): string[] => {
    const subfolders = promptFolders.filter(f => f.parentId === folderId);
    let ids = [folderId];
    subfolders.forEach(sub => {
      ids = [...ids, ...getAllSubfolderIds(sub.id)];
    });
    return ids;
  };

  const filteredFolders = promptFolders.filter(f => {
    if (searchQuery) {
      return f.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return f.parentId === (activeFolder || null);
  });

  const filteredPrompts = items.filter(item => {
    if (item.type !== 'prompt') return false;

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by folder:
    if (searchQuery) return matchesSearch;

    return item.folderId === (activeFolder || null);
  });

  const activeFolderData = activeFolder ? promptFolders.find(f => f.id === activeFolder) : null;
  const ActiveIcon = activeFolderData ? ICON_LIBRARY[activeFolderData.iconIndex % ICON_LIBRARY.length] : Zap;

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
              <ActiveIcon className="w-8 h-8 text-white/20" />
              {activeFolderData ? activeFolderData.name : 'Saved Prompts'}
            </h2>
            <p className="text-white/40">{activeFolderData ? 'Viewing items in this folder' : 'Your main prompt collection'}</p>
          </div>
        </div>
        
        <button 
          onClick={onNewPrompt}
          className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-5 h-5" /> New Prompt
        </button>
      </div>

      {/* Search */}
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

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-12 scrollbar-hide">
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
                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500 shadow-xl group-hover:shadow-amber-500/10">
                      <FolderIconComp className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform" />
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
              onClick={() => onSelectTheme(prompt.theme || 'chatgpt')}
              draggable
              onDragStart={(e) => {
                if (onDragStart) {
                  onDragStart(e as any, 'glassNode', prompt);
                } else {
                  e.dataTransfer.setData('application/json', JSON.stringify(prompt));
                  e.dataTransfer.effectAllowed = 'move';
                }
              }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group cursor-grab relative overflow-hidden active:scale-[0.98] active:cursor-grabbing"
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: THEMES[prompt.theme || 'chatgpt'].color }}
              />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110 shadow-xl"
                    style={{ color: THEMES[prompt.theme || 'chatgpt'].color }}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition-colors flex items-center gap-3">
                      {prompt.title}
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: THEMES[prompt.theme || 'chatgpt'].color, boxShadow: `0 0 10px ${THEMES[prompt.theme || 'chatgpt'].color}` }} 
                      />
                    </h3>
                    <p className="text-white/50 text-sm">{prompt.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={e => e.stopPropagation()}>
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={e => e.stopPropagation()}>
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-black/20 rounded-xl p-4 font-mono text-xs text-white/70 leading-relaxed">
                {prompt.content || (prompt as any).description}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-white/20">
            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
            <p>No prompts found in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
