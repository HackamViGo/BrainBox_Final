import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, MoreVertical, Pin, Save, Edit2, Trash2, 
  Send, Sparkles, Code, Download, Cpu, BrainCircuit, 
  GitBranch, Plus, X, ArrowRight, Network, Globe,
  Bot, Eye, Compass, Swords, Telescope, Cloud, Brain
} from 'lucide-react';
import { generateGeminiResponse, generateBasicResponse } from '../services/gemini';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { SmartSwitchModal } from '../components/SmartSwitchModal';
import { MODELS } from '../constants';

// --- MOCK DATA & CONFIG ---

const MOCK_HISTORY = [
  { id: '1', title: 'React Performance Optimization', date: '2h ago' },
  { id: '2', title: 'System Architecture Design', date: 'Yesterday' },
  { id: '3', title: 'Marketing Copy Generation', date: '3 days ago' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isCode?: boolean;
}

interface AINexusProps {
  activeModelId: string;
  setActiveModelId: (id: string) => void;
  pendingModelId: string | null;
  clearPendingModel: () => void;
}

export function AINexus({ activeModelId, setActiveModelId, pendingModelId, clearPendingModel }: AINexusProps) {
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'msg-1', role: 'assistant', content: 'Hello. I am ready to assist you. How shall we begin?' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [modelVersion, setModelVersion] = useState<'basic' | 'latest'>('basic');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeModel = MODELS.find(m => m.id === activeModelId)!;
  const pendingModel = pendingModelId ? MODELS.find(m => m.id === pendingModelId) : null;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isGenerating]);

  useEffect(() => {
    const key = localStorage.getItem(`${activeModelId.toUpperCase()}_API_KEY`);
    if (key) {
      setModelVersion('latest');
    } else {
      setModelVersion('basic');
    }
  }, [activeModelId]);

  const handleVersionSwitch = (version: 'basic' | 'latest') => {
    if (version === 'latest') {
      const key = localStorage.getItem(`${activeModelId.toUpperCase()}_API_KEY`);
      if (key) {
        setModelVersion('latest');
      } else {
        setApiKeyModalOpen(true);
      }
    } else {
      setModelVersion('basic');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsGenerating(true);

    try {
      if (modelVersion === 'latest') {
        const apiKey = localStorage.getItem(`${activeModelId.toUpperCase()}_API_KEY`);
        
        if (!apiKey) {
          setApiKeyModalOpen(true);
          setMessages(prev => prev.slice(0, -1));
          setIsGenerating(false);
          return;
        }

        if (activeModelId === 'gemini') {
          const result = await generateGeminiResponse(userMsg, apiKey);
          const isCode = result.includes('```') || (result.split('\n').length > 5 && (result.includes('function') || result.includes('const')));
          
          setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: result,
            isCode
          }]);
        } else {
          // Simulated API call for other models
          await new Promise(resolve => setTimeout(resolve, 1500));
          const response = `I am ${activeModel.name} (Simulated). I've analyzed your request through my unique neural architecture. [LATEST_API_MODE]`;
          setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: response 
          }]);
        }
      } else {
        const result = await generateBasicResponse(userMsg, activeModel.name);
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: result 
        }]);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "Neural link interrupted. Please check your API configuration or try again." 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSmartSwitch = (action: 'mind' | 'branch' | 'new', targetModelId: string) => {
    if (action === 'new') {
      setMessages([{ id: Date.now().toString(), role: 'assistant', content: `Hello. I am ${MODELS.find(m => m.id === targetModelId)?.name}. How shall we begin?` }]);
    } else if (action === 'branch') {
      // In a real app, this would create a new chat thread in history
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `[Branched to ${MODELS.find(m => m.id === targetModelId)?.name}]` }]);
    } else if (action === 'mind') {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `[Switched mind to ${MODELS.find(m => m.id === targetModelId)?.name}]` }]);
    }
    
    setActiveModelId(targetModelId);
    clearPendingModel();
  };

  return (
    <div className="h-full relative overflow-hidden flex bg-transparent text-white transition-colors duration-1000">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${activeModel.gradient} opacity-10 transition-all duration-1000 pointer-events-none`} />

      {/* --- DIALOGUE FLOW (Center Panel) --- */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 min-h-0">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-8 bg-transparent shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-4 group cursor-pointer overflow-hidden">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${activeModel.gradient} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 shrink-0`}>
              <activeModel.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="transition-transform duration-300 group-hover:translate-x-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wide text-white/90 truncate">{activeModel.name}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0" />
              </div>
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium truncate block">Nexus Core</span>
            </div>
            
            {/* Version Toggle */}
            <div className="hidden sm:flex ml-4 items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => handleVersionSwitch('basic')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${modelVersion === 'basic' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
              >
                Basic (Free)
              </button>
              <button 
                onClick={() => handleVersionSwitch('latest')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${modelVersion === 'latest' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
              >
                Latest (API)
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/40 hover:text-white transition-colors"><Save className="w-4 h-4" /></button>
            <button className="text-white/40 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar min-h-0"
        >
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-4">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[95%] sm:max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-tr-sm' 
                    : `bg-[#0a0a0a] border border-white/5 rounded-2xl rounded-tl-sm ${activeModel.glow} shadow-lg`
                } p-4 sm:p-5 relative group`}
                >
                  {msg.isCode ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                        <span className="text-xs font-mono text-white/40">Generated Code</span>
                        <button 
                          onClick={() => {
                            // In a real app, this would add to the workspace state
                            console.log('Exporting to workspace:', msg.content);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium text-white/70 hover:text-white"
                        >
                          <Download className="w-3.5 h-3.5" /> Export to Workspace
                        </button>
                      </div>
                      <pre className="font-mono text-sm text-white/80 whitespace-pre-wrap overflow-x-auto">
                        {msg.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-white/90 leading-relaxed whitespace-pre-wrap drop-shadow-md">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className={`bg-[#0a0a0a] border border-white/5 rounded-2xl rounded-tl-sm p-5 flex items-center gap-3 ${activeModel.glow} shadow-lg`}>
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin ${activeModel.text}`} />
                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${activeModel.bg.replace('/10', '/40')} ${activeModel.text}`} />
                  </div>
                  <span className={`text-sm font-mono ${activeModel.text} animate-pulse`}>Neural synthesis...</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="relative shrink-0 p-4 sm:p-8 pt-2">
          <div className="max-w-3xl mx-auto relative">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${activeModel.gradient} opacity-20 blur-xl pointer-events-none`} />
            <div className={`relative rounded-2xl p-2 border ${activeModel.border} flex items-end gap-2 bg-[#0a0a0a]`}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Send a message..."
                className="flex-1 bg-transparent resize-none max-h-32 sm:max-h-48 min-h-[44px] p-2 sm:p-3 text-base text-white placeholder-white/30 focus:outline-none"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  input.trim() && !isGenerating 
                    ? `${activeModel.bg} ${activeModel.text} hover:bg-white/10` 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">AI Nexus • High-Fidelity Interface</span>
            </div>
          </div>
        </div>
      </div>

      <SmartSwitchModal 
        isOpen={!!pendingModelId} 
        targetModel={pendingModel} 
        onClose={clearPendingModel} 
        onSelect={(type) => {
          if (pendingModelId) {
            handleSmartSwitch(type, pendingModelId);
          }
        }} 
      />

      <ApiKeyModal 
        isOpen={apiKeyModalOpen} 
        modelId={activeModelId}
        modelName={activeModel.name}
        onClose={() => setApiKeyModalOpen(false)} 
        onSave={(key) => {
          setModelVersion('latest');
          setApiKeyModalOpen(false);
        }}
      />
    </div>
  );
}
