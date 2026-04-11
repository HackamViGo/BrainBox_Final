'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Save, X, Zap } from 'lucide-react';

export function WhisperPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('brainbox_whisper_note');
    if (saved) setNote(saved);
  }, []);

  // Save to localStorage
  const saveNote = () => {
    localStorage.setItem('brainbox_whisper_note', note);
  };

  // Auto-save when closing or typing (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(saveNote, 1000);
    return () => clearTimeout(timeoutId);
  }, [note]);

  // Voice-to-Ink Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setNote((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Restart failed', e);
          }
        }
      };
    }
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <>
      <motion.div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 cursor-pointer group"
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: isOpen ? 20 : 0 }}
      >
        <div className="w-1.5 h-32 bg-white/10 rounded-l-full group-hover:bg-white/30 transition-colors relative shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <motion.div
            className="absolute inset-0 bg-white/40 rounded-l-full blur-sm"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] glass-panel z-[70] flex flex-col border-l border-white/10 shadow-2xl shadow-black/50"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">The Whisper</h2>
                  <p className="text-xs text-white/40">Quick notes & Voice-to-Ink</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-white/50" />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <textarea
                  className="flex-1 bg-transparent border-none outline-none resize-none text-white/90 placeholder-white/20 text-lg leading-relaxed"
                  placeholder="Whisper your thoughts here..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="p-6 border-t border-white/10 flex items-center justify-between bg-black/20">
                <button
                  onClick={toggleListening}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isListening 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                  <span className="text-sm font-medium">{isListening ? 'Listening...' : 'Voice-to-Ink'}</span>
                </button>

                <button
                  onClick={() => {
                    saveNote();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                >
                  <Save className="w-4 h-4" />
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
