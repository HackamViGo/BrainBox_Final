import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      <div className="glass-panel p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-white/90 mb-1">
              {token ? 'Свързан с облака' : 'Нужна е аутентикация'}
            </h2>
            <p className="text-xs text-white/40 leading-relaxed">
              {token 
                ? 'Автоматичното синхронизиране на чатове е активно.' 
                : 'Моля, влезте в профила си, за да активирате BrainBox.'}
            </p>
          </div>
          {token ? (
            <ShieldCheck size={20} className="text-emerald-400/80" />
          ) : (
            <AlertCircle size={20} className="text-amber-400/80" />
          )}
        </div>

        {!token ? (
          <button 
            onClick={handleOpenDashboard}
            className="w-full py-2.5 px-4 bg-white text-black text-xs font-semibold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            Влез в BrainBox
            <ExternalLink size={14} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
              className="flex-1 py-2 px-3 glass-panel border border-white/5 hover:border-white/10 text-[11px] font-medium text-white/70 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
              {syncStatus === 'syncing' ? 'Синхронизиране...' : 'Синхронизирай'}
            </button>
            <button 
              onClick={handleOpenDashboard}
              className="px-3 glass-panel border border-white/5 hover:border-white/10 text-white/70"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Active Platforms */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Активни платформи</span>
          <span className="text-[10px] text-emerald-400/60 font-medium">Auto-detect</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].map(p => (
            <div key={p} className="glass-panel p-2 flex items-center gap-2 border border-white/5 opacity-80">
              <div className={`w-1.5 h-1.5 rounded-full ${platforms.includes(p) ? 'bg-emerald-400 pulse' : 'bg-white/10'}`} />
              <span className={`text-[11px] ${platforms.includes(p) ? 'text-white/80' : 'text-white/20'}`}>{p}</span>
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
