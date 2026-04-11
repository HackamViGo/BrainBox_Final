import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, GitBranch, Plus, X, ArrowRight } from 'lucide-react';

interface SmartSwitchModalProps {
  isOpen: boolean;
  targetModel: any;
  onClose: () => void;
  onSelect: (type: 'mind' | 'branch' | 'new') => void;
}

export function SmartSwitchModal({ isOpen, targetModel, onClose, onSelect }: SmartSwitchModalProps) {
  if (!targetModel) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className={`h-2 w-full bg-gradient-to-r ${targetModel.gradient}`} />
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${targetModel.bg} border ${targetModel.border} flex items-center justify-center`}>
                    <targetModel.icon className={`w-6 h-6 ${targetModel.text}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight uppercase">Smart Switch</h3>
                    <p className="text-white/40 text-xs font-mono">Target: {targetModel.name}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => onSelect('mind')}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Switch Mind</div>
                    <div className="text-xs text-white/40">Keep current context & history</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-all group-hover:translate-x-1" />
                </button>

                <button 
                  onClick={() => onSelect('branch')}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <GitBranch className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Branch Thread</div>
                    <div className="text-xs text-white/40">Copy history to a new session</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-all group-hover:translate-x-1" />
                </button>

                <button 
                  onClick={() => onSelect('new')}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">New Neural Path</div>
                    <div className="text-xs text-white/40">Start fresh with no history</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-all group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
