'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Wrench, 
  RefreshCw, 
  Globe, 
  Zap, 
  Key, 
  Shield, 
  Save, 
  ChevronDown,
  Check,
  Clock,
  Eye,
  EyeOff,
  Folder as FolderIcon
} from 'lucide-react';
import { ICON_LIBRARY } from '@brainbox/ui';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useAppStore } from '@/store/useAppStore';
import { z } from 'zod';
import type { Folder } from '@brainbox/types';

const ApiKeysSchema = z.object({
  openai: z.string().startsWith('sk-', 'OpenAI key must start with sk-').or(z.literal('')),
  claude: z.string().startsWith('sk-ant-', 'Claude key must start with sk-ant-').or(z.literal('')),
  gemini: z.string().min(10, 'Gemini key looks too short').or(z.literal('')),
});

export function Settings() {
  const { promptFolders: allFolders } = useLibraryStore();
  const { getApiKey, setApiKey } = useAppStore();
  const [autoSync, setAutoSync] = useState(true);

  // Selected folders for extension quick-access — Zustand persisted
  const [selectedFolders, setSelectedFolders] = useState<string[]>(() => {
    // Safe SSR init: read from appStore apiKeys map using a dedicated key
    const saved = useAppStore.getState().getApiKey('__ext_selected_folders')
    return saved ? JSON.parse(saved) : []
  });

  // API keys — read from Zustand, NOT localStorage directly
  const [apiKeys, setApiKeys] = useState({
    openai: getApiKey('chatgpt') || '',
    claude: getApiKey('claude') || '',
    gemini: getApiKey('gemini') || ''
  });
  const [showKeys, setShowKeys] = useState({ openai: false, claude: false, gemini: false });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retention days — persisted in Zustand (via dedicated key slot)
  const [autoDeleteDays, setAutoDeleteDays] = useState(() => {
    return useAppStore.getState().getApiKey('__vault_retention_days') || '30'
  });

  // Only top-level prompt folders for quick access
  const promptFolders = allFolders.filter((f: Folder) => f.parentId === null);

  const toggleFolder = (id: string) => {
    const newSelected = selectedFolders.includes(id) 
      ? selectedFolders.filter(f => f !== id) 
      : [...selectedFolders, id];
    setSelectedFolders(newSelected);
    // Persist via Zustand (special key slot for extension folder prefs)
    setApiKey('__ext_selected_folders', JSON.stringify(newSelected));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    const validation = ApiKeysSchema.safeParse(apiKeys);
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Validation failed');
      setIsSaving(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Persist API keys via Zustand store (stored in apiKeys map, persisted by partialize)
    setApiKey('chatgpt', apiKeys.openai);
    setApiKey('claude', apiKeys.claude);
    setApiKey('gemini', apiKeys.gemini);
    setApiKey('__vault_retention_days', autoDeleteDays);

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto no-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full pb-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white/10 shadow-2xl shrink-0">
              <SettingsIcon className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="transition-transform duration-300 group-hover:translate-x-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter truncate uppercase italic">Neural Config</h1>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] font-mono mt-1">Core Synchronization Parameters</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 shadow-2xl ${
              saved 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-black hover:bg-white/90 active:scale-95 disabled:opacity-50'
            }`}
          >
            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Synchronized' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold uppercase tracking-widest flex items-center gap-3"
          >
            <Shield className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Sections */}
        <div className="space-y-12">
          {/* AI Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-white/40" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">AI Neural Keys</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'openai', label: 'OpenAI API Key', value: apiKeys.openai, placeholder: 'sk-...' },
                { id: 'claude', label: 'Anthropic Key', value: apiKeys.claude, placeholder: 'sk-ant-...' },
                { id: 'gemini', label: 'Google Gemini Key', value: apiKeys.gemini, placeholder: 'Enter key...' },
              ].map((key) => (
                <div key={key.id} className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 font-mono">{key.label}</label>
                    <button 
                      onClick={() => setShowKeys(prev => ({ ...prev, [key.id]: !prev[key.id as keyof typeof prev] }))}
                      className="text-white/20 hover:text-white transition-colors"
                    >
                      {showKeys[key.id as keyof typeof showKeys] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type={showKeys[key.id as keyof typeof showKeys] ? 'text' : 'password'}
                    value={key.value}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [key.id]: e.target.value }))}
                    placeholder={key.placeholder}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/10 font-mono focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Extension Integration */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-white/40" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Extension Synchronization</h2>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-tight">Auto-Capture Folders</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Select folders prioritized for extension quick-save</p>
                </div>
                <div 
                  onClick={() => setAutoSync(!autoSync)}
                  className={`w-14 h-8 rounded-full border border-white/10 p-1 cursor-pointer transition-all duration-500 ${autoSync ? 'bg-emerald-500/20' : 'bg-white/5'}`}
                >
                  <motion.div 
                    animate={{ x: autoSync ? 24 : 0 }}
                    className={`w-6 h-6 rounded-full shadow-lg ${autoSync ? 'bg-emerald-400' : 'bg-white/10'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {allFolders.filter((f: Folder) => f.parentId === null).map((folder: Folder) => {
                  const isSelected = selectedFolders.includes(folder.id);
                  const Icon = ICON_LIBRARY[folder.iconIndex % ICON_LIBRARY.length] || FolderIcon;
                  const colors = ['text-orange-400', 'text-cyan-400', 'text-red-400', 'text-emerald-400', 'text-amber-400', 'text-purple-400', 'text-blue-400'];
                  const colorClass = colors[folder.iconIndex % colors.length];

                  return (
                    <button 
                      key={folder.id}
                      onClick={() => toggleFolder(folder.id)}
                      className={`p-5 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden group ${
                        isSelected 
                          ? 'bg-white/10 border-white/20 shadow-2xl' 
                          : 'bg-black/20 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {isSelected && (
                        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${colorClass}`} />
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform ${isSelected ? colorClass : 'text-white/20'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${isSelected ? 'text-white' : 'text-white/40'}`}>
                          {folder.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Retention & Archive */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-white/40" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Neural Retention</h2>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-tight">Auto-Purge Interval</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Number of days before Echoes are permanently erased</p>
                </div>
                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/5">
                  <input 
                    type="number"
                    value={autoDeleteDays}
                    onChange={(e) => setAutoDeleteDays(e.target.value)}
                    className="w-16 bg-transparent text-center font-bold text-white focus:outline-none"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mr-2">Days</span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60 leading-relaxed font-mono">
                  Permanent Artifacts (Frozen) are never affected by auto-purge synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
           <span className="text-[10px] font-bold font-mono text-white/10 uppercase tracking-[0.5em]">System Architecture v4.2 • Core Synchronized</span>
        </div>
      </motion.div>
    </div>
  );
}
