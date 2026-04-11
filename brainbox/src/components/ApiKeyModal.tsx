import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

const API_LINKS: Record<string, { url: string, name: string }> = {
  chatgpt: { url: 'https://platform.openai.com/api-keys', name: 'OpenAI Platform' },
  gemini: { url: 'https://aistudio.google.com/app/apikey', name: 'Google AI Studio' },
  claude: { url: 'https://console.anthropic.com/settings/keys', name: 'Anthropic Console' },
  grok: { url: 'https://console.x.ai/', name: 'xAI Console' },
  perplexity: { url: 'https://www.perplexity.ai/settings/api', name: 'Perplexity Settings' },
  lmarena: { url: 'https://openrouter.ai/keys', name: 'OpenRouter (LM Arena)' },
  deepseek: { url: 'https://platform.deepseek.com/api_keys', name: 'DeepSeek Platform' },
  qwen: { url: 'https://dashscope.console.aliyun.com/apiKey', name: 'Aliyun DashScope' },
};

interface ApiKeyModalProps {
  isOpen: boolean;
  modelId: string;
  modelName: string;
  onClose: () => void;
  onSave: (key: string) => void;
}

export function ApiKeyModal({ isOpen, modelId, modelName, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);

  const storageKey = `${modelId.toUpperCase()}_API_KEY`;

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem(storageKey);
      if (savedKey) {
        setApiKey(savedKey);
        setShowTutorial(false);
      } else {
        setApiKey('');
        setShowTutorial(true);
      }
    }
  }, [isOpen, storageKey]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(storageKey, apiKey.trim());
      onSave(apiKey.trim());
      onClose();
    }
  };

  const providerInfo = API_LINKS[modelId] || { url: '#', name: 'Provider Dashboard' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-panel w-full max-w-xl rounded-3xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{modelName} API Configuration</h3>
                  <p className="text-xs text-white/40">Power your neural insights</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8">
              {showTutorial && (
                <div className="space-y-6">
                  <div className="glass-panel-light p-6 rounded-2xl border-blue-500/20 border">
                    <h4 className="flex items-center gap-2 font-semibold text-blue-400 mb-4">
                      <Info className="w-4 h-4" /> Quick Tutorial: Getting your API Key
                    </h4>
                    <ol className="space-y-4 text-sm text-white/70">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</span>
                        <p>Go to the <a href={providerInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">{providerInfo.name} <ExternalLink className="w-3 h-3" /></a></p>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</span>
                        <p>Generate a new API key from your dashboard settings.</p>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</span>
                        <p>Copy the generated key and paste it below.</p>
                      </li>
                    </ol>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/70">
                    <Info className="w-5 h-5 flex-shrink-0 text-amber-400" />
                    <p>
                      <strong>Important:</strong> By using the {modelName} API, your data may be used by the provider to improve their models. 
                      Please review their <a href="#" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a> for more details.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-sm font-medium text-white/60 ml-1">Your API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Paste your ${modelName} API key here...`}
                    className="w-full glass-panel py-4 px-5 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                  />
                  {apiKey.length > 20 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-white/30 px-1">
                  Your key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="flex-1 py-4 rounded-2xl glass-panel-light hover:bg-white/10 transition-all text-sm font-medium"
              >
                {showTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-[2] py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-lg shadow-blue-600/20"
              >
                Save Configuration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
