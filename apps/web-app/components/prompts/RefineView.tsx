'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Wand2, Star, ArrowRight, Copy, Sparkles } from 'lucide-react';
import { useScrollHint, ScrollHint } from './ScrollHint';
import { ApiKeyModal } from '../ApiKeyModal';
import { generateGeminiResponse } from '@/lib/gemini';
import { REFINE_CRYSTALS } from '@/lib/prompts-data';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@brainbox/utils';

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

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const showInputScrollHint = useScrollHint(inputRef, [input]);
  const showOutputScrollHint = useScrollHint(outputRef, [output]);

  const handleRefine = async (mode: { id: string; label: string; desc: string; glow: string }) => {
    if (!input) return;

    // API key stored in Zustand store (not raw localStorage)
    const apiKey = useAppStore.getState().getApiKey('gemini');
    if (!apiKey) {
      useAppStore.getState().setModalOpen('apiKey', true, { id: 'gemini', name: 'Gemini' });
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
      logger.error('RefineView', 'handleRefine failed', error);
      setIsRefining(false);
      setOutput('Error: Failed to refine prompt. Please check your API key and try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const text = parsed.content || parsed.description || parsed.text;
        if (text) setInput((prev) => (prev ? `${prev}\n\n${text}` : text));
      } catch {
        const text = e.dataTransfer.getData('text/plain');
        if (text) setInput((prev) => (prev ? `${prev}\n\n${text}` : text));
      }
    } else {
      const text = e.dataTransfer.getData('text/plain');
      if (text) setInput((prev) => (prev ? `${prev}\n\n${text}` : text));
    }
  };

  const handleResultToInput = () => {
    if (output) {
      setInput(output);
      setOutput('');
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col">
      <div className="mb-8 flex shrink-0 items-center gap-4">
        <button
          onClick={onBack}
          className="glass-panel-light rounded-xl p-3 transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">Refine</h2>
          <p className="text-white/40">The 7-Way Optimizer</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-8 pb-8 lg:flex-row">
        <div className="relative flex flex-col lg:w-[40%]">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="glass-panel group/input relative flex flex-1 flex-col overflow-hidden rounded-4xl p-6"
          >
            <h3 className="mb-4 flex items-center justify-between text-sm font-bold tracking-widest text-white/40 uppercase">
              Input (Paste & Drop)
              <span className="text-[10px] opacity-0 transition-opacity group-hover/input:opacity-100">
                Drop prompt here
              </span>
            </h3>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full flex-1 resize-none border-none bg-transparent text-lg text-white placeholder-white/20 outline-none focus:outline-none"
              placeholder="Paste your raw thought, messy text, or capture here..."
            />
            <ScrollHint show={showInputScrollHint} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-4 lg:w-[20%]">
          {REFINE_CRYSTALS.map((crystal) => (
            <motion.button
              key={crystal.id}
              onClick={() => handleRefine(crystal)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex h-14 w-48 items-center justify-center gap-3 rounded-full transition-all duration-300 ${
                activeMode === crystal.id ? 'bg-white/20' : 'glass-panel-light hover:bg-white/10'
              }`}
            >
              {activeMode === crystal.id && (
                <motion.div
                  layoutId="active-crystal-glow"
                  className={`absolute inset-0 rounded-full ${crystal.shadow} opacity-50 shadow-[0_0_20px_currentColor]`}
                  style={{ color: 'inherit' }}
                />
              )}
              <div
                className={`h-3 w-3 rounded-full ${crystal.color} shadow-[0_0_10px_currentColor]`}
                style={{ color: 'inherit' }}
              />
              <span className="font-bold tracking-wide">{crystal.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="relative flex flex-col lg:w-[40%]">
          <div className="glass-panel relative flex flex-1 flex-col overflow-hidden rounded-4xl p-6">
            <AnimatePresence>
              {isRefining && (
                <motion.div
                  initial={{ left: '-50%', opacity: 0 }}
                  animate={{ left: '150%', opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
                  className={`absolute top-0 bottom-0 w-64 blur-[50px] ${waveColor} pointer-events-none z-0`}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {output && !isRefining && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.2, scale: 1.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className={`absolute inset-0 blur-[120px] ${waveColor} pointer-events-none z-0`}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase">
                Final Polish
              </h3>
              {output && !isRefining && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onSave(output)}
                    className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/20 px-3 py-1.5 text-[10px] font-bold text-amber-300 transition-colors hover:bg-amber-500/40 hover:text-white"
                  >
                    <Star className="h-3 w-3" /> Save
                  </button>
                  <button
                    onClick={handleResultToInput}
                    className="glass-panel-light flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors hover:bg-white/10"
                  >
                    <ArrowRight className="h-3 w-3" /> Use as Input
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="glass-panel-light rounded-lg p-2 transition-colors hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4" />
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
              className="relative z-10 flex-1 cursor-grab overflow-y-auto active:cursor-grabbing"
              ref={outputRef}
            >
              {isRefining ? (
                <div className="flex h-full flex-col items-center justify-center gap-6">
                  <Sparkles className="h-12 w-12 animate-pulse text-white/20" />
                  <p className="animate-pulse font-mono text-sm tracking-widest text-white/50 uppercase">
                    Purifying Idea...
                  </p>
                </div>
              ) : output ? (
                <div className="prose prose-invert max-w-none">
                  <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-white/90">
                    {output}
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-white/20">
                  <Wand2 className="mb-4 h-16 w-16 opacity-30" />
                  <p className="max-w-xs text-center">
                    Select a crystal mode to transform your input into a powerful prompt.
                  </p>
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
