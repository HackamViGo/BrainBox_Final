'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Save, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@brainbox/utils';

export function WhisperPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<unknown>(null);

  // Load from Zustand store (persisted) — NOT raw localStorage
  useEffect(() => {
    const saved = useAppStore.getState().getApiKey('__whisper_note');
    if (saved) setNote(saved);
  }, []);

  // Save to Zustand store
  const saveNote = useCallback(() => {
    useAppStore.getState().setApiKey('__whisper_note', note);
  }, [note]);

  // Auto-save when closing or typing (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(saveNote, 1000);
    return () => clearTimeout(timeoutId);
  }, [note, saveNote]);

  // Voice-to-Ink Setup
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition: new () => unknown }).SpeechRecognition || 
        (window as unknown as { webkitSpeechRecognition: new () => unknown }).webkitSpeechRecognition;
      
      const recognition = new SpeechRecognition() as {
        continuous: boolean;
        interimResults: boolean;
        onresult: (e: unknown) => void;
        onerror: (e: unknown) => void;
        onend: () => void;
        start: () => void;
        stop: () => void;
      };
      
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: unknown) => {
        const e = event as { resultIndex: number; results: { isFinal: boolean; [key: number]: { transcript: string } }[] };
        let finalTranscript = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          const result = e.results[i];
          if (result?.isFinal) {
            finalTranscript += result[0]?.transcript || '';
          }
        }
        if (finalTranscript) {
          setNote((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: unknown) => {
        const e = event as { error: string };
        logger.error('WhisperPanel', 'Speech recognition error', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {
            logger.error('WhisperPanel', 'Speech recognition restart failed', e);
          }
        }
      };
    }
  }, [isListening]);

  const toggleListening = () => {
    const recognition = recognitionRef.current as { start: () => void; stop: () => void } | null;
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  return (
    <>
      <motion.div
        className="group fixed top-1/2 right-0 z-50 -translate-y-1/2 cursor-pointer"
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: isOpen ? 20 : 0 }}
      >
        <div className="relative h-32 w-1.5 rounded-l-full bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors group-hover:bg-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <motion.div
            className="absolute inset-0 rounded-l-full bg-white/40 blur-sm"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-panel fixed top-0 right-0 bottom-0 z-70 flex w-full flex-col border-l border-white/10 shadow-2xl shadow-black/50 sm:w-[400px]"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">The Whisper</h2>
                  <p className="text-xs text-white/40">Quick notes & Voice-to-Ink</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 transition-colors hover:bg-white/10"
                >
                  <X className="h-5 w-5 text-white/50" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <textarea
                  className="flex-1 resize-none border-none bg-transparent text-lg leading-relaxed text-white/90 placeholder-white/20 outline-none"
                  placeholder="Whisper your thoughts here..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-black/20 p-6">
                <button
                  onClick={toggleListening}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                    isListening
                      ? 'border border-red-500/30 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'border border-white/5 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isListening ? (
                    <Mic className="h-4 w-4 animate-pulse" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isListening ? 'Listening...' : 'Voice-to-Ink'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    saveNote();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm font-medium">Save</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
