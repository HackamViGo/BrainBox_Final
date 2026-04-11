import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Github, Apple, Chrome, CheckCircle2, Zap, Code2, Palette, Box, Layers, Globe } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_USER = {
  name: 'Alex Mercer',
  email: 'alex.mercer@nexus.dev',
  tier: 'Quantum', // Neural, Quantum, Supernova
  tokensRemaining: 84500,
  totalTokens: 100000,
  synapses: 124,
  frameworks: 18,
  captures: 42,
  connections: {
    google: true,
    github: true,
    apple: false
  }
};

export function Identity() {
  const [user, setUser] = useState(INITIAL_USER);
  
  // AI Fingerprint State (Mock usage percentages)
  const [modelUsage, setModelUsage] = useState({
    gpt: 45,
    claude: 30,
    gemini: 25,
  });
  
  // In-place editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [savedField, setSavedField] = useState<'name' | 'email' | null>(null);

  const handleSaveName = () => {
    setIsEditingName(false);
    if (nameInput !== user.name) {
      setUser(prev => ({ ...prev, name: nameInput }));
      setSavedField('name');
      setTimeout(() => setSavedField(null), 1500);
    }
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
    if (emailInput !== user.email) {
      setUser(prev => ({ ...prev, email: emailInput }));
      setSavedField('email');
      setTimeout(() => setSavedField(null), 1500);
    }
  };

  // Sphere colors based on AI Fingerprint
  // GPT: Emerald/Green, Claude: Amber/Orange, Gemini: Blue/Cyan
  const getSphereStyle = () => {
    const dominant = Object.entries(modelUsage).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0];
    
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

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 lg:p-12 overflow-y-auto relative">
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
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Identity</h1>
              <p className="text-white/50 text-sm truncate">Core parameters and neural connections.</p>
            </div>
          </div>

          {/* AI Fingerprint Controls (Mock) */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit overflow-x-auto no-scrollbar">
            <button
              onClick={() => setModelUsage({ gpt: 60, claude: 20, gemini: 20 })}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                modelUsage.gpt > 50 ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/40 hover:text-white'
              }`}
            >
              GPT Focus
            </button>
            <button
              onClick={() => setModelUsage({ gpt: 40, claude: 40, gemini: 20 })}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                modelUsage.claude > 30 && modelUsage.gpt > 30 ? 'bg-amber-500/20 text-amber-300' : 'text-white/40 hover:text-white'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => setModelUsage({ gpt: 20, claude: 20, gemini: 60 })}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                modelUsage.gemini > 50 ? 'bg-blue-500/20 text-blue-300' : 'text-white/40 hover:text-white'
              }`}
            >
              Gemini Focus
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Sphere & Identity Details */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* The Identity Sphere */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center mb-8">
              {/* Core Glow */}
              <div className={`absolute inset-0 rounded-full blur-2xl sm:blur-3xl opacity-30 transition-all duration-1000 ${sphereColors.bgGlow}`} />
              
              {/* Orbital Rings */}
              <div className={`absolute inset-3 sm:inset-4 rounded-full border border-dashed transition-colors duration-1000 animate-[spin_20s_linear_infinite] ${sphereColors.ring}`} />
              <div className={`absolute inset-6 sm:inset-8 rounded-full border border-dotted transition-colors duration-1000 animate-[spin_15s_linear_infinite_reverse] ${sphereColors.ring}`} />
              
              {/* Center Core */}
              <div className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-full transition-all duration-1000 ${sphereColors.core} ${sphereColors.glow} shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center`}>
                <div className="absolute inset-0 rounded-full bg-black/40 mix-blend-overlay" />
                <Fingerprint className="w-6 h-6 sm:w-10 sm:h-10 text-white/90 relative z-10" />
              </div>

              {/* Particles */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className={`absolute rounded-full transition-colors duration-1000 ${sphereColors.particles}`}
                  style={{
                    width: p.size,
                    height: p.size,
                  }}
                  animate={{
                    x: [
                      Math.cos(p.angle) * (p.radius - 10),
                      Math.cos(p.angle + Math.PI) * (p.radius + 10),
                      Math.cos(p.angle) * (p.radius - 10)
                    ],
                    y: [
                      Math.sin(p.angle) * (p.radius - 10),
                      Math.sin(p.angle + Math.PI) * (p.radius + 10),
                      Math.sin(p.angle) * (p.radius - 10)
                    ],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{
                    duration: p.speed * 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: p.delay
                  }}
                />
              ))}
            </div>

            {/* Zen Edit: Name & Email */}
            <div className="w-full text-center space-y-4">
              <div className="relative inline-block group w-full max-w-[280px] sm:max-w-none">
                {isEditingName ? (
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="text-2xl sm:text-3xl font-bold tracking-tight bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-center w-full pb-1"
                  />
                ) : (
                  <h2 
                    onClick={() => setIsEditingName(true)}
                    className={`text-2xl sm:text-3xl font-bold tracking-tight cursor-text transition-colors duration-500 truncate px-4 ${
                      savedField === 'name' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-white hover:text-white/80'
                    }`}
                  >
                    {user.name}
                  </h2>
                )}
                {savedField === 'name' && (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </motion.div>
                )}
              </div>

              <div className="relative inline-block group w-full max-w-[280px] sm:max-w-none">
                {isEditingEmail ? (
                  <input
                    autoFocus
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onBlur={handleSaveEmail}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEmail()}
                    className="text-sm sm:text-base text-white/50 bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-center w-full pb-1"
                  />
                ) : (
                  <p 
                    onClick={() => setIsEditingEmail(true)}
                    className={`cursor-text transition-colors duration-500 text-sm sm:text-base truncate px-4 ${
                      savedField === 'email' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    {user.email}
                  </p>
                )}
                {savedField === 'email' && (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Intelligence Tier & Usage Gauge */}
            <div className="w-full mt-10 p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sphereColors.gradient} transition-all duration-1000`} />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-white/50 uppercase tracking-wider font-mono">Current Core</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                  user.tier === 'Quantum' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  user.tier === 'Supernova' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  'bg-white/10 text-white/70 border border-white/20'
                }`}>
                  {user.tier}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/50 font-mono">
                  <span>Energy Charge</span>
                  <span>{Math.round((user.tokensRemaining / user.totalTokens) * 100)}%</span>
                </div>
                {/* Usage Gauge */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.tokensRemaining / user.totalTokens) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-1000 ${sphereColors.core}`}
                  />
                </div>
                <p className="text-[10px] text-white/30 text-right mt-1">{user.tokensRemaining.toLocaleString()} / {user.totalTokens.toLocaleString()} cycles</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Metrics & Connections */}
          <div className="lg:col-span-7 space-y-6 lg:pl-8 lg:pt-8">
            
            {/* Contribution Metrics */}
            <h3 className="text-[10px] sm:text-sm font-mono text-white/40 uppercase tracking-widest mb-4">Contribution Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-colors">
                <Box className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{user.synapses}</div>
                <div className="text-[10px] sm:text-xs text-white/50">Total Synapses</div>
              </div>
              
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-colors">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{user.frameworks}</div>
                <div className="text-[10px] sm:text-xs text-white/50">Frameworks Mastered</div>
              </div>
              
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-colors">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{user.captures}</div>
                <div className="text-[10px] sm:text-xs text-white/50">Web Captures</div>
              </div>
            </div>

            {/* Synapse Connections */}
            <h3 className="text-[10px] sm:text-sm font-mono text-white/40 uppercase tracking-widest mb-4">Synapse Connections</h3>
            <div className="space-y-3">
              
              <div className={`p-3 sm:p-4 rounded-2xl border flex items-center justify-between transition-all ${
                user.connections.google ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-50'
              }`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${user.connections.google ? 'bg-white/10' : 'bg-white/5'}`}>
                    <Chrome className={`w-4 h-4 sm:w-5 sm:h-5 ${user.connections.google ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-medium text-sm sm:text-base truncate ${user.connections.google ? 'text-white' : 'text-white/50'}`}>Google</p>
                    <p className="text-[10px] sm:text-xs text-white/40">{user.connections.google ? 'Connected' : 'Disconnected'}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${user.connections.google ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`} />
              </div>

              <div className={`p-3 sm:p-4 rounded-2xl border flex items-center justify-between transition-all ${
                user.connections.github ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-50'
              }`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${user.connections.github ? 'bg-white/10' : 'bg-white/5'}`}>
                    <Github className={`w-4 h-4 sm:w-5 sm:h-5 ${user.connections.github ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-medium text-sm sm:text-base truncate ${user.connections.github ? 'text-white' : 'text-white/50'}`}>GitHub</p>
                    <p className="text-[10px] sm:text-xs text-white/40">{user.connections.github ? 'Connected' : 'Disconnected'}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${user.connections.github ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`} />
              </div>

              <div className={`p-3 sm:p-4 rounded-2xl border flex items-center justify-between transition-all ${
                user.connections.apple ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-50'
              }`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${user.connections.apple ? 'bg-white/10' : 'bg-white/5'}`}>
                    <Apple className={`w-4 h-4 sm:w-5 sm:h-5 ${user.connections.apple ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-medium text-sm sm:text-base truncate ${user.connections.apple ? 'text-white' : 'text-white/50'}`}>Apple</p>
                    <p className="text-[10px] sm:text-xs text-white/40">{user.connections.apple ? 'Connected' : 'Disconnected'}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${user.connections.apple ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`} />
              </div>

            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
