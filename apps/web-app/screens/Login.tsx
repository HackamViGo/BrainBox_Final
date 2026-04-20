'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Mail, Lock, ChevronRight, Sparkles, Shield, Zap } from 'lucide-react';
import { signIn } from '@/actions/auth';
import { useAppStore } from '@/store/useAppStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setIsLoggedIn = useAppStore(s => s.setIsLoggedIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      setIsLoggedIn(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-20 h-20 rounded-3xl bg-linear-to-br from-blue-500 to-purple-600 p-0.5 mx-auto mb-6 shadow-2xl shadow-blue-500/20"
          >
            <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">BrainBox</h1>
          <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em]">Neural Operating System</p>
        </div>

        <div className="glass-panel border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Identity (Email)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@neural.link"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Access Key (Password)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-[10px] font-bold text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20 uppercase tracking-widest"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Session
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
            <button className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/60 transition-colors">
              Forgot Key?
            </button>
            <button className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">
              Create Identity
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: Shield, label: 'Encrypted' },
            { icon: Zap, label: 'Real-time' },
            { icon: Sparkles, label: 'AI Native' }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-default">
              <feature.icon className="w-5 h-5 text-white" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-white">{feature.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em]">v2.0.0-next-stable</p>
      </div>
    </div>
  );
}
