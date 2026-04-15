'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Github, Apple, Chrome, CheckCircle2, Zap, Code2, Palette, Box, Layers, Globe, LogOut } from 'lucide-react';
import { getUser, signOut } from '@/actions/auth';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useShallow } from 'zustand/react/shallow';
import type { User } from '@supabase/supabase-js';

export function Identity() {
  const { user, setUser } = useAppStore(useShallow(s => ({ user: s.user, setUser: s.setUser })));
  const { libraryFolders, promptFolders, items } = useLibraryStore(useShallow(s => ({
    libraryFolders: s.libraryFolders,
    promptFolders: s.promptFolders,
    items: s.items
  })));
  
  const [loading, setLoading] = useState(!user);
  
  // AI Fingerprint State (Mock usage percentages for visuals)
  const [modelUsage, setModelUsage] = useState({
    gpt: 45,
    claude: 30,
    gemini: 25,
  });
  
  // In-place editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savedField, setSavedField] = useState<'name' | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!user) {
        const supabaseUser = await getUser();
        if (supabaseUser) {
          setUser(supabaseUser);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [user, setUser]);

  useEffect(() => {
    if (user) {
      setNameInput(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Neural Entity');
    }
  }, [user]);

  const handleSaveName = () => {
    setIsEditingName(false);
    // Note: In real app, we would call a server action to update user metadata
    setSavedField('name');
    setTimeout(() => setSavedField(null), 1500);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  // Sphere colors based on AI Fingerprint
  const getSphereStyle = () => {
    const dominant = Object.entries(modelUsage).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'chatgpt';
    
    if (dominant === 'gemini' || modelUsage.gemini > 40) {
      return {
        core: 'bg-blue-500',
        glow: 'shadow-cyan-500/50',
        particles: 'bg-cyan-300',
        ring: 'border-blue-400/30',
        gradient: 'from-blue-500 to-cyan-400',
        bgGlow: 'bg-blue-500/20'
      };
    } else if (modelUsage.gpt > 30 && modelUsage.claude > 30) {
      return {
        core: 'bg-emerald-500',
        glow: 'shadow-amber-500/50',
        particles: 'bg-orange-400',
        ring: 'border-emerald-500/30',
        gradient: 'from-emerald-500 to-amber-500',
        bgGlow: 'bg-gradient-to-tr from-emerald-500/20 to-amber-500/20'
      };
    } else if (dominant === 'gpt') {
      return {
        core: 'bg-emerald-500',
        glow: 'shadow-emerald-500/50',
        particles: 'bg-green-400',
        ring: 'border-emerald-500/30',
        gradient: 'from-emerald-600 to-green-400',
        bgGlow: 'bg-emerald-500/20'
      };
    } else {
      return {
        core: 'bg-amber-500',
        glow: 'shadow-orange-500/50',
        particles: 'bg-orange-300',
        ring: 'border-amber-500/30',
        gradient: 'from-amber-500 to-orange-400',
        bgGlow: 'bg-amber-500/20'
      };
    }
  };

  const sphereColors = getSphereStyle();

  // Generate random particles for the sphere
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    angle: Math.random() * Math.PI * 2,
    radius: Math.random() * 60 + 40,
    speed: Math.random() * 2 + 1,
    delay: Math.random() * 2
  }));

  if (loading) return null;

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto relative no-scrollbar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full relative z-10 pb-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 sm:mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Fingerprint className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate uppercase">Identity Matrix</h1>
              <p className="text-white/50 text-xs font-mono tracking-widest uppercase">Neural signature and parameters.</p>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <LogOut className="w-3.5 h-3.5" /> Disconnect
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Sphere & Identity Details */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* The Identity Sphere */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center mb-12">
              <div className={`absolute inset-0 rounded-full blur-2xl sm:blur-3xl opacity-30 transition-all duration-1000 ${sphereColors.bgGlow}`} />
              <div className={`absolute inset-3 sm:inset-4 rounded-full border border-dashed transition-colors duration-1000 animate-[spin_20s_linear_infinite] ${sphereColors.ring}`} />
              <div className={`absolute inset-6 sm:inset-8 rounded-full border border-dotted transition-colors duration-1000 animate-[spin_15s_linear_infinite_reverse] ${sphereColors.ring}`} />
              
              <div className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-full transition-all duration-1000 ${sphereColors.core} ${sphereColors.glow} shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center`}>
                <div className="absolute inset-0 rounded-full bg-black/40 mix-blend-overlay" />
                <Fingerprint className="w-6 h-6 sm:w-10 sm:h-10 text-white/90 relative z-10" />
              </div>

              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className={`absolute rounded-full transition-colors duration-1000 ${sphereColors.particles}`}
                  style={{ width: p.size, height: p.size }}
                  animate={{
                    x: [Math.cos(p.angle) * p.radius, Math.cos(p.angle + Math.PI) * p.radius, Math.cos(p.angle) * p.radius],
                    y: [Math.sin(p.angle) * p.radius, Math.sin(p.angle + Math.PI) * p.radius, Math.sin(p.angle) * p.radius],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{ duration: p.speed * 4, repeat: Infinity, ease: "linear", delay: p.delay }}
                />
              ))}
            </div>

            {/* Name & Email */}
            <div className="w-full text-center space-y-4">
              <div className="relative inline-block group w-full">
                {isEditingName ? (
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="text-2xl sm:text-3xl font-bold tracking-tight bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-center w-full pb-1 uppercase"
                  />
                ) : (
                  <h2 
                    onClick={() => setIsEditingName(true)}
                    className={`text-2xl sm:text-3xl font-bold tracking-tight cursor-text transition-all duration-500 truncate px-4 uppercase ${
                      savedField === 'name' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-white hover:text-white/80'
                    }`}
                  >
                    {nameInput}
                  </h2>
                )}
              </div>
              <p className="text-white/40 text-xs font-mono tracking-widest truncate px-4 uppercase">{user?.email}</p>
            </div>

            {/* Neural Tier */}
            <div className="w-full mt-10 p-8 glass-panel rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
              <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${sphereColors.gradient} transition-all duration-1000`} />
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Neural Capacity</span>
                <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Quantum
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase font-mono tracking-widest">
                  <span>Charge State</span>
                  <span>84%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '84%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full shadow-[0_0_15px_currentColor] transition-colors duration-1000 ${sphereColors.core}`}
                  />
                </div>
                <p className="text-[10px] font-mono text-white/20 text-right uppercase tracking-tighter">84,500 / 100,000 cycles remaining</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Metrics & Connections */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] font-mono">Neural Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-all shadow-lg group">
                  <Box className="w-5 h-5 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">{items.length}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Synapses</div>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-all shadow-lg group">
                  <Layers className="w-5 h-5 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">{libraryFolders.length + promptFolders.length}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Patterns</div>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-all shadow-lg group">
                  <Globe className="w-5 h-5 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">{items.filter(i => i.type === 'capture').length}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Captures</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] font-mono">Synapse Integration</h3>
              <div className="space-y-3">
                {[{ icon: Chrome, name: 'Google Workspace', status: 'Active' }, { icon: Github, name: 'GitHub Universe', status: 'Active' }, { icon: Apple, name: 'Apple Ecosystem', status: 'None' }].map((conn, i) => (
                  <div key={conn.name} className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${conn.status === 'Active' ? 'bg-white/5 border-white/10 shadow-lg' : 'bg-transparent border-white/5 opacity-40'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${conn.status === 'Active' ? 'bg-white/10' : 'bg-black/20'}`}>
                        <conn.icon className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white uppercase tracking-widest">{conn.name}</p>
                        <p className="text-[10px] font-mono text-white/40 uppercase">{conn.status}</p>
                      </div>
                    </div>
                    {conn.status === 'Active' && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
