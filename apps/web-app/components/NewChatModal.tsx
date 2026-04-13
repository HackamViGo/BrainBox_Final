'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, MessageSquare, Brain, Sparkles, Bot, Compass, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@brainbox/utils'

export function NewChatModal() {
  const { isNewChatModalOpen, setModalOpen, activeFolder } = useAppStore()
  const { createItem } = useLibraryStore()
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    source: 'chatgpt',
    description: ''
  })

  const handleSave = async () => {
    if (!formData.title) return
    
    await createItem({
      title: formData.title,
      description: formData.description,
      type: 'chat',
      folderId: activeFolder || null,
      url: formData.url,
      source: formData.source
    })

    setFormData({ title: '', url: '', source: 'chatgpt', description: '' })
    setModalOpen('newChat', false)
  }

  const SOURCE_THEMES: Record<string, { color: string, icon: any, label: string }> = {
    chatgpt: { color: 'text-emerald-500', icon: Brain, label: 'ChatGPT' },
    claude: { color: 'text-orange-400', icon: Bot, label: 'Claude' },
    gemini: { color: 'text-blue-400', icon: Sparkles, label: 'Gemini' },
    perplexity: { color: 'text-cyan-400', icon: Compass, label: 'Perplexity' },
    other: { color: 'text-gray-400', icon: MessageSquare, label: 'Other' }
  }

  const activeSource = SOURCE_THEMES[formData.source] || SOURCE_THEMES.other
  const SourceIcon = activeSource?.icon || MessageSquare

  return (
    <Dialog open={isNewChatModalOpen} onOpenChange={(open) => setModalOpen('newChat', open)}>
      <DialogContent aria-describedby={undefined} className="max-w-md p-0 overflow-hidden bg-[#0a0a0a] border-white/10 rounded-3xl shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <DialogTitle className="text-lg font-semibold text-white">Save New Chat</DialogTitle>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Title</label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter chat title..."
              className="bg-white/5 border-white/10 rounded-xl py-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Chat URL</label>
            <Input 
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder="https://chat.openai.com/..."
              className="bg-white/5 border-white/10 rounded-xl py-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Source Platform</label>
            <div className="relative">
              <select 
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white hover:bg-white/5 transition-all appearance-none cursor-pointer outline-none focus:border-blue-500/50"
              >
                {Object.entries(SOURCE_THEMES).map(([id, info]) => (
                  <option key={id} value={id}>{info.label}</option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <SourceIcon className={cn("w-5 h-5", activeSource?.color || 'text-gray-400')} />
              </div>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Summarize the chat in 2-3 sentences..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
            />
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
          <Button 
            variant="ghost"
            onClick={() => setModalOpen('newChat', false)}
            className="flex-1 py-6 rounded-2xl bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.title}
            className="flex-1 py-6 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-lg shadow-blue-600/20 border-none"
          >
            Save Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
