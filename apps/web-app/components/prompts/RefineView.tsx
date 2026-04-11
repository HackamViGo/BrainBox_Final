'use client'

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Wand2, Star, ArrowRight, Copy, Sparkles, X
} from 'lucide-react';
import { useScrollHint, ScrollHint } from './ScrollHint';
import { ApiKeyModal } from '../ApiKeyModal';
import { generateGeminiResponse } from '@/lib/gemini';
import { REFINE_CRYSTALS } from '@/lib/prompts-data';

interface RefineViewProps {
  onBack: () => void;
  initialInput?: string;
  onSave: (text: string) => void;
}

export function RefineView({ onBack, initialInput = '', onSave }: RefineViewProps) {
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState('');
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [waveColor, setWaveColor] = useState('bg-white');
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const showInputScrollHint = useScrollHint(inputRef, [input]);
  const showOutputScrollHint = useScrollHint(outputRef, [output]);

  const handleRefine = async (mode: any) => {
    if (!input) return;
    
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      setApiKeyModalOpen(true);
      return;
    }

    setActiveMode(mode.id);
    setWaveColor(mode.glow);
    setIsRefining(true);
    setOutput('');
    
    try {
      const prompt = `You are an expert prompt engineer. Your task is to refine the following raw text into a high-quality, professional AI prompt.
      
Mode: ${mode.label}
Description of mode: ${mode.desc}

Raw Text:
"""
${input}
"""

Please provide ONLY the final refined prompt. Do not include any explanations, greetings, or markdown code blocks unless they are part of the prompt itself.`;

      const result = await generateGeminiResponse(prompt, apiKey);
      
      setIsRefining(false);
      setOutput(result);
      
    } catch (error) {
      console.error("Error refining prompt:", error);
      setIsRefining(false);
      setOutput("Error: Failed to refine prompt. Please check your API key and try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const text = parsed.content || parsed.description || parsed.text;
        if (text) setInput(prev => prev ? `${prev}\n\n${text}` : text);
      } catch (err) {
        const text = e.dataTransfer.getData('text/plain');
        if (text) setInput(prev => prev ? `${prev}\n\n${text}` : text);
      }
    } else {
      const text = e.dataTransfer.getData('text/plain');
      if (text) setInput(prev => prev ? `${prev}\n\n${text}` : text);
    }
  };

  const handleResultToInput = () => {
    if (output) {
      setInput(output);
      setOutput('');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={onBack} className="p-3 glass-panel-light rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">Refine</h2>
          <p className="text-white/40">The 7-Way Optimizer</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 pb-8">
        <div className="lg:w-[40%] flex flex-col relative">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="glass-panel rounded-[2rem] p-6 flex-1 flex flex-col relative overflow-hidden group/input"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex justify-between items-center">
              Input (Paste & Drop)
              <span className="text-[10px] opacity-0 group-hover/input:opacity-100 transition-opacity">Drop prompt here</span>
            </h3>
            <textarea 
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full flex-1 bg-transparent border-none outline-none resize-none text-lg text-white placeholder-white/20 focus:outline-none"
              placeholder="Paste your raw thought, messy text, or capture here..."
            />
            <ScrollHint show={showInputScrollHint} />
          </div>
        </div>

        <div className="lg:w-[20%] flex flex-col justify-center items-center gap-4 py-4">
          {REFINE_CRYSTALS.map((crystal) => (
            <motion.button
              key={crystal.id}
              onClick={() => handleRefine(crystal)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-48 h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 ${
                activeMode === crystal.id ? 'bg-white/20' : 'glass-panel-light hover:bg-white/10'
              }`}
            >
              {activeMode === crystal.id && (
                <motion.div 
                  layoutId="active-crystal-glow"
                  className={`absolute inset-0 rounded-full ${crystal.shadow} shadow-[0_0_20px_currentColor] opacity-50`}
                  style={{ color: 'inherit' }}
                />
              )}
              <div className={`w-3 h-3 rounded-full ${crystal.color} shadow-[0_0_10px_currentColor]`} style={{ color: 'inherit' }} />
              <span className="font-bold tracking-wide">{crystal.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="lg:w-[40%] flex flex-col relative">
          <div className="glass-panel rounded-[2rem] p-6 flex-1 flex flex-col relative overflow-hidden">
            <AnimatePresence>
              {isRefining && (
                <motion.div 
                  initial={{ left: '-50%', opacity: 0 }}
                  animate={{ left: '150%', opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                  className={`absolute top-0 bottom-0 w-64 blur-[50px] ${waveColor} z-0 pointer-events-none`}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {output && !isRefining && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.2, scale: 1.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute inset-0 blur-[120px] ${waveColor} z-0 pointer-events-none`}
                />
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Final Polish</h3>
              {output && !isRefining && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => onSave(output)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold border border-amber-500/30"
                  >
                    <Star className="w-3 h-3" /> Save
                  </button>
                  <button 
                    onClick={handleResultToInput}
                    className="px-3 py-1.5 rounded-lg glass-panel-light hover:bg-white/10 transition-colors flex items-center gap-2 text-[10px] font-bold"
                  >
                    <ArrowRight className="w-3 h-3" /> Use as Input
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="p-2 rounded-lg glass-panel-light hover:bg-white/10 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div 
              draggable={!!output && !isRefining}
              onDragStart={(e) => {
                if (output) {
                  e.dataTransfer.setData('application/json', JSON.stringify({ content: output }));
                  e.dataTransfer.setData('text/plain', output);
                }
              }}
              className="flex-1 overflow-y-auto relative z-10 cursor-grab active:cursor-grabbing" 
              ref={outputRef}
            >
              {isRefining ? (
                <div className="h-full flex flex-col items-center justify-center gap-6">
                  <Sparkles className="w-12 h-12 text-white/20 animate-pulse" />
                  <p className="text-white/50 font-mono text-sm uppercase tracking-widest animate-pulse">Purifying Idea...</p>
                </div>
              ) : output ? (
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-white/90 leading-relaxed font-mono text-sm">{output}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <Wand2 className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-center max-w-xs">Select a crystal mode to transform your input into a powerful prompt.</p>
                </div>
              )}
            </div>
            <ScrollHint show={showOutputScrollHint} />
          </div>
        </div>
      </div>

      <ApiKeyModal />
    </div>
  );
}
