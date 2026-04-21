import React, { useEffect, useState } from 'react';

import { 
  ShieldCheck, 
  ExternalLink, 
  Settings, 
  RefreshCw,
  Zap,
  Globe,
  AlertCircle
} from 'lucide-react';
import './App.css';

// Using a simplified version of the shared design for the extension
export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    // 1. Check for token in storage
    chrome.storage.local.get(['sb_token'], (result) => {
      if (result.sb_token) {
        setToken(result.sb_token);
      }
    });

    // 2. Initial platform status check (mocked for now)
    setPlatforms(['ChatGPT', 'Claude']);
  }, []);

  const handleOpenDashboard = () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  };

  const handleManualSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('idle'), 1500);
  };

  return (
    <div className="extension-container bg-grain">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Zap size={16} />
          </div>
          <span className="font-semibold tracking-tight text-white/90">BrainBox</span>
        </div>
        <button className="p-1.5 hover:bg-white/5 rounded-full text-white/40 hover:text-white/70 transition-colors">
          <Settings size={16} />
        </button>
      </div>

      {/* Connection Status Panel */}
      <div className="glass-panel p-5 flex flex-col gap-5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <h2 className="text-sm font-semibold text-white/90 mb-1 flex items-center gap-2">
              {token ? 'Secure Cloud Active' : 'Authentication Required'}
              {token && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            </h2>
            <p className="text-[11px] text-white/40 leading-relaxed font-medium">
              {token 
                ? 'Your neural bridge is active and syncing captures in real-time.' 
                : 'Connect your BrainBox account to enable automatic chat synchronization.'}
            </p>
          </div>
          {token ? (
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck size={18} className="text-emerald-400" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle size={18} className="text-amber-400" />
            </div>
          )}
        </div>

        {!token ? (
          <button 
            onClick={handleOpenDashboard}
            className="w-full py-3 px-4 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Connect BrainBox
            <ExternalLink size={14} />
          </button>
        ) : (
          <div className="flex gap-2 relative z-10">
            <button 
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
              className="flex-1 py-2.5 px-3 glass-panel-light border border-white/5 hover:border-white/10 hover:bg-white/5 text-[11px] font-bold text-white/80 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
              {syncStatus === 'syncing' ? 'Syncing...' : 'Force Sync'}
            </button>
            <button 
              onClick={handleOpenDashboard}
              className="px-4 glass-panel-light border border-white/5 hover:border-white/10 hover:bg-white/5 text-white/70 transition-all"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Active Platforms */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Neural Nodes</span>
          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] text-emerald-400 font-bold uppercase">Auto-detect</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
          {['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].map(p => (
            <div key={p} className={`glass-panel p-3 flex items-center gap-3 border border-white/5 transition-all duration-500 ${platforms.includes(p) ? 'opacity-100 bg-white/5 border-white/10' : 'opacity-30'}`}>
              <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${platforms.includes(p) ? 'bg-emerald-400 text-emerald-400/40' : 'bg-white/10 text-transparent'}`} />
              <span className="text-[11px] font-bold tracking-tight">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 flex items-center justify-center gap-4 text-[10px] text-white/20">
        <div className="flex items-center gap-1.5">
          <Globe size={10} />
          <span>v1.2.0</span>
        </div>
        <span>•</span>
        <span>Secure Bridge Active</span>
      </div>
    </div>
  );
}
