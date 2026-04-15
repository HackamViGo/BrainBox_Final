'use client'

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';

// View Components
import { HubView } from '@/components/prompts/HubView';
import { FrameworksView } from '@/components/prompts/FrameworksView';
import { RefineView } from '@/components/prompts/RefineView';
import { CapturesView } from '@/components/prompts/CapturesView';
import { SavedPromptsView } from '@/components/prompts/SavedPromptsView';
import { ViewWrapper } from '@/components/prompts/ViewWrapper';

type SubView = 'hub' | 'frameworks' | 'refine' | 'captures' | 'saved-prompts';

export function Prompts() {
  const [currentView, setCurrentView] = useState<SubView>('hub');
  const [refineInput, setRefineInput] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const { theme, setTheme, setHoverTheme } = useAppStore();
  const { libraryFolders, promptFolders, items, addItem, addCapture } = useLibraryStore();
  const folders = [...libraryFolders, ...promptFolders];
  const captures = items.filter(i => i.type === 'capture');

  const filteredPromptFolders = folders.filter((f: any) => f.type === 'prompt' || f.type === 'folder');

  const handleRefine = (text: string) => {
    setRefineInput(text);
    setCurrentView('refine');
  };

  const handleSaveToPrompts = (text: string) => {
    addItem({
      type: 'prompt',
      title: 'New Prompt',
      description: text.substring(0, 100) + '...',
      content: text,
      folderId: activeFolder,
      platform: theme   // 'platform' is the ThemeName field on Item
    });
    setCurrentView('saved-prompts');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
      addCapture({
        title: text.substring(0, 30) + '...',
        description: text.substring(0, 100),
        content: text,
        url: 'Manual Drop',
        source: 'brainbox.app',
        folderId: null
      });
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent pt-20">
      <AnimatePresence mode="wait">
        {currentView === 'hub' && (
          <ViewWrapper key="hub" id="hub">
            <HubView 
              onNavigate={setCurrentView} 
              onUseTemplate={handleRefine}
              stats={{
                frameworks: promptFolders.length,
                saved: items.filter(i => i.type === 'prompt').length,
                refine: 7, // Gemini crystals
                captures: captures.length
              }}
            />
          </ViewWrapper>
        )}

        {currentView === 'frameworks' && (
          <ViewWrapper key="frameworks" id="frameworks">
            <FrameworksView 
              onBack={() => setCurrentView('hub')} 
              setTheme={setTheme}
              onUseTemplate={handleRefine}
            />
          </ViewWrapper>
        )}

        {currentView === 'refine' && (
          <ViewWrapper key="refine" id="refine">
            <RefineView 
              onBack={() => setCurrentView('hub')} 
              initialInput={refineInput}
              onSave={handleSaveToPrompts}
            />
          </ViewWrapper>
        )}

        {currentView === 'captures' && (
          <ViewWrapper key="captures" id="captures">
            <CapturesView 
              onBack={() => setCurrentView('hub')}
              onRefine={handleRefine}
              onSaveToPrompts={handleSaveToPrompts}
              captures={captures}
              onDrop={handleDrop}
            />
          </ViewWrapper>
        )}

        {currentView === 'saved-prompts' && (
          <ViewWrapper key="saved-prompts" id="saved-prompts">
            <SavedPromptsView 
              onBack={() => setCurrentView('hub')}
              activeFolder={activeFolder}
              setActiveFolder={setActiveFolder}
              onNewPrompt={() => handleRefine('')}
              onSelectTheme={setHoverTheme}
              promptFolders={filteredPromptFolders}
              items={items}
            />
          </ViewWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
