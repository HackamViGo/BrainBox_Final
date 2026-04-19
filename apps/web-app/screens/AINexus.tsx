'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  MoreVertical, Save, 
  Send, Download,
  Zap
} from 'lucide-react';
import { generateGeminiResponse, generateBasicResponse } from '@/lib/gemini';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { SmartSwitchModal } from '../components/SmartSwitchModal';
import { MODELS } from '@brainbox/types';
import { getUser } from '@/actions/auth';
import { useAppStore } from '@/store/useAppStore';
import { useAINexusStore } from '@/store/useAINexusStore';
import { useShallow } from 'zustand/react/shallow';
import { logger } from '@brainbox/utils';
import type { User } from '@supabase/supabase-js';


interface BrainBoxModel {
  id: string;
  name: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  glow: string;
  text: string;
  gradient: string;
}

export function AINexus() {
  const { 
    activeModelId, 
    setActiveModelId
  } = useAppStore(useShallow(s => ({
    activeModelId: s.activeModelId,
    setActiveModelId: s.setActiveModelId
  })));

  const {
    messages,
    setMessages,
    addMessage,
    isGenerating,
    setIsGenerating,
    modelVersion,
    setModelVersion
  } = useAINexusStore(useShallow(s => ({
    messages: s.messages,
    setMessages: s.setMessages,
    addMessage: s.addMessage,
    isGenerating: s.isGenerating,
    setIsGenerating: s.setIsGenerating,
    modelVersion: s.modelVersion,
    setModelVersion: s.setModelVersion
  })));


  const [input, setInput] = useState('');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeModel = (MODELS.find(m => m.id === activeModelId) || MODELS[0]) as BrainBoxModel;


  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isGenerating]);

  useEffect(() => {
    // API key presence is managed by useAppStore — check via store, not localStorage directly
    const key = useAppStore.getState().getApiKey(activeModelId)
    setModelVersion(key ? 'latest' : 'basic')
  }, [activeModelId, setModelVersion])

  const handleVersionSwitch = (version: 'basic' | 'latest') => {
    if (version === 'latest') {
      const key = useAppStore.getState().getApiKey(activeModelId)
      if (key) setModelVersion('latest')
      else {
        useAppStore.getState().setApiKeyModel(activeModelId, activeModel.name);
        useAppStore.getState().setModalOpen('apiKey', true);
      }
    } else {
      setModelVersion('basic');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMsg = input.trim();
    setInput('');
    addMessage({ id: Date.now().toString(), role: 'user', content: userMsg });
    setIsGenerating(true);

    try {
      if (modelVersion === 'latest') {
        const apiKey = useAppStore.getState().getApiKey(activeModelId)
        
        if (!apiKey) {
          useAppStore.getState().setApiKeyModel(activeModelId, activeModel.name);
          useAppStore.getState().setModalOpen('apiKey', true);
          setMessages(messages.slice(0, -1));
          setIsGenerating(false);
          return;
        }

        if (activeModelId === 'gemini') {
          const content = await generateGeminiResponse(userMsg, apiKey);
          
          addMessage({ id: Date.now().toString(), role: 'assistant', content });
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const response = `I am ${activeModel.name}. Neural synchronization complete. [SIMULATED_RESPONSE]`;
          addMessage({ id: Date.now().toString(), role: 'assistant', content: response });
        }
      } else {
        const response = await generateBasicResponse(userMsg, activeModel.name);
        addMessage({ id: Date.now().toString(), role: 'assistant', content: response });
      }
    } catch (err: any) {
      logger.error('AINexus', 'Generation failed', err);
      addMessage({ id: Date.now().toString(), role: 'assistant', content: 'Error: Connection lost. Re-synchronizing...' });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="h-full relative overflow-hidden flex bg-transparent text-white transition-colors duration-1000 no-scrollbar">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${activeModel?.gradient || ''} opacity-10 transition-all duration-1000 pointer-events-none`} />

      {/* Center Panel */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 min-h-0">
        
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-8 bg-transparent shrink-0 z-20 border-b border-white/5">
          <div className="flex items-center gap-4 group cursor-pointer overflow-hidden">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeModel?.gradient || ''} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 shrink-0`}>
              {activeModel && React.createElement(activeModel.icon, { className: "w-5 h-5 text-white" })}
            </div>
            <div className="transition-transform duration-300 group-hover:translate-x-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-widest text-white/90 truncate uppercase">{activeModel?.name}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
              </div>
              <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold truncate block">Nexus Synthesis</span>
            </div>
            
            {/* Version Toggle */}
            <div className="hidden sm:flex ml-8 items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => handleVersionSwitch('basic')}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${modelVersion === 'basic' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                Basic
              </button>
              <button 
                onClick={() => handleVersionSwitch('latest')}
                className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${modelVersion === 'latest' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <Zap className="w-3 h-3 text-yellow-500" /> Latest
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-widest">Neural Stable</span>
             </div>
            <button className="text-white/20 hover:text-white transition-colors"><Save className="w-4 h-4" /></button>
            <button className="text-white/20 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-8 custom-scrollbar min-h-0 no-scrollbar"
        >
          <div className="max-w-4xl mx-auto space-y-10 pb-4">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-black/60 border border-white/10 rounded-3xl rounded-tr-sm shadow-2xl' 
                    : `bg-black/40 border border-white/5 rounded-3xl rounded-tl-sm backdrop-blur-xl ${activeModel?.glow || ''} shadow-2xl`
                } p-6 relative group`}
                >
                  {msg.isCode ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">Synthesized Block</span>
                        <button className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white text-black transition-all text-[10px] font-bold uppercase tracking-widest hover:bg-white/90">
                          <Download className="w-3.5 h-3.5" /> Export to Workspace
                        </button>
                      </div>
                      <pre className="font-mono text-xs sm:text-sm text-white/80 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {msg.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base selection:bg-white/20">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className={`bg-black/40 border border-white/5 rounded-3xl rounded-tl-sm p-6 flex items-center gap-4 ${activeModel?.glow || ''} shadow-2xl backdrop-blur-xl`}>
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin opacity-50 ${activeModel?.text || ''}`} />
                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_15px_currentColor] ${activeModel?.text || ''}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${activeModel?.text || ''} animate-pulse font-mono`}>Synthesis in progress</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="relative shrink-0 p-8 pt-4">
          <div className="max-w-4xl mx-auto relative group">
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${activeModel?.gradient || ''} opacity-10 blur-3xl pointer-events-none group-focus-within:opacity-20 transition-opacity`} />
            <div className={`relative rounded-3xl p-3 border transition-all duration-500 overflow-hidden flex items-end gap-3 bg-black/60 backdrop-blur-3xl ${activeModel?.border || ''}`}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Synchronize your thoughts..."
                className="flex-1 bg-transparent resize-none max-h-48 min-h-[48px] p-3 text-sm sm:text-base text-white placeholder-white/20 focus:outline-none custom-scrollbar"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl ${
                  input.trim() && !isGenerating 
                    ? `${activeModel?.bg || ''} ${activeModel?.text || ''} scale-100` 
                    : 'bg-white/5 text-white/10 cursor-not-allowed scale-95 opacity-50'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-4">
              <span className="text-[10px] font-bold font-mono text-white/20 uppercase tracking-[0.4em]">Nexus Interface • v4.2.0-Alpha</span>
            </div>
          </div>
        </div>
      </div>

      <SmartSwitchModal />

      <ApiKeyModal />
    </div>
  );
}
