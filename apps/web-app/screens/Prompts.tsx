'use client'

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { SCREEN_LABELS, type ThemeName } from '@brainbox/types';

// View Components
import { HubView } from '@/components/prompts/HubView';
import { FrameworksView } from '@/components/prompts/FrameworksView';
import { RefineView } from '@/components/prompts/RefineView';
import { CapturesView } from '@/components/prompts/CapturesView';
import { SavedPromptsView } from '@/components/prompts/SavedPromptsView';
import { ViewWrapper } from '@/components/prompts/ViewWrapper';
import { ScreenErrorBoundary } from '@/components/ScreenErrorBoundary';

type SubView = 'hub' | 'frameworks' | 'refine' | 'captures' | 'saved-prompts';

export function Prompts() {
  const [currentView, setCurrentView] = useState<SubView>('hub');
  const [refineInput, setRefineInput] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const { theme, setTheme, setHoverTheme } = useAppStore();
  const { libraryFolders, promptFolders, items, addItem, addCapture } = useLibraryStore();
  const folders = [...libraryFolders, ...promptFolders];
  const captures = items.filter(i => i.type === 'capture');

  const filteredPromptFolders = folders.filter((f) => f.type === 'prompt');

  const handleRefine = (text: string) => {
    setRefineInput(text);
    setCurrentView('refine');
  };

  const handleSaveToPrompts = async (text: string) => {
    await addItem({
      type: 'prompt',
      title: 'New Prompt',
      description: text.substring(0, 100) + '...',
      content: text,
      folderId: activeFolder,
      platform: theme as ThemeName
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
    <ScreenErrorBoundary screenName={SCREEN_LABELS.prompts}>
      <div className="relative w-full h-full overflow-hidden bg-transparent pt-20">
        <AnimatePresence>
          {currentView === 'hub' && (
            <ViewWrapper key={currentView} id="hub">
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
            <ViewWrapper key={currentView} id="frameworks">
              <FrameworksView 
                onBack={() => setCurrentView('hub')} 
                setTheme={setTheme}
                onUseTemplate={handleRefine}
              />
            </ViewWrapper>
          )}

          {currentView === 'refine' && (
            <ViewWrapper key={currentView} id="refine">
              <RefineView 
                onBack={() => setCurrentView('hub')} 
                initialInput={refineInput}
                onSave={handleSaveToPrompts}
              />
            </ViewWrapper>
          )}

          {currentView === 'captures' && (
            <ViewWrapper key={currentView} id="captures">
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
            <ViewWrapper key={currentView} id="saved-prompts">
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
    </ScreenErrorBoundary>
  );
}
