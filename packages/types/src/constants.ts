import { Home, Zap, BarChart2, Network, MessageSquare, Cpu, Sparkles, Brain, History, Folder, Hash, Layers, Bot, Eye, Compass, Swords, Telescope, Cloud, Workflow, Activity, Search, Pin, FileText, Image, Music, Video, Globe, Terminal, Database, Shield, Lock, Unlock, Bell, Mail, Phone, Camera, Map, Calendar, Clock, Star, Heart, Share2, Download, Upload, Trash2, Edit3, Check, X, Filter, List, Grid, Maximize2, Minimize2, ExternalLink, Link2, Paperclip, Scissors, Copy, Clipboard, Save, HardDrive, Monitor, Smartphone, Tablet, Watch, Headphones, Speaker, Mic, Volume2, Sun, Moon, Wind, Droplets, Flame, ZapOff, Anchor, Target, Flag } from 'lucide-react';
import type { ThemeName, Theme } from './models';

export const THEMES: Record<ThemeName, Theme> = {
  chatgpt: { name: 'chatgpt', color: 'var(--color-acc-chatgpt)', lightPosition: 'top-left' },
  gemini: { name: 'gemini', color: 'var(--color-acc-gemini)', lightPosition: 'bottom-right' },
  claude: { name: 'claude', color: 'var(--color-acc-claude)', lightPosition: 'top-right' },
  grok: { name: 'grok', color: 'var(--color-acc-grok)', lightPosition: 'bottom-left' },
  perplexity: { name: 'perplexity', color: 'var(--color-acc-perplexity)', lightPosition: 'top-center' },
  lmarena: { name: 'lmarena', color: 'var(--color-acc-neutral)', lightPosition: 'center' },
  deepseek: { name: 'deepseek', color: 'var(--color-acc-deepseek)', lightPosition: 'bottom-center' },
  qwen: { name: 'qwen', color: 'var(--color-acc-mistral)', lightPosition: 'center-right' },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeName[];

export const ICON_LIBRARY = [
  Folder, Hash, Layers, MessageSquare, Zap, Brain, Sparkles, Bot, Eye, Compass,
  Swords, Telescope, Cloud, Workflow, Activity, FileText, Image, Music, Video, Globe,
  Terminal, Database, Shield, Lock, Unlock, Bell, Mail, Phone, Camera, Map,
  Calendar, Clock, Star, Heart, Share2, Download, Upload, Trash2, Edit3, Check,
  X, Filter, List, Grid, Maximize2, Minimize2, ExternalLink, Link2, Paperclip, Scissors,
  Copy, Clipboard, Save, HardDrive, Monitor, Smartphone, Tablet, Watch, Headphones, Speaker,
  Mic, Volume2, Sun, Moon, Wind, Droplets, Flame, ZapOff, Anchor, Target, Flag,
  Network, Cpu, History, Search, Pin, Home
];

export const SCREEN_LABELS = {
  dashboard: 'Dashboard',
  library: 'Library',
  prompts: 'Prompts',
  studio: 'AI Nexus',
  workspace: 'Workspace',
  analytics: 'Mind Graph',
  archive: 'Archive',
  settings: 'Settings',
  profile: 'Identity',
  extension: 'Extension',
} as const;

export const MODELS = [
  { id: 'chatgpt', name: 'ChatGPT', icon: Brain, color: 'emerald', bg: 'bg-[var(--color-acc-chatgpt)]/10', border: 'border-[var(--color-acc-chatgpt)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-chatgpt)]/50', text: 'text-[var(--color-acc-chatgpt)]', gradient: 'from-[var(--color-acc-chatgpt)]/40 via-[var(--color-acc-chatgpt)]/10 to-transparent' },
  { id: 'gemini', name: 'Gemini', icon: Sparkles, color: 'blue', bg: 'bg-[var(--color-acc-gemini)]/10', border: 'border-[var(--color-acc-gemini)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-gemini)]/50', text: 'text-[var(--color-acc-gemini)]', gradient: 'from-[var(--color-acc-gemini)]/40 via-[var(--color-acc-gemini)]/10 to-transparent' },
  { id: 'claude', name: 'Claude', icon: Bot, color: 'orange', bg: 'bg-[var(--color-acc-claude)]/10', border: 'border-[var(--color-acc-claude)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-claude)]/50', text: 'text-[var(--color-acc-claude)]', gradient: 'from-[var(--color-acc-claude)]/40 via-[var(--color-acc-claude)]/10 to-transparent' },
  { id: 'grok', name: 'Grok', icon: Eye, color: 'gray', bg: 'bg-[var(--color-acc-grok)]/10', border: 'border-[var(--color-acc-grok)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-grok)]/50', text: 'text-[var(--color-acc-grok)]', gradient: 'from-[var(--color-acc-grok)]/40 via-[var(--color-acc-grok)]/10 to-transparent' },
  { id: 'perplexity', name: 'Perplexity', icon: Compass, color: 'cyan', bg: 'bg-[var(--color-acc-perplexity)]/10', border: 'border-[var(--color-acc-perplexity)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-perplexity)]/50', text: 'text-[var(--color-acc-perplexity)]', gradient: 'from-[var(--color-acc-perplexity)]/40 via-[var(--color-acc-perplexity)]/10 to-transparent' },
  { id: 'lmarena', name: 'LM Arena', icon: Swords, color: 'amber', bg: 'bg-[var(--color-acc-neutral)]/10', border: 'border-[var(--color-acc-neutral)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-neutral)]/50', text: 'text-[var(--color-acc-neutral)]', gradient: 'from-[var(--color-acc-neutral)]/40 via-[var(--color-acc-neutral)]/10 to-transparent' },
  { id: 'deepseek', name: 'DeepSeek', icon: Telescope, color: 'blue', bg: 'bg-[var(--color-acc-deepseek)]/10', border: 'border-[var(--color-acc-deepseek)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-deepseek)]/50', text: 'text-[var(--color-acc-deepseek)]', gradient: 'from-[var(--color-acc-deepseek)]/40 via-[var(--color-acc-deepseek)]/10 to-transparent' },
  { id: 'qwen', name: 'Qwen', icon: Cloud, color: 'purple', bg: 'bg-[var(--color-acc-mistral)]/10', border: 'border-[var(--color-acc-mistral)]/30', glow: 'shadow-[0_0_20px_var(--color-acc-mistral)]/50', text: 'text-[var(--color-acc-mistral)]', gradient: 'from-[var(--color-acc-mistral)]/40 via-[var(--color-acc-mistral)]/10 to-transparent' }
];

export const SUMMARIZE_OPTIONS = [
  { id: 'quick', label: 'Quick Summary', icon: Zap, prompt: 'Provide a concise 2-3 sentence summary of this content.' },
  { id: 'detailed', label: 'Detailed Analysis', icon: FileText, prompt: 'Provide a comprehensive and detailed summary of this content, covering all major points.' },
  { id: 'bullets', label: 'Key Bullet Points', icon: List, prompt: 'Extract the most important points from this content and present them as a bulleted list.' },
  { id: 'takeaways', label: 'Key Takeaways', icon: Target, prompt: 'What are the 3-5 most critical takeaways from this content?' },
  { id: 'exec', label: 'Executive Summary', icon: BarChart2, prompt: 'Write a professional executive summary suitable for a high-level briefing.' },
  { id: 'narrative', label: 'Narrative Summary', icon: MessageSquare, prompt: 'Summarize this content in a narrative, storytelling format.' },
  { id: 'actions', label: 'Action Items', icon: Check, prompt: 'Identify any explicit or implicit action items or next steps mentioned in this content.' },
];

export const ANALYZE_OPTIONS = [
  { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain, prompt: 'Analyze the emotional tone and sentiment of this content. Is it positive, negative, neutral, or mixed?' },
  { id: 'topics', label: 'Topic Modeling', icon: Sparkles, prompt: 'Identify the primary and secondary topics discussed in this content.' },
  { id: 'entities', label: 'Entity Extraction', icon: Target, prompt: 'Extract all significant entities (people, places, organizations, technologies) mentioned in this content.' },
  { id: 'intent', label: 'Intent Recognition', icon: Eye, prompt: 'What is the primary intent or purpose of the author in this content?' },
  { id: 'tone', label: 'Tone Analysis', icon: MessageSquare, prompt: 'Describe the specific tone of this content (e.g., formal, casual, urgent, persuasive).' },
  { id: 'logic', label: 'Logical Consistency', icon: Activity, prompt: 'Evaluate the logical flow and consistency of the arguments or information presented.' },
  { id: 'bias', label: 'Bias Detection', icon: Shield, prompt: 'Identify any potential biases, assumptions, or one-sided perspectives in this content.' },
];
