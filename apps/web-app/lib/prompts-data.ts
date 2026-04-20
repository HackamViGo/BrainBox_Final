import {
  Shield,
  Brain,
  Search,
  Code,
  Cpu,
  Sparkles,
  MessageSquare,
  Flame,
  Rocket,
  Lightbulb,
  Zap,
  Wind,
  Target,
  Activity,
} from 'lucide-react';

export const MATRIX_DATA = [
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    ring: 'ring-red-500/30',
    cells: [
      {
        id: 'sec-1',
        title: 'Injection Guard',
        content:
          'Act as a security auditor. Verify if the following code is vulnerable to SQL or Prompt injection: [CODE]',
        branches: [
          { id: 'b1', name: 'v1.1 (Production-Ready)' },
          { id: 'b2', name: 'v1.2 (Strict Mode)' },
        ],
      },
      {
        id: 'sec-2',
        title: 'Data Sanitizer',
        content:
          'Transform the following raw input into a sanitized JSON object, removing all PII or sensitive metadata: [INPUT]',
        branches: [],
      },
      {
        id: 'sec-3',
        title: 'Privacy Shield',
        content:
          'Analyze the following dataset for privacy leaks. Ensure it complies with GDPR and CCPA principles.',
        branches: [{ id: 'b3', name: 'v2.0 (GDPR Focus)' }],
      },
      {
        id: 'sec-4',
        title: 'Threat Discovery',
        content:
          'Evaluate this architecture diagram for potential attack vectors. Focus on authentication and lateral movement.',
        branches: [],
      },
      {
        id: 'sec-5',
        title: 'IAM Auditor',
        content:
          'Review these AWS IAM policies for misconfigurations and over-privileged permissions.',
        branches: [],
      },
      {
        id: 'sec-6',
        title: 'Zero Trust Logic',
        content:
          'Redesign the following network access flow using Zero Trust principles (Verify Explicitly, Use Least Privilege, Assume Breach).',
        branches: [],
      },
      {
        id: 'sec-7',
        title: 'Kernel Guard',
        content:
          'Analyze this C code for potential buffer overflows or memory safety issues at the kernel level.',
        branches: [],
      },
    ],
  },
  {
    id: 'logic',
    label: 'Logic',
    icon: Brain,
    color: 'from-blue-500 to-indigo-500',
    ring: 'ring-blue-500/30',
    cells: [
      {
        id: 'log-1',
        title: 'Socratic Method',
        content:
          'Engage in a Socratic dialogue about [TOPIC]. Ask probing questions to uncover my underlying assumptions.',
        branches: [{ id: 'b4', name: 'v4.2 (Philosophy)' }],
      },
      {
        id: 'log-2',
        title: 'First Principles',
        content:
          'Break down [PROBLEM] into its absolute fundamental truths. Rebuild the solution from the ground up.',
        branches: [],
      },
      {
        id: 'log-3',
        title: 'Scientific Method',
        content:
          'Formulate a testable hypothesis for [OBSERVATION]. Design an experiment with clear variables and failure criteria.',
        branches: [],
      },
      {
        id: 'log-4',
        title: 'Double Check',
        content:
          'Review the following logic step-by-step. Identify where a mistake is most likely to have occurred.',
        branches: [],
      },
      {
        id: 'log-5',
        title: 'Lateral Thinking',
        content:
          'Provide 5 highly unconventional solutions to [CHALLENGE], ignoring traditional constraints.',
        branches: [],
      },
      {
        id: 'log-6',
        title: 'Edge Case Finder',
        content: 'Analyze this system for 10 unlikely but catastrophic failure scenarios.',
        branches: [],
      },
      {
        id: 'log-7',
        title: 'Systems Analysis',
        content:
          'Map the feedback loops and hidden dependencies in the following organizational structure.',
        branches: [],
      },
    ],
  },
  {
    id: 'search',
    label: 'Analysis',
    icon: Search,
    color: 'from-emerald-500 to-teal-500',
    ring: 'ring-emerald-500/30',
    cells: [
      {
        id: 'sea-1',
        title: 'Semantic Deep-Dive',
        content:
          'Conduct a semantic deep-dive into the following text. Identify latent themes, ontological structures, and hidden intent: [TEXT]',
        branches: [],
      },
      {
        id: 'sea-2',
        title: 'Patent Analyst',
        content:
          'Act as a patent analyst. Evaluate the following invention disclosure for novelty, non-obviousness, and prior art potential: [DISCLOSURE]',
        branches: [],
      },
      {
        id: 'sea-3',
        title: 'Market Sentiment',
        content:
          'Analyze the following social media feed for market sentiment. Identify bullish/bearish trends and key influencers: [FEED]',
        branches: [],
      },
      {
        id: 'sea-4',
        title: 'Visual Pattern',
        content:
          'Describe the visual patterns and compositional elements in this image description for an AI generator: [DESCRIPTION]',
        branches: [],
      },
      {
        id: 'sea-5',
        title: 'Trend Forecaster',
        content:
          'Based on the following data points, forecast 3 macro trends for the next 18 months in the [INDUSTRY] sector: [DATA]',
        branches: [],
      },
      {
        id: 'sea-6',
        title: 'Correlation Bot',
        content:
          'Identify potential correlations between [VARIABLE A] and [VARIABLE B] given the following datasets: [DATA]',
        branches: [],
      },
      {
        id: 'sea-7',
        title: 'Signal Extractor',
        content:
          'Separate the signal from the noise in the following report. Identify the 3 most actionable insights: [REPORT]',
        branches: [],
      },
    ],
  },
  {
    id: 'code',
    label: 'Structure',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    ring: 'ring-purple-500/30',
    cells: [
      {
        id: 'cod-1',
        title: 'Architectural Blueprint',
        content:
          'Create a high-level architectural blueprint for a [SYSTEM TYPE] that must support [SCALABILITY/RELIABILITY] requirements.',
        branches: [],
      },
      {
        id: 'cod-2',
        title: 'Refactoring Engine',
        content:
          'Refactor the following code to adhere to SOLID principles and improve readability: [CODE]',
        branches: [],
      },
      {
        id: 'cod-3',
        title: 'API Spec Designer',
        content:
          'Design a RESTful API specification for [SERVICE]. Include endpoints, request schemas, and error codes in OpenAPI format.',
        branches: [],
      },
      {
        id: 'cod-4',
        title: 'Test Case Factory',
        content:
          'Generate a comprehensive suite of unit tests for the following function, covering edge cases and boundary conditions: [FUNCTION]',
        branches: [],
      },
      {
        id: 'cod-5',
        title: 'DB Schema Planner',
        content:
          'Design a normalized database schema for a [APP TYPE] using [SQL/NoSQL]. Provide the ERD logic and primary keys.',
        branches: [],
      },
      {
        id: 'cod-6',
        title: 'Security Auditor (Code)',
        content:
          'Review the following code for OWASP Top 10 vulnerabilities. Focus on authentication and data exposure: [CODE]',
        branches: [],
      },
      {
        id: 'cod-7',
        title: 'Regex Wizard',
        content:
          'Create a robust regular expression to match [PATTERN]. Explain the logic and provide test cases.',
        branches: [],
      },
    ],
  },
  {
    id: 'system',
    label: 'Reasoning',
    icon: Cpu,
    color: 'from-cyan-500 to-blue-500',
    ring: 'ring-cyan-500/30',
    cells: [
      {
        id: 'sys-1',
        title: 'Chain of Thought',
        content:
          'Solve [PROBLEM] by breaking it down into a logical step-by-step sequence. Show your reasoning for each transition.',
        branches: [],
      },
      {
        id: 'sys-2',
        title: 'Tree of Thoughts',
        content:
          'Explore 3 different approaches to solve [PROBLEM]. Evaluate each branch and select the one with the highest success probability.',
        branches: [],
      },
      {
        id: 'sys-3',
        title: 'Self-Consistency',
        content:
          'Analyze [CLAIM] from multiple logical angles. If the conclusions differ, explain the discrepancies and reach a consensus.',
        branches: [],
      },
      {
        id: 'sys-4',
        title: 'Active Prompting',
        content:
          'Act as an active learner. Ask me 3 questions to clarify [TASK] before providing your first output.',
        branches: [],
      },
      {
        id: 'sys-5',
        title: 'Multi-Perspective',
        content:
          'Evaluate [DECISION] from the perspectives of a CEO, a Developer, and an End-User. Identify common ground.',
        branches: [],
      },
      {
        id: 'sys-6',
        title: 'Algorithmic Prompt',
        content:
          'Deconstruct [PROCESS] into a pseudocode algorithm that a model can follow deterministically.',
        branches: [],
      },
      {
        id: 'sys-7',
        title: 'Least-to-Most',
        content:
          'Starting with the simplest components of [COMPLEX TASK], gradually build up to the full solution.',
        branches: [],
      },
    ],
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: Sparkles,
    color: 'from-amber-500 to-pink-500',
    ring: 'ring-amber-500/30',
    cells: [
      {
        id: 'cre-1',
        title: 'World Builder',
        content:
          'Create a detailed lore for a [GENRE] world focusing on its unique physical laws and societal hierarchies.',
        branches: [],
      },
      {
        id: 'cre-2',
        title: 'Narrative Arc',
        content:
          'Design a 5-act narrative arc for a story about [THEME]. Include key plot points and character evolution.',
        branches: [],
      },
      {
        id: 'cre-3',
        title: 'Character Depth',
        content:
          'Develop a multidimensional character profile for [NAME]. Focus on internal conflicts, motivations, and fatal flaws.',
        branches: [],
      },
      {
        id: 'cre-4',
        title: 'Visual Metaphor',
        content:
          'Suggest 3 evocative visual metaphors to represent the abstract concept of [CONCEPT] in a digital art series.',
        branches: [],
      },
      {
        id: 'cre-5',
        title: 'Concept Mixer',
        content:
          'Synthesize the aesthetic of [STYLE A] with the functionality of [OBJECT B]. Describe the resulting hybrid.',
        branches: [],
      },
      {
        id: 'cre-6',
        title: 'Tone Shifter',
        content:
          'Rewrite the following text in a [TONE] style, maintaining the core information: [TEXT]',
        branches: [],
      },
      {
        id: 'cre-7',
        title: 'Poetic Pulse',
        content:
          'Compose a poem that captures the rhythm and essence of [RHYTHM/OBJECT], using specific sensory imagery.',
        branches: [],
      },
    ],
  },
  {
    id: 'persona',
    label: 'Human',
    icon: MessageSquare,
    color: 'from-slate-500 to-gray-500',
    ring: 'ring-slate-500/30',
    cells: [
      {
        id: 'per-1',
        title: 'Executive Coach',
        content:
          'Act as an executive coach. Provide feedback on my leadership approach in the following situation: [SITUATION]',
        branches: [],
      },
      {
        id: 'per-2',
        title: 'Tech Interviewer',
        content:
          'Act as a Senior Software Engineer at a Tier 1 tech company. Conduct a mock technical interview for [POSITION].',
        branches: [],
      },
      {
        id: 'per-3',
        title: 'Legal Eagle',
        content:
          'Act as a legal consultant. Review the following clause for ambiguity and potential liability: [CLAUSE]',
        branches: [],
      },
      {
        id: 'per-4',
        title: 'Copywriting Guru',
        content:
          'Act as a world-class copywriter. Rewrite the following landing page headline to maximize conversions: [HEADLINE]',
        branches: [],
      },
      {
        id: 'per-5',
        title: 'UX Psychologist',
        content:
          'Analyze the following user journey through a psychological lens. Identify friction points and cognitive load issues.',
        branches: [],
      },
      {
        id: 'per-6',
        title: 'Stoic Mentor',
        content:
          'Act as a Stoic philosopher. Provide guidance on how to maintain tranquility in the face of [ADVERSITY].',
        branches: [],
      },
      {
        id: 'per-7',
        title: 'Direct Communicator',
        content:
          'Act as a direct and radical candor communicator. Strip the politeness from the following feedback to its core truth: [FEEDBACK]',
        branches: [],
      },
    ],
  },
];

export const REFINE_CRYSTALS = [
  {
    id: 'ignite',
    label: 'Ignite',
    color: 'text-red-400',
    shadow: 'bg-red-500',
    glow: 'bg-red-400',
    icon: Flame,
    desc: 'Adds high energy, provocative hooks, and extreme persuasive language.',
  },
  {
    id: 'orbit',
    label: 'Orbit',
    color: 'text-blue-400',
    shadow: 'bg-blue-500',
    glow: 'bg-blue-400',
    icon: Rocket,
    desc: 'Expands the scope, adds cross-domain connections, and future-thinking perspectives.',
  },
  {
    id: 'crystal',
    label: 'Crystal',
    color: 'text-cyan-300',
    shadow: 'bg-cyan-400',
    glow: 'bg-cyan-300',
    icon: Lightbulb,
    desc: 'Focuses on maximum clarity, removing fluff, and defining strict logical boundaries.',
  },
  {
    id: 'spark',
    label: 'Spark',
    color: 'text-yellow-400',
    shadow: 'bg-yellow-500',
    glow: 'bg-yellow-400',
    icon: Zap,
    desc: 'Focuses on rapid creativity, unexpected metaphors, and "outside the box" thinking.',
  },
  {
    id: 'zen',
    label: 'Zen',
    color: 'text-emerald-400',
    shadow: 'bg-emerald-500',
    glow: 'bg-emerald-400',
    icon: Wind,
    desc: 'Simplifies, calms the tone, and focuses on finding the most minimal, elegant solution.',
  },
  {
    id: 'sniper',
    label: 'Sniper',
    color: 'text-orange-400',
    shadow: 'bg-orange-500',
    glow: 'bg-orange-400',
    icon: Target,
    desc: 'Precision focus on a single variable, removing all distractions and edge cases.',
  },
  {
    id: 'neural',
    label: 'Neural',
    color: 'text-purple-400',
    shadow: 'bg-purple-500',
    glow: 'bg-purple-400',
    icon: Activity,
    desc: 'Adds complexity, expert terminology, and deep structured reasoning suitable for high-end LLMs.',
  },
];
