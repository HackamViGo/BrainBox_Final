import { useState, useEffect } from 'react';
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

// --- MOCK DATA ---
type VaultItem = {
  id: string;
  title: string;
  excerpt: string;
  is_permanent: boolean;
  createdAt: string;
  daysLeft?: number; // For echoes
};

const INITIAL_ITEMS: VaultItem[] = [
  { id: '1', title: 'Q3 Marketing Strategy Draft', excerpt: 'Initial thoughts on the Q3 rollout and target demographics...', is_permanent: false, createdAt: '2026-02-20', daysLeft: 2 },
  { id: '2', title: 'React Performance Notes', excerpt: 'Memoization techniques, useMemo vs useCallback, and React Compiler...', is_permanent: false, createdAt: '2026-03-10', daysLeft: 14 },
  { id: '3', title: 'Project Phoenix Architecture', excerpt: 'System design for the new microservices backend...', is_permanent: true, createdAt: '2025-11-05' },
  { id: '4', title: 'Weekly Sync Agendas', excerpt: 'Topics for the weekly engineering sync across all teams...', is_permanent: false, createdAt: '2026-03-15', daysLeft: 25 },
  { id: '5', title: 'Core Values Manifesto', excerpt: 'The foundational principles of our team culture and ethics...', is_permanent: true, createdAt: '2024-01-12' },
  { id: '6', title: 'Random Idea: AI Coffee Maker', excerpt: 'What if the coffee maker knew when you were tired based on typing speed...', is_permanent: false, createdAt: '2026-03-18', daysLeft: 28 },
  { id: '7', title: 'Deprecated API Endpoints', excerpt: 'List of v1 endpoints to be removed in the next major release...', is_permanent: false, createdAt: '2026-02-25', daysLeft: 5 },
];

export function Archive() {
  const [items, setItems] = useState<VaultItem[]>(INITIAL_ITEMS);
  const [activeLayer, setActiveLayer] = useState<'echoes' | 'artifacts'>('echoes');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [retentionDays, setRetentionDays] = useState(30);

  useEffect(() => {
    const savedDays = localStorage.getItem('vault_retention_days');
    if (savedDays && savedDays !== 'never') {
      setRetentionDays(parseInt(savedDays, 10));
    }
  }, []);

  const displayedItems = items.filter(item => 
    activeLayer === 'echoes' ? !item.is_permanent : item.is_permanent
  ).sort((a, b) => {
    if (activeLayer === 'echoes') {
      return (a.daysLeft || 0) - (b.daysLeft || 0); // ascending days left
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
      setSelectedIds(new Set(displayedItems.map(i => i.id)));
    }
  };

  const promoteItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, is_permanent: true } : item
    ));
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const promoteSelected = () => {
    setItems(prev => prev.map(item => 
      selectedIds.has(item.id) ? { ...item, is_permanent: true } : item
    ));
    setSelectedIds(new Set());
  };

  const deleteSelected = () => {
    setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  };

  const emptyTheVoid = () => {
    setItems(prev => prev.filter(item => item.is_permanent));
    setSelectedIds(new Set());
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto relative text-slate-400 bg-transparent">
      {/* Frozen Texture Overlay (Dust/Smoke effect) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full relative z-10 pb-24"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.02)] backdrop-blur-xl shrink-0">
              <Snowflake className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-serif tracking-widest truncate">The Vault</h1>
              <p className="text-slate-500 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-mono truncate">Cold Storage & Artifacts</p>
            </div>
          </div>
          
          {/* Efficiency Dashboard */}
          <div className="flex items-center gap-4 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md w-fit">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
            <div className="text-[10px] sm:text-xs">
              <span className="text-slate-300 block font-medium uppercase tracking-wider">Retention Sync</span>
              <span className="text-slate-500 font-mono mt-0.5 block">Auto-purge: {retentionDays} days</span>
            </div>
          </div>
        </div>

        {/* LAYER TOGGLE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/5 w-full sm:w-fit backdrop-blur-md">
            <button
              onClick={() => { setActiveLayer('echoes'); setSelectedIds(new Set()); }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-all uppercase tracking-widest ${
                activeLayer === 'echoes' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Wind className="w-3.5 h-3.5 sm:w-4 h-4" /> The Echoes
            </button>
            <button
              onClick={() => { setActiveLayer('artifacts'); setSelectedIds(new Set()); }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-all uppercase tracking-widest ${
                activeLayer === 'artifacts' 
                  ? 'bg-white/10 text-white shadow-sm border border-white/10' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Diamond className="w-3.5 h-3.5 sm:w-4 h-4" /> The Artifacts
            </button>
          </div>

          {activeLayer === 'echoes' && displayedItems.length > 0 && (
            <button
              onClick={emptyTheVoid}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-[10px] sm:text-xs uppercase tracking-widest font-mono"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 h-4" /> Empty the Void
            </button>
          )}
        </div>

        {/* LIST CONTROLS */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button 
            onClick={toggleSelectAll}
            className="flex items-center gap-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            {selectedIds.size === displayedItems.length && displayedItems.length > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-slate-400" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
            <span className="uppercase tracking-wider text-xs font-mono">Select All</span>
          </button>
          
          <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">
            {displayedItems.length} {displayedItems.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {/* ITEMS GRID */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              
              // Calculate visual fading for Echoes
              const fadeRatio = activeLayer === 'echoes' && item.daysLeft !== undefined
                ? Math.max(0.2, item.daysLeft / retentionDays)
                : 1;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                  animate={{ opacity: activeLayer === 'echoes' ? fadeRatio : 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: -10, transition: { duration: 0.4, ease: "easeOut" } }}
                  key={item.id}
                  className={`group relative flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer overflow-hidden backdrop-blur-xl ${
                    activeLayer === 'artifacts'
                      ? isSelected 
                        ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                        : 'bg-black/40 border-white/20 hover:border-white/40'
                      : isSelected
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                  onClick={() => toggleSelection(item.id)}
                >
                  {/* Life Indicator for Echoes */}
                  {activeLayer === 'echoes' && item.daysLeft !== undefined && (
                    <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full">
                      <div 
                        className="h-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-1000" 
                        style={{ width: `${Math.max(5, (item.daysLeft / retentionDays) * 100)}%` }}
                      />
                    </div>
                  )}

                  {/* Checkbox */}
                  <div className="shrink-0 relative z-10">
                    {isSelected ? (
                      <CheckCircle2 className={`w-5 h-5 ${activeLayer === 'artifacts' ? 'text-white/70' : 'text-white'}`} />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-700 group-hover:text-slate-500 transition-colors" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <h3 className={`text-base font-medium truncate mb-1 ${activeLayer === 'artifacts' ? 'text-slate-300' : 'text-slate-200'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0 relative z-10">
                    {activeLayer === 'echoes' ? (
                      <div className="flex items-center gap-2 text-slate-400 bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/5">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="text-[10px] sm:text-xs font-mono">Fading in {item.daysLeft}d</span>
                      </div>
                    ) : (
                      <div className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-widest">
                        Protected
                      </div>
                    )}

                    {/* Promotion Ritual Button (Only in Echoes) */}
                    {activeLayer === 'echoes' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          promoteItem(item.id);
                        }}
                        className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Freeze into Artifact"
                      >
                        <Diamond className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {displayedItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-24 text-center flex flex-col items-center justify-center"
            >
              <Snowflake className="w-12 h-12 text-white/5 mx-auto mb-6" />
              <p className="text-slate-500 uppercase tracking-widest font-mono text-sm">The void is empty.</p>
            </motion.div>
          )}
        </div>

      </motion.div>

      {/* BULK ACTION BAR */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 sm:bottom-8 left-4 sm:left-1/2 right-4 sm:right-auto sm:-translate-x-1/2 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl z-50"
          >
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <span className="text-sm font-medium text-slate-300">
                {selectedIds.size} selected
              </span>
              <div className="sm:hidden flex items-center gap-3">
                {activeLayer === 'echoes' && (
                  <button
                    onClick={promoteSelected}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >
                    <Diamond className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={deleteSelected}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            
            <div className="hidden sm:flex items-center gap-3">
              {activeLayer === 'echoes' && (
                <button
                  onClick={promoteSelected}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <Diamond className="w-4 h-4" /> Freeze (Keep Forever)
                </button>
              )}
              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" /> Disintegrate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

