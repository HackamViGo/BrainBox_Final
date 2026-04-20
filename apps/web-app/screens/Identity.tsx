'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Fingerprint,
  Github,
  Apple,
  Chrome,
  Box,
  Layers,
  Globe,
  LogOut,
} from 'lucide-react';
import { getUser, signOut } from '@/actions/auth';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useShallow } from 'zustand/react/shallow';

export function Identity() {
  const { user, setUser } = useAppStore(useShallow((s) => ({ user: s.user, setUser: s.setUser })));
  const { libraryFolders, promptFolders, items } = useLibraryStore(
    useShallow((s) => ({
      libraryFolders: s.libraryFolders,
      promptFolders: s.promptFolders,
      items: s.items,
    }))
  );

  const [loading, setLoading] = useState(!user);

  // AI Fingerprint State (Mock usage percentages for visuals)
  const [modelUsage] = useState({
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
    const dominant =
      Object.entries(modelUsage).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] ||
      'chatgpt';

    if (dominant === 'gemini' || modelUsage.gemini > 40) {
      return {
        core: 'bg-blue-500',
        glow: 'shadow-cyan-500/50',
        particles: 'bg-cyan-300',
        ring: 'border-blue-400/30',
        gradient: 'from-blue-500 to-cyan-400',
        bgGlow: 'bg-blue-500/20',
      };
    } else if (modelUsage.gpt > 30 && modelUsage.claude > 30) {
      return {
        core: 'bg-emerald-500',
        glow: 'shadow-amber-500/50',
        particles: 'bg-orange-400',
        ring: 'border-emerald-500/30',
        gradient: 'from-emerald-500 to-amber-500',
        bgGlow: 'bg-gradient-to-tr from-emerald-500/20 to-amber-500/20',
      };
    } else if (dominant === 'gpt') {
      return {
        core: 'bg-emerald-500',
        glow: 'shadow-emerald-500/50',
        particles: 'bg-green-400',
        ring: 'border-emerald-500/30',
        gradient: 'from-emerald-600 to-green-400',
        bgGlow: 'bg-emerald-500/20',
      };
    } else {
      return {
        core: 'bg-amber-500',
        glow: 'shadow-orange-500/50',
        particles: 'bg-orange-300',
        ring: 'border-amber-500/30',
        gradient: 'from-amber-500 to-orange-400',
        bgGlow: 'bg-amber-500/20',
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
    delay: Math.random() * 2,
  }));

  if (loading) return null;

  return (
    <div className="no-scrollbar relative flex h-full flex-col overflow-y-auto p-4 sm:p-8 lg:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto w-full max-w-4xl pb-20"
      >
        <div className="mb-8 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:h-12 sm:w-12">
              <Fingerprint className="h-5 w-5 text-white/70 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight uppercase sm:text-3xl">
                Identity Matrix
              </h1>
              <p className="font-mono text-xs tracking-widest text-white/50 uppercase">
                Neural signature and parameters.
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase transition-all hover:bg-red-500/20"
          >
            <LogOut className="h-3.5 w-3.5" /> Disconnect
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT COLUMN: Sphere & Identity Details */}
          <div className="flex flex-col items-center lg:col-span-5">
            {/* The Identity Sphere */}
            <div className="relative mb-12 flex h-48 w-48 items-center justify-center sm:h-64 sm:w-64">
              <div
                className={`absolute inset-0 rounded-full opacity-30 blur-2xl transition-all duration-1000 sm:blur-3xl ${sphereColors.bgGlow}`}
              />
              <div
                className={`absolute inset-3 animate-[spin_20s_linear_infinite] rounded-full border border-dashed transition-colors duration-1000 sm:inset-4 ${sphereColors.ring}`}
              />
              <div
                className={`absolute inset-6 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-dotted transition-colors duration-1000 sm:inset-8 ${sphereColors.ring}`}
              />

              <div
                className={`relative h-16 w-16 rounded-full transition-all duration-1000 sm:h-24 sm:w-24 ${sphereColors.core} ${sphereColors.glow} flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)]`}
              >
                <div className="absolute inset-0 rounded-full bg-black/40 mix-blend-overlay" />
                <Fingerprint className="relative z-10 h-6 w-6 text-white/90 sm:h-10 sm:w-10" />
              </div>

              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className={`absolute rounded-full transition-colors duration-1000 ${sphereColors.particles}`}
                  style={{ width: p.size, height: p.size }}
                  animate={{
                    x: [
                      Math.cos(p.angle) * p.radius,
                      Math.cos(p.angle + Math.PI) * p.radius,
                      Math.cos(p.angle) * p.radius,
                    ],
                    y: [
                      Math.sin(p.angle) * p.radius,
                      Math.sin(p.angle + Math.PI) * p.radius,
                      Math.sin(p.angle) * p.radius,
                    ],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: p.speed * 4,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: p.delay,
                  }}
                />
              ))}
            </div>

            {/* Name & Email */}
            <div className="w-full space-y-4 text-center">
              <div className="group relative inline-block w-full">
                {isEditingName ? (
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="w-full border-b border-white/20 bg-transparent pb-1 text-center text-2xl font-bold tracking-tight uppercase outline-none focus:border-cyan-400 sm:text-3xl"
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditingName(true)}
                    className={`cursor-text truncate px-4 text-2xl font-bold tracking-tight uppercase transition-all duration-500 sm:text-3xl ${
                      savedField === 'name'
                        ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    {nameInput}
                  </h2>
                )}
              </div>
              <p className="truncate px-4 font-mono text-xs tracking-widest text-white/40 uppercase">
                {user?.email}
              </p>
            </div>

            {/* Neural Tier */}
            <div className="glass-panel relative mt-10 w-full overflow-hidden rounded-3xl border border-white/5 p-8 shadow-2xl">
              <div
                className={`absolute top-0 left-0 h-[2px] w-full bg-linear-to-r ${sphereColors.gradient} transition-all duration-1000`}
              />

              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                  Neural Capacity
                </span>
                <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
                  Quantum
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase">
                  <span>Charge State</span>
                  <span>84%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '84%' }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={`h-full rounded-full shadow-[0_0_15px_currentColor] transition-colors duration-1000 ${sphereColors.core}`}
                  />
                </div>
                <p className="text-right font-mono text-[10px] tracking-tighter text-white/20 uppercase">
                  84,500 / 100,000 cycles remaining
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Metrics & Connections */}
          <div className="space-y-8 lg:col-span-7">
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">
                Neural Metrics
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="glass-panel group rounded-2xl border border-white/5 p-6 shadow-lg transition-all hover:bg-white/3">
                  <Box className="mb-4 h-5 w-5 text-indigo-400 transition-transform group-hover:scale-110" />
                  <div className="mb-1 text-3xl font-bold text-white">{items.length}</div>
                  <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                    Synapses
                  </div>
                </div>

                <div className="glass-panel group rounded-2xl border border-white/5 p-6 shadow-lg transition-all hover:bg-white/3">
                  <Layers className="mb-4 h-5 w-5 text-emerald-400 transition-transform group-hover:scale-110" />
                  <div className="mb-1 text-3xl font-bold text-white">
                    {libraryFolders.length + promptFolders.length}
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                    Patterns
                  </div>
                </div>

                <div className="glass-panel group rounded-2xl border border-white/5 p-6 shadow-lg transition-all hover:bg-white/3">
                  <Globe className="mb-4 h-5 w-5 text-amber-400 transition-transform group-hover:scale-110" />
                  <div className="mb-1 text-3xl font-bold text-white">
                    {items.filter((i) => i.type === 'capture').length}
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                    Captures
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">
                Synapse Integration
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Chrome, name: 'Google Workspace', status: 'Active' },
                  { icon: Github, name: 'GitHub Universe', status: 'Active' },
                  { icon: Apple, name: 'Apple Ecosystem', status: 'None' },
                ].map((conn) => (
                  <div
                    key={conn.name}
                    className={`flex items-center justify-between rounded-2xl border p-5 transition-all ${conn.status === 'Active' ? 'border-white/10 bg-white/5 shadow-lg' : 'border-white/5 bg-transparent opacity-40'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${conn.status === 'Active' ? 'bg-white/10' : 'bg-black/20'}`}
                      >
                        <conn.icon className="h-5 w-5 text-white/70" />
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-widest text-white uppercase">
                          {conn.name}
                        </p>
                        <p className="font-mono text-[10px] text-white/40 uppercase">
                          {conn.status}
                        </p>
                      </div>
                    </div>
                    {conn.status === 'Active' && (
                      <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                    )}
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
