'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Folder } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useLibraryStore } from '@/store/useLibraryStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ICON_LIBRARY } from '@brainbox/ui'
import { cn } from '@brainbox/utils'

const ICON_CATEGORIES = [
  {
    name: 'Essentials',
    icons: [76, 74, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 75]
  },
  {
    name: 'AI & Tech',
    icons: [5, 7, 6, 4, 72, 71, 20, 21, 12, 13, 14, 73, 2, 1]
  },
  {
    name: 'Media & Sound',
    icons: [16, 17, 18, 58, 59, 60, 61]
  },
  {
    name: 'Devices',
    icons: [54, 55, 56, 57, 53]
  },
  {
    name: 'Actions & Tools',
    icons: [35, 36, 44, 45, 46, 47, 48, 49, 50, 51, 52]
  },
  {
    name: 'Nature & Symbols',
    icons: [62, 63, 64, 65, 66, 67, 68, 69, 70, 9, 10, 11, 19]
  }
];

export function NewFolderModal() {
  const { isNewFolderModalOpen, setModalOpen, activeScreen, activeFolder } = useAppStore()
  const { libraryFolders, promptFolders, createFolder } = useLibraryStore()
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderIconIndex, setNewFolderIconIndex] = useState(0)

  const handleCreate = async () => {
    if (!newFolderName) return
    
    const type = activeScreen === 'prompts' ? 'prompt' : 'library'
    const parentFolder = [...libraryFolders, ...promptFolders].find(f => f.id === activeFolder)
    
    await createFolder({
      name: newFolderName,
      iconIndex: newFolderIconIndex,
      type,
      parentId: activeFolder || null,
      level: parentFolder ? (parentFolder.level || 0) + 1 : 0
    })

    setNewFolderName('')
    setNewFolderIconIndex(0)
    setModalOpen('newFolder', false)
  }

  return (
    <Dialog open={isNewFolderModalOpen} onOpenChange={(open) => setModalOpen('newFolder', open)}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl p-0 overflow-hidden bg-[#0a0a0a] border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <DialogTitle className="text-lg font-semibold text-white">Create New Folder</DialogTitle>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Folder Name</label>
              <Input 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Project Alpha"
                className="w-full bg-white/5 border-white/10 rounded-xl py-6 px-4 text-white ring-offset-0 focus-visible:ring-blue-500/50"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Select Icon</label>
              <div className="space-y-8">
                {ICON_CATEGORIES.map((category) => (
                  <div key={category.name}>
                    <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">{category.name}</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {category.icons.map((idx) => {
                        const IconComponent = ICON_LIBRARY[idx] || Folder;
                        return (
                          <button
                            key={idx}
                            onClick={() => setNewFolderIconIndex(idx)}
                            className={cn(
                              "p-3 rounded-xl flex items-center justify-center transition-all",
                              newFolderIconIndex === idx 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' 
                                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            )}
                          >
                            <IconComponent className="w-5 h-5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3 shrink-0">
          <Button 
            variant="ghost"
            onClick={() => setModalOpen('newFolder', false)}
            className="flex-1 py-6 rounded-2xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all border border-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!newFolderName}
            className="flex-1 py-6 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 border-none"
          >
            Create Folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
