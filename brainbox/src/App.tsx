/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { AmbientLight } from './components/AmbientLight';
import { NeuralField } from './components/NeuralField';
import { Dashboard } from './screens/Dashboard';
import { Library } from './screens/Library';
import { Prompts } from './screens/Prompts';
import { AINexus } from './screens/AINexus';
import { Workspace } from './screens/Workspace';
import { MindGraph } from './screens/MindGraph';
import { Archive } from './screens/Archive';
import { Settings } from './screens/Settings';
import { Identity } from './screens/Identity';
import { Extension } from './screens/Extension';
import { Login } from './screens/Login';
import { ThemeName, Folder, Item } from './types';

const THEME_KEYS: ThemeName[] = ['chatgpt', 'gemini', 'claude', 'grok', 'perplexity', 'lmarena', 'deepseek', 'qwen'];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('brainbox_is_logged_in');
    return saved === 'true';
  });
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [theme, setTheme] = useState<ThemeName>('chatgpt');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Folders State
  const [libraryFolders, setLibraryFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('brainbox_library_folders_v3');
    return saved ? JSON.parse(saved) : [
      { id: 'lib-1', name: 'Marketing', iconIndex: 0, parentId: null, type: 'library', level: 0 },
      { id: 'lib-1-1', name: 'Social Media', iconIndex: 1, parentId: 'lib-1', type: 'library', level: 1 },
      { id: 'lib-1-1-1', name: 'Instagram', iconIndex: 2, parentId: 'lib-1-1', type: 'library', level: 2 },
      { id: 'lib-1-1-2', name: 'Twitter', iconIndex: 3, parentId: 'lib-1-1', type: 'library', level: 2 },
      { id: 'lib-2', name: 'Development', iconIndex: 20, parentId: null, type: 'library', level: 0 },
      { id: 'lib-2-1', name: 'Frontend', iconIndex: 21, parentId: 'lib-2', type: 'library', level: 1 },
      { id: 'lib-3', name: 'Research', iconIndex: 5, parentId: null, type: 'library', level: 0 },
    ];
  });

  const [promptFolders, setPromptFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('brainbox_prompt_folders_v3');
    return saved ? JSON.parse(saved) : [
      { id: 'prm-1', name: 'Copywriting', iconIndex: 15, parentId: null, type: 'prompt', level: 0 },
      { id: 'prm-1-1', name: 'Sales Letters', iconIndex: 16, parentId: 'prm-1', type: 'prompt', level: 1 },
      { id: 'prm-2', name: 'Logic Gates', iconIndex: 5, parentId: null, type: 'prompt', level: 0 },
      { id: 'prm-3', name: 'Marketing', iconIndex: 0, parentId: null, type: 'prompt', level: 0 },
    ];
  });

  // Items State
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('brainbox_items_v3');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'c1', 
        title: 'Brainstorming Session', 
        description: 'Ideas for the new marketing campaign', 
        type: 'chat', 
        folderId: null,
        model: 'chatgpt' as ThemeName,
        tags: ['marketing', 'ideas'],
        date: '2h ago',
        messages: 14,
        content: "We need to focus on a multi-channel approach for the Q4 campaign. Key areas include social media, email marketing, and influencer partnerships. The goal is to increase brand awareness by 20% and drive a 10% increase in conversions. We should also consider a referral program to leverage our existing customer base."
      },
      { 
        id: 'c2', 
        title: 'Code Review', 
        description: 'Reviewing the latest PR for the dashboard', 
        type: 'chat', 
        folderId: null,
        model: 'claude' as ThemeName,
        tags: ['code', 'review', 'react'],
        date: '5h ago',
        messages: 8,
        content: "The latest pull request looks good overall. I've suggested some optimizations for the data fetching logic in the Sidebar component. We should also ensure that the new theme variables are correctly applied across all screens. The performance impact of the new animations seems minimal, but we should keep an eye on it during the next load test."
      },
      { 
        id: 'c3', 
        title: 'Insta Strategy', 
        description: 'Visual identity for 2024', 
        type: 'chat', 
        folderId: null,
        model: 'gemini' as ThemeName,
        tags: ['social', 'design'],
        date: 'Yesterday',
        messages: 22,
        content: "Our Instagram strategy for 2024 will focus on high-quality video content and interactive stories. We want to create a more authentic connection with our audience by sharing behind-the-scenes glimpses of our team and process. The visual style will be clean and modern, with a focus on vibrant colors and bold typography."
      },
      { 
        id: 'c4', 
        title: 'Product Roadmap', 
        description: 'Q3 and Q4 planning', 
        type: 'chat', 
        folderId: null,
        model: 'deepseek' as ThemeName,
        tags: ['product', 'planning'],
        date: '2 days ago',
        messages: 45,
        content: "The roadmap for the second half of the year includes several major feature releases. In Q3, we'll be launching the new AI-powered search and the collaborative workspace. Q4 will focus on the mobile app launch and the integration with third-party tools like Slack and Discord. We need to ensure that our infrastructure is ready to handle the expected increase in traffic."
      },
      { 
        id: 'c5', 
        title: 'User Interview #42', 
        description: 'Feedback on the new onboarding flow', 
        type: 'chat', 
        folderId: 'lib-3',
        model: 'perplexity' as ThemeName,
        tags: ['user-research', 'feedback'],
        date: '3 days ago',
        messages: 12,
        content: "The user found the new onboarding flow to be much more intuitive than the previous version. They particularly liked the interactive tutorial and the clear progress indicators. However, they suggested that we provide more context for the initial setup steps. We should consider adding tooltips or a 'help' section to address this."
      },
      { 
        id: 'c6', 
        title: 'API Documentation Draft', 
        description: 'Drafting the new public API docs', 
        type: 'chat', 
        folderId: 'lib-2-1',
        model: 'grok' as ThemeName,
        tags: ['api', 'docs', 'dev'],
        date: '4 days ago',
        messages: 18,
        content: "The public API should be RESTful and use JSON for all requests and responses. We need to document all endpoints, including their parameters, request bodies, and possible error codes. Authentication should be handled via API keys in the header. We should also provide code examples in multiple languages to make it easier for developers to get started."
      },
      { 
        id: 'c7', 
        title: 'Competitor Analysis', 
        description: 'Deep dive into market leaders', 
        type: 'chat', 
        folderId: 'lib-3',
        model: 'deepseek' as ThemeName,
        tags: ['research', 'competitors'],
        date: '1 week ago',
        messages: 31,
        content: "Our main competitors are focusing heavily on enterprise features and integrations. We should differentiate ourselves by offering a more user-friendly interface and a more affordable pricing model for small teams. We also have an advantage in our AI-powered features, which are more advanced than what our competitors are currently offering."
      },
      { 
        id: 'c8', 
        title: 'Twitter Campaign Ideas', 
        description: 'Viral hooks for the next launch', 
        type: 'chat', 
        folderId: 'lib-1-1-2',
        model: 'chatgpt' as ThemeName,
        tags: ['twitter', 'viral', 'marketing'],
        date: '1 week ago',
        messages: 15,
        content: "We should create a series of 'teaser' tweets leading up to the launch, each highlighting a different feature of the product. We can also run a contest where users can win a free subscription by retweeting our announcement. The goal is to create as much buzz as possible and drive traffic to our landing page."
      },
      { id: 'p1', title: 'Summarize Text', description: 'Extract key points from long articles', type: 'prompt', folderId: null, content: 'Summarize the following text into 5 bullet points, focusing on actionable insights.', theme: 'chatgpt' },
      { id: 'p2', title: 'Generate Code', description: 'Create a responsive React component', type: 'prompt', folderId: null, content: 'Create a responsive React component using Tailwind CSS for a navigation bar with a logo and three links.', theme: 'deepseek' },
      { id: 'p3', title: 'Sales Pitch v2', description: 'High conversion email template', type: 'prompt', folderId: null, content: 'Write a cold email pitch for a SaaS product that solves [problem] for [target audience].', theme: 'claude' },
      { id: 'p4', title: 'Explain Like I\'m 5', description: 'Simplify complex concepts', type: 'prompt', folderId: null, content: 'Explain the following concept as if I were a 5-year-old child: [concept]', theme: 'gemini' },
      { id: 'p5', title: 'SQL Query Generator', description: 'Convert natural language to SQL', type: 'prompt', folderId: null, content: 'Write a SQL query to find the top 5 customers by total spend in the last 30 days.', theme: 'perplexity' },
      { id: 'p6', title: 'Blog Post Outline', description: 'Structure for SEO-friendly articles', type: 'prompt', folderId: null, content: 'Create a detailed outline for a blog post about [topic], including H1, H2, and H3 headers.', theme: 'grok' },
      { id: 'p7', title: 'Ad Copy Generator', description: 'Create catchy headlines for ads', type: 'prompt', folderId: null, content: 'Write 5 catchy headlines for a Facebook ad promoting [product] to [target audience].', theme: 'chatgpt' },
      { id: 'p8', title: 'Python Script Fixer', description: 'Debug and optimize Python code', type: 'prompt', folderId: null, content: 'Identify the errors in the following Python script and provide a corrected version with optimized logic: [code]', theme: 'deepseek' },
      { id: 'p9', title: 'Language Translator', description: 'Translate text between languages', type: 'prompt', folderId: null, content: 'Translate the following text from [source language] to [target language]: [text]', theme: 'claude' },
    ];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('brainbox_library_folders_v3', JSON.stringify(libraryFolders));
  }, [libraryFolders]);

  useEffect(() => {
    localStorage.setItem('brainbox_prompt_folders_v3', JSON.stringify(promptFolders));
  }, [promptFolders]);

  useEffect(() => {
    localStorage.setItem('brainbox_items_v3', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('brainbox_is_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    // Disable auto-switch for specific screens
    if (['library', 'prompts', 'studio'].includes(activeScreen)) return;

    const interval = setInterval(() => {
      const otherThemes = THEME_KEYS.filter(t => t !== theme);
      const nextTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
      setTheme(nextTheme);
    }, 15000);

    return () => clearInterval(interval);
  }, [activeScreen, theme]);
  
  // AI Nexus State
  const [activeModelId, setActiveModelId] = useState('chatgpt');
  const [pendingModelId, setPendingModelId] = useState<string | null>(null);

  useEffect(() => {
    if (activeScreen === 'studio') {
      setTheme(activeModelId as ThemeName);
    }
  }, [activeScreen, activeModelId]);

  // Folder Rail State
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSetActiveScreen = (screen: string) => {
    if (screen !== activeScreen) {
      setActiveFolder(null);
    }
    setActiveScreen(screen);
    setIsMobileSidebarOpen(false); // Close sidebar on screen change
  };

  if (!isLoggedIn) {
    // We still return the main structure but wrapped in a way that shows Login on top
  }

  return (
    <div className="relative h-full w-full bg-[#050505] text-white font-sans overflow-hidden flex bg-grain">
      <AnimatePresence>
        {!isLoggedIn && (
          <motion.div
            key="login-overlay"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.2,
              filter: 'blur(20px)',
              transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <Login onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative flex flex-1 h-full w-full transition-all duration-1000 ${!isLoggedIn ? 'blur-2xl scale-95 pointer-events-none' : 'blur-0 scale-100'}`}>
        <AmbientLight theme={theme} monochrome={activeScreen === 'archive'} />
        <NeuralField 
          theme={theme} 
          mode={activeScreen === 'dashboard' ? 'brain' : activeScreen === 'extension' ? 'extension' : 'wander'} 
          speedMultiplier={activeScreen === 'archive' ? 0.25 : 1}
          monochrome={activeScreen === 'archive'}
        />
        
        {/* Mobile Header */}
        <header className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-transparent z-[80] flex items-center justify-between px-6 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </header>
        
        <Sidebar 
          theme={theme}
          activeScreen={activeScreen} 
          setActiveScreen={handleSetActiveScreen} 
          activeModelId={activeModelId}
          onModelSelect={(modelId) => setPendingModelId(modelId)}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          onDragStart={onDragStart}
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          libraryFolders={libraryFolders}
          setLibraryFolders={setLibraryFolders}
          promptFolders={promptFolders}
          setPromptFolders={setPromptFolders}
          items={items}
          setItems={setItems}
        />
        
        <main className="flex-1 lg:ml-20 relative h-full overflow-hidden pt-16 lg:pt-0">
          {activeScreen === 'dashboard' && <Dashboard setTheme={setTheme} setActiveScreen={setActiveScreen} />}
          {activeScreen === 'library' && (
            <Library 
              setTheme={setTheme} 
              activeFolder={activeFolder} 
              setActiveFolder={setActiveFolder}
              libraryFolders={libraryFolders}
              items={items}
              onDragStart={onDragStart}
            />
          )}
          {activeScreen === 'prompts' && (
            <Prompts 
              setTheme={setTheme} 
              activeFolder={activeFolder} 
              setActiveFolder={setActiveFolder}
              promptFolders={promptFolders}
              items={items}
              setItems={setItems}
              onDragStart={onDragStart}
            />
          )}
          {activeScreen === 'studio' && (
            <AINexus 
              activeModelId={activeModelId} 
              setActiveModelId={setActiveModelId}
              pendingModelId={pendingModelId}
              clearPendingModel={() => setPendingModelId(null)}
            />
          )}
          {activeScreen === 'workspace' && <Workspace />}
          {activeScreen === 'analytics' && <MindGraph />}
          {activeScreen === 'archive' && <Archive />}
          {activeScreen === 'settings' && (
            <Settings 
              promptFolders={promptFolders} 
            />
          )}
          {activeScreen === 'profile' && <Identity />}
          {activeScreen === 'extension' && <Extension setActiveScreen={setActiveScreen} />}
          {!['dashboard', 'library', 'prompts', 'studio', 'workspace', 'analytics', 'archive', 'settings', 'profile', 'extension'].includes(activeScreen) && (
            <div className="h-full flex items-center justify-center z-10 relative">
              <h2 className="text-2xl text-white/50">Screen under construction</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

