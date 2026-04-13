'use client'

import { motion, AnimatePresence } from 'motion/react'
import { BrainCircuit, GitBranch, Plus, X, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@brainbox/utils'

export function SmartSwitchModal() {
  const { isSmartSwitchModalOpen, targetModel, setModalOpen, setActiveModelId, setActiveScreen } = useAppStore()

  if (!targetModel) return null

  const handleSelect = (type: 'mind' | 'branch' | 'new') => {
    // Logic for model switching would go here
    // For now, we just switch the active model and close the modal
    setActiveModelId(targetModel.id)
    setActiveScreen('studio')
    setModalOpen('smartSwitch', false)
  }

  return (
    <Dialog open={isSmartSwitchModalOpen} onOpenChange={(open) => setModalOpen('smartSwitch', open)}>
      <DialogContent aria-describedby={undefined} className="max-w-lg p-0 overflow-hidden bg-[#0a0a0a] border-white/10 rounded-3xl shadow-2xl">
        <div className={cn("h-2 w-full bg-gradient-to-r", targetModel.gradient || "from-blue-500 to-purple-600")} />
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", 
                targetModel.bg || "bg-white/5", 
                targetModel.border || "border-white/10")}>
                {targetModel.icon && <targetModel.icon className={cn("w-6 h-6", targetModel.text || "text-white")} />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight uppercase">Smart Switch</DialogTitle>
                <p className="text-white/40 text-xs font-mono">Target: {targetModel.label || targetModel.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => handleSelect('mind')}
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
              onClick={() => handleSelect('branch')}
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
              onClick={() => handleSelect('new')}
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
      </DialogContent>
    </Dialog>
  )
}
