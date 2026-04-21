'use client'

import { 
  MessageSquare, Brain, Sparkles, Bot, Compass, 
  ChevronDown, Eye, Swords, Telescope, Cloud 
} from 'lucide-react'
import type { ThemeName } from '@brainbox/types'
import { useAppStore } from '@/store/useAppStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@brainbox/utils'
import { useState, useEffect } from 'react'

export function NewChatModal() {
  const { isNewChatModalOpen, setModalOpen, activeFolder } = useAppStore()
  const { createItem } = useLibraryStore()
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    platform: 'chatgpt' as ThemeName,
    description: ''
  })

  useEffect(() => {
    const detectPlatform = (url: string): ThemeName | null => {
      if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) return 'chatgpt';
      if (url.includes('gemini.google.com')) return 'gemini';
      if (url.includes('claude.ai')) return 'claude';
      if (url.includes('perplexity.ai')) return 'perplexity';
      if (url.includes('x.com/i/grok')) return 'grok';
      if (url.includes('deepseek.com')) return 'deepseek';
      if (url.includes('qwen.ai')) return 'qwen';
      if (url.includes('lmsys.org')) return 'lmarena';
      return null;
    };

    if (formData.url) {
      const detected = detectPlatform(formData.url);
      if (detected && detected !== formData.platform) {
        setFormData(prev => ({ ...prev, platform: detected }));
      }
    }
  }, [formData.url, formData.platform]);

  const handleSave = async () => {
    if (!formData.title) return
    
    await createItem({
      title: formData.title,
      description: formData.description,
      type: 'chat',
      folderId: activeFolder || null,
      url: formData.url,
      platform: formData.platform
    })

    setFormData({ title: '', url: '', platform: 'chatgpt', description: '' })
    setModalOpen('newChat', false)
  }

  const PLATFORM_CONFIG: Record<ThemeName, { color: string, icon: React.ElementType, label: string }> = {
    chatgpt: { color: 'text-emerald-500', icon: Brain, label: 'ChatGPT' },
    gemini: { color: 'text-blue-400', icon: Sparkles, label: 'Gemini' },
    claude: { color: 'text-orange-400', icon: Bot, label: 'Claude' },
    grok: { color: 'text-white', icon: Eye, label: 'Grok' },
    perplexity: { color: 'text-cyan-400', icon: Compass, label: 'Perplexity' },
    lmarena: { color: 'text-amber-400', icon: Swords, label: 'LM Arena' },
    deepseek: { color: 'text-blue-600', icon: Telescope, label: 'DeepSeek' },
    qwen: { color: 'text-purple-400', icon: Cloud, label: 'Qwen' },
  }

  const activePlatform = PLATFORM_CONFIG[formData.platform]
  const PlatformIcon = activePlatform?.icon || MessageSquare

  return (
    <Dialog open={isNewChatModalOpen} onOpenChange={(open) => setModalOpen('newChat', open)}>
      <DialogContent aria-describedby={undefined} className="max-w-md p-0 overflow-hidden bg-background border-white/10 rounded-3xl shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <DialogTitle className="text-lg font-semibold text-white">Save New Fragment</DialogTitle>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Title</label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter fragment title..."
              className="bg-white/5 border-white/10 rounded-xl py-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Chat URL (Optional)</label>
            <Input 
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder="https://chat.openai.com/..."
              className="bg-white/5 border-white/10 rounded-xl py-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Platform</label>
            <div className="relative">
              <select 
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value as ThemeName})}
                className="w-full bg-background border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white hover:bg-white/5 transition-all appearance-none cursor-pointer outline-none focus:border-blue-500/50"
              >
                {Object.entries(PLATFORM_CONFIG).map(([id, info]) => (
                  <option key={id} value={id}>{info.label}</option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <PlatformIcon className={cn("w-5 h-5", activePlatform?.color || 'text-gray-400')} />
              </div>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Summary (Optional)</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Briefly describe this fragment..."
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
            Save Fragment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
