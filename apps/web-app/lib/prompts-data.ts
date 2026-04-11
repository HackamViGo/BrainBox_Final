import { 
  Shield, Brain, Search, Code, Cpu, Sparkles, MessageSquare, Flame, Rocket, 
  Lightbulb, Zap, Wind, Target, Activity
} from 'lucide-react';

export const MATRIX_DATA = [
  { 
    id: 'security', 
    label: 'Security', 
    icon: Shield, 
    color: 'from-red-500 to-orange-500', 
    ring: 'ring-red-500/30',
    cells: [
      { id: 'sec-1', title: 'Injection Guard', branches: [{ id: 'b1', name: 'v1.1 (Production-Ready)' }, { id: 'b2', name: 'v1.2 (Strict Mode)' }] },
      { id: 'sec-2', title: 'Data Sanitizer', branches: [] },
      { id: 'sec-3', title: 'Privacy Shield', branches: [{ id: 'b3', name: 'v2.0 (GDPR Focus)' }] },
      { id: 'sec-4', title: 'Threat Discovery', branches: [] },
      { id: 'sec-5', title: 'IAM Auditor', branches: [] },
      { id: 'sec-6', title: 'Zero Trust Logic', branches: [] },
      { id: 'sec-7', title: 'Kernel Guard', branches: [] }
    ]
  },
  { 
    id: 'logic', 
    label: 'Logic', 
    icon: Brain, 
    color: 'from-blue-500 to-indigo-500', 
    ring: 'ring-blue-500/30',
    cells: [
      { id: 'log-1', title: 'Socratic Method', branches: [{ id: 'b4', name: 'v4.2 (Philosophy)' }] },
      { id: 'log-2', title: 'First Principles', branches: [] },
      { id: 'log-3', title: 'Scientific Method', branches: [] },
      { id: 'log-4', title: 'Double Check', branches: [] },
      { id: 'log-5', title: 'Lateral Thinking', branches: [] },
      { id: 'log-6', title: 'Edge Case Finder', branches: [] },
      { id: 'log-7', title: 'Systems Analysis', branches: [] }
    ]
  },
  { 
    id: 'search', 
    label: 'Analysis', 
    icon: Search, 
    color: 'from-emerald-500 to-teal-500', 
    ring: 'ring-emerald-500/30',
    cells: [
      { id: 'sea-1', title: 'Semantic Deep-Dive', branches: [] },
      { id: 'sea-2', title: 'Patent Analyst', branches: [] },
      { id: 'sea-3', title: 'Market Sentiment', branches: [] },
      { id: 'sea-4', title: 'Visual Pattern', branches: [] },
      { id: 'sea-5', title: 'Trend Forecaster', branches: [] },
      { id: 'sea-6', title: 'Correlation Bot', branches: [] },
      { id: 'sea-7', title: 'Signal Extractor', branches: [] }
    ]
  },
  { 
    id: 'code', 
    label: 'Structure', 
    icon: Code, 
    color: 'from-purple-500 to-pink-500', 
    ring: 'ring-purple-500/30',
    cells: [
      { id: 'cod-1', title: 'Architectural Blueprint', branches: [] },
      { id: 'cod-2', title: 'Refactoring Engine', branches: [] },
      { id: 'cod-3', title: 'API Spec Designer', branches: [] },
      { id: 'cod-4', title: 'Test Case Factory', branches: [] },
      { id: 'cod-5', title: 'DB Schema Planner', branches: [] },
      { id: 'cod-6', title: 'Security Auditor (Code)', branches: [] },
      { id: 'cod-7', title: 'Regex Wizard', branches: [] }
    ]
  },
  { 
    id: 'system', 
    label: 'Reasoning', 
    icon: Cpu, 
    color: 'from-cyan-500 to-blue-500', 
    ring: 'ring-cyan-500/30',
    cells: [
      { id: 'sys-1', title: 'Chain of Thought', branches: [] },
      { id: 'sys-2', title: 'Tree of Thoughts', branches: [] },
      { id: 'sys-3', title: 'Self-Consistency', branches: [] },
      { id: 'sys-4', title: 'Active Prompting', branches: [] },
      { id: 'sys-5', title: 'Multi-Perspective', branches: [] },
      { id: 'sys-6', title: 'Algorithmic Prompt', branches: [] },
      { id: 'sys-7', title: 'Least-to-Most', branches: [] }
    ]
  },
  { 
    id: 'creative', 
    label: 'Creative', 
    icon: Sparkles, 
    color: 'from-amber-500 to-pink-500', 
    ring: 'ring-amber-500/30',
    cells: [
      { id: 'cre-1', title: 'World Builder', branches: [] },
      { id: 'cre-2', title: 'Narrative Arc', branches: [] },
      { id: 'cre-3', title: 'Character Depth', branches: [] },
      { id: 'cre-4', title: 'Visual Metaphor', branches: [] },
      { id: 'cre-5', title: 'Concept Mixer', branches: [] },
      { id: 'cre-6', title: 'Tone Shifter', branches: [] },
      { id: 'cre-7', title: 'Poetic Pulse', branches: [] }
    ]
  },
  { 
    id: 'persona', 
    label: 'Human', 
    icon: MessageSquare, 
    color: 'from-slate-500 to-gray-500', 
    ring: 'ring-slate-500/30',
    cells: [
      { id: 'per-1', title: 'Executive Coach', branches: [] },
      { id: 'per-2', title: 'Tech Interviewer', branches: [] },
      { id: 'per-3', title: 'Legal Eagle', branches: [] },
      { id: 'per-4', title: 'Copywriting Guru', branches: [] },
      { id: 'per-5', title: 'UX Psychologist', branches: [] },
      { id: 'per-6', title: 'Stoic Mentor', branches: [] },
      { id: 'per-7', title: 'Direct Communicator', branches: [] }
    ]
  }
];

export const REFINE_CRYSTALS = [
  { id: 'ignite', label: 'Ignite', color: 'text-red-400', shadow: 'bg-red-500', glow: 'bg-red-400', icon: Flame, desc: 'Adds high energy, provocative hooks, and extreme persuasive language.' },
  { id: 'orbit', label: 'Orbit', color: 'text-blue-400', shadow: 'bg-blue-500', glow: 'bg-blue-400', icon: Rocket, desc: 'Expands the scope, adds cross-domain connections, and future-thinking perspectives.' },
  { id: 'crystal', label: 'Crystal', color: 'text-cyan-300', shadow: 'bg-cyan-400', glow: 'bg-cyan-300', icon: Lightbulb, desc: 'Focuses on maximum clarity, removing fluff, and defining strict logical boundaries.' },
  { id: 'spark', label: 'Spark', color: 'text-yellow-400', shadow: 'bg-yellow-500', glow: 'bg-yellow-400', icon: Zap, desc: 'Focuses on rapid creativity, unexpected metaphors, and "outside the box" thinking.' },
  { id: 'zen', label: 'Zen', color: 'text-emerald-400', shadow: 'bg-emerald-500', glow: 'bg-emerald-400', icon: Wind, desc: 'Simplifies, calms the tone, and focuses on finding the most minimal, elegant solution.' },
  { id: 'sniper', label: 'Sniper', color: 'text-orange-400', shadow: 'bg-orange-500', glow: 'bg-orange-400', icon: Target, desc: 'Precision focus on a single variable, removing all distractions and edge cases.' },
  { id: 'neural', label: 'Neural', color: 'text-purple-400', shadow: 'bg-purple-500', glow: 'bg-purple-400', icon: Activity, desc: 'Adds complexity, expert terminology, and deep structured reasoning suitable for high-end LLMs.' }
];
