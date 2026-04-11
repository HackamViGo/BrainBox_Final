import { useState } from 'react';
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
  Folder
} from 'lucide-react';
import { Folder as FolderData } from '../types';
import { ICON_LIBRARY } from '../constants';

interface SettingsProps {
  promptFolders: FolderData[];
}

export function Settings({ promptFolders }: SettingsProps) {
  const [autoSync, setAutoSync] = useState(true);
  const [selectedFolders, setSelectedFolders] = useState<string[]>(() => {
    const saved = localStorage.getItem('brainbox_extension_selected_folders');
    return saved ? JSON.parse(saved) : ['prm-1', 'prm-2'];
  });
  const [apiKeys, setApiKeys] = useState({ 
    openai: localStorage.getItem('CHATGPT_API_KEY') || '', 
    claude: localStorage.getItem('CLAUDE_API_KEY') || '', 
    gemini: localStorage.getItem('GEMINI_API_KEY') || '' 
  });
  const [showKeys, setShowKeys] = useState({ openai: false, claude: false, gemini: false });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoDeleteDays, setAutoDeleteDays] = useState(() => localStorage.getItem('vault_retention_days') || '30');

  // Only top-level prompt folders for quick access
  const folders = promptFolders.filter(f => f.parentId === null);

  const toggleFolder = (id: string) => {
    const newSelected = selectedFolders.includes(id) 
      ? selectedFolders.filter(f => f !== id) 
      : [...selectedFolders, id];
    setSelectedFolders(newSelected);
    localStorage.setItem('brainbox_extension_selected_folders', JSON.stringify(newSelected));
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('vault_retention_days', autoDeleteDays);
    localStorage.setItem('CHATGPT_API_KEY', apiKeys.openai);
    localStorage.setItem('CLAUDE_API_KEY', apiKeys.claude);
    localStorage.setItem('GEMINI_API_KEY', apiKeys.gemini);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col p-8 lg:p-12 overflow-y-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full relative z-10 space-y-8 pb-12"
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight uppercase">Settings & Configuration</h1>
              <p className="text-white/50 text-sm font-mono">System parameters and integrations</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all active:scale-95"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>

        {/* SECTION 1: GLOBAL MECHANICS */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Global Mechanics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Synchronization */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white/80 flex items-center gap-2 mb-6 uppercase tracking-wide">
                <RefreshCw className="w-4 h-4 text-blue-400" /> Synchronization
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Auto-sync</span>
                  <button 
                    onClick={() => setAutoSync(!autoSync)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSync ? 'bg-blue-500' : 'bg-white/10'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSync ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Last sync</span>
                  <span className="text-white/40 text-sm font-mono">2m ago</span>
                </div>
                <div className="pt-2">
                  <button className="w-full py-2 rounded-lg border border-white/10 text-white/70 text-sm hover:bg-white/5 hover:text-white transition-colors">
                    Force Manual Sync
                  </button>
                </div>
              </div>
            </div>

            {/* Language & Region */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white/80 flex items-center gap-2 mb-6 uppercase tracking-wide">
                <Globe className="w-4 h-4 text-emerald-400" /> Language & Region
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Language</span>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
                    English (US) <ChevronDown className="w-3 h-3 text-white/50" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Timezone</span>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
                    UTC +2 <ChevronDown className="w-3 h-3 text-white/50" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: THE ECHOES & AUTO-DELETE */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" /> The Echoes (Auto-Delete)
          </h2>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-sm font-bold text-white/80 mb-2">Purge & Polish System</h3>
                <p className="text-white/50 text-sm max-w-xl">
                  Configure how long temporary chats, notes, and captures remain in "The Echoes" before being permanently deleted.
                </p>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-white/60">Keep for:</span>
                <select 
                  value={autoDeleteDays}
                  onChange={(e) => setAutoDeleteDays(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="never">Never (Manual Only)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: EXTENSION QUICK ACCESS */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono text-yellow-400/80 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Extension Quick Access
          </h2>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/20 via-yellow-500/50 to-yellow-500/20" />
            
            <p className="text-white/70 text-sm mb-6">
              Select folders to appear in your Chrome Context Menu:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {folders.map(folder => {
                const isSelected = selectedFolders.includes(folder.id);
                const Icon = ICON_LIBRARY[folder.iconIndex % ICON_LIBRARY.length] || Folder;
                const colors = ['text-orange-400', 'text-cyan-400', 'text-red-400', 'text-emerald-400', 'text-amber-400', 'text-purple-400', 'text-blue-400'];
                const bgs = ['bg-orange-500/10', 'bg-cyan-500/10', 'bg-red-500/10', 'bg-emerald-500/10', 'bg-amber-500/10', 'bg-purple-500/10', 'bg-blue-500/10'];
                const color = colors[folder.iconIndex % colors.length];
                const bg = bgs[folder.iconIndex % bgs.length];

                return (
                  <button
                    key={folder.id}
                    onClick={() => toggleFolder(folder.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isSelected 
                        ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                        : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/60'}`}>
                      {folder.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs font-mono text-white/40 flex items-center gap-2">
                <span className="text-yellow-500">*</span> These folders will be injected directly into AI platforms.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: API VAULT & PRIVACY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* API Vault */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> API Vault
            </h2>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 uppercase tracking-wider">OpenAI Key</label>
                <div className="relative">
                  <input 
                    type={showKeys.openai ? "text" : "password"} 
                    value={apiKeys.openai}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                    placeholder="sk-..." 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors font-mono"
                  />
                  <button 
                    onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 uppercase tracking-wider">Claude Key</label>
                <div className="relative">
                  <input 
                    type={showKeys.claude ? "text" : "password"} 
                    value={apiKeys.claude}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, claude: e.target.value }))}
                    placeholder="sk-ant-..." 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors font-mono"
                  />
                  <button 
                    onClick={() => setShowKeys(prev => ({ ...prev, claude: !prev.claude }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showKeys.claude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 uppercase tracking-wider">Gemini Key</label>
                <div className="relative">
                  <input 
                    type={showKeys.gemini ? "text" : "password"} 
                    value={apiKeys.gemini}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                    placeholder="AIza..." 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors font-mono"
                  />
                  <button 
                    onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" /> Privacy & Data
            </h2>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-[calc(100%-2rem)]">
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm font-medium hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                  Export Data (JSON)
                </button>
                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm font-medium hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                  Import Data
                </button>
              </div>
              
              <div className="pt-6 mt-6 border-t border-white/5">
                <button className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500/20 hover:border-red-500/40 transition-all uppercase tracking-widest">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
