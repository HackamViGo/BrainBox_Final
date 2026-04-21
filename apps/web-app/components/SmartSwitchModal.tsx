'use client'

import React from 'react'
import { BrainCircuit, GitBranch, Plus, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@brainbox/utils'
import type { ThemeName } from '@brainbox/types'

export function SmartSwitchModal() {
  const { isSmartSwitchModalOpen, targetModel, setModalOpen, setActiveModelId, setActiveScreen } = useAppStore()

  if (!targetModel) return null

  const handleSelect = () => {
    // Logic for model switching would go here
    // For now, we just switch the active model and close the modal
    const { setTheme } = useAppStore.getState()
    setActiveModelId(targetModel.id as string)
    setTheme(targetModel.id as ThemeName)
    setActiveScreen('studio')
    setModalOpen('smartSwitch', false)
  }

  return (
    <Dialog open={isSmartSwitchModalOpen} onOpenChange={(open) => setModalOpen('smartSwitch', open)}>
      <DialogContent aria-describedby={undefined} className="max-w-lg p-0 overflow-hidden bg-background border-white/10 rounded-3xl shadow-2xl">
        <div className={cn("h-2 w-full bg-linear-to-r", targetModel.gradient || "from-blue-500 to-purple-600")} />
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${(targetModel as unknown as { gradient?: string }).gradient || ''} flex items-center justify-center shadow-lg relative group-hover:scale-110 transition-transform duration-300`}>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {(targetModel as unknown as { icon?: React.ElementType }).icon && React.createElement((targetModel as unknown as { icon: React.ElementType }).icon, { className: "w-7 h-7 text-white drop-shadow-md" })}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  {(targetModel as unknown as { name?: string }).name}
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </h3>
                <p className="text-white/40 text-xs font-mono">Target: {(targetModel as unknown as { label?: string }).label || (targetModel as unknown as { name?: string }).name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleSelect}
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
              onClick={handleSelect}
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
              onClick={handleSelect}
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
