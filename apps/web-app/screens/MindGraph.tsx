'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Share2, Brain, Sparkles, Bot, 
  Zap, Database, Clock, RefreshCw, Layers,
  ChevronRight, Search, Activity, Workflow,
  Maximize2, Minimize2, Filter, Info, ShieldAlert
} from 'lucide-react';
import * as d3 from 'd3';

// --- Types ---
interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  color: string;
  size: number;
  type: 'folder' | 'prompt' | 'chat';
  val: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

// --- Mock Data Generator ---
const generateGraphData = () => {
  const nodes: Node[] = [
    { id: 'root', name: 'Neural Core', color: '#ffffff', size: 40, type: 'folder', val: 100 },
    { id: 'f1', name: 'Research', color: '#10a37f', size: 30, type: 'folder', val: 80 },
    { id: 'f2', name: 'Development', color: '#8ab4f8', size: 35, type: 'folder', val: 90 },
    { id: 'f3', name: 'Creative', color: '#d97757', size: 25, type: 'folder', val: 70 },
    { id: 'f4', name: 'Personal', color: '#fbbf24', size: 20, type: 'folder', val: 60 },
    { id: 'f5', name: 'Archive', color: '#a855f7', size: 22, type: 'folder', val: 65 },
  ];

  const links: Link[] = [
    { source: 'root', target: 'f1', value: 2 },
    { source: 'root', target: 'f2', value: 2 },
    { source: 'root', target: 'f3', value: 2 },
    { source: 'root', target: 'f4', value: 2 },
    { source: 'root', target: 'f5', value: 2 },
    { source: 'f1', target: 'f2', value: 1 },
    { source: 'f2', target: 'f3', value: 1 },
  ];

  nodes.forEach(parent => {
    if (parent.id === 'root') return;
    const count = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < count; i++) {
      const id = `${parent.id}-sub-${i}`;
      nodes.push({
        id,
        name: `${parent.name} Node ${i + 1}`,
        color: parent.color,
        size: 12 + Math.random() * 8,
        type: Math.random() > 0.5 ? 'chat' : 'prompt',
        val: 30 + Math.random() * 20
      });
      links.push({ source: parent.id, target: id, value: 1 });
    }
  });

  return { nodes, links };
};

const MODELS = [
  { name: 'GPT-4o', value: 45, color: '#10a37f' },
  { name: 'Claude 3.5', value: 30, color: '#d97757' },
  { name: 'Gemini 1.5', value: 15, color: '#8ab4f8' },
  { name: 'Other', value: 10, color: '#e5e5e5' },
];

const TOPICS = [
  { name: 'AI Ethics', weight: 1.2 },
  { name: 'React', weight: 1.5 },
  { name: 'TypeScript', weight: 1.3 },
  { name: 'Neuroscience', weight: 1.8 },
  { name: 'Productivity', weight: 1.1 },
  { name: 'Design Systems', weight: 1.4 },
  { name: 'Future Tech', weight: 1.6 },
  { name: 'Quantum', weight: 1.2 },
  { name: 'Biohacking', weight: 1.4 },
];

export function MindGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [timeValue, setTimeValue] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [graphData] = useState(generateGraphData());

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation<Node>(graphData.nodes)
      .force("link", d3.forceLink<Node, Link>(graphData.links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => (d as Node).size + 20));

    const link = g.append("g")
      .attr("stroke", "rgba(255, 255, 255, 0.08)")
      .attr("stroke-opacity", 0.6)
      .selectAll<SVGLineElement, Link>("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", (d: Link) => Math.sqrt(d.value || 1));

    const node = g.append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(graphData.nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (event, d: Node) => {
        setSelectedNode(d);
        const scale = 1.5;
        svg.transition().duration(750).call(
          zoom.transform as any,
          d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-d.x!, -d.y!)
        );
      })
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", (d: Node) => d.size * 1.5)
      .attr("fill", (d: Node) => d.color)
      .attr("opacity", 0.05)
      .attr("filter", "blur(10px)");

    node.append("circle")
      .attr("r", (d: Node) => d.size)
      .attr("fill", "rgba(10, 10, 10, 0.8)")
      .attr("stroke", (d: Node) => d.color)
      .attr("stroke-width", 1.5)
      .attr("class", "glass-node");

    node.append("circle")
      .attr("r", 3)
      .attr("fill", (d: Node) => d.color)
      .attr("class", "node-pulse");

    node.append("text")
      .text((d: Node) => d.name)
      .attr("x", 0)
      .attr("y", (d: Node) => d.size + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255, 255, 255, 0.5)")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: Link) => (d.source as Node).x!)
        .attr("y1", (d: Link) => (d.source as Node).y!)
        .attr("x2", (d: Link) => (d.target as Node).x!)
        .attr("y2", (d: Link) => (d.target as Node).y!);

      node
        .attr("transform", (d: Node) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, [graphData]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-transparent font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row z-10 relative overflow-hidden">
        <div className={`relative flex-1 flex flex-col transition-all duration-500 ${isFullScreen ? 'lg:flex-[10]' : 'lg:flex-[2.5]'}`} ref={containerRef}>
          <div className="absolute top-8 left-8 z-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 backdrop-blur-xl pointer-events-auto"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                <h1 className="text-2xl font-bold tracking-tight text-white">Neural Explorer</h1>
              </div>
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">Connectivity Matrix v2.4</p>
              
              <div className="flex gap-2 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <Search className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-mono text-white/40 group-hover:text-white uppercase tracking-widest">Search Nodes</span>
                </button>
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white"
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </div>

          <svg 
            ref={svgRef} 
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.05))' }}
          />

          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                className="absolute bottom-8 left-8 z-20 w-80 glass-panel p-6 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
                      style={{ backgroundColor: `${selectedNode.color}15` }}
                    >
                      <Brain className="w-6 h-6" style={{ color: selectedNode.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{selectedNode.type}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-colors"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Connectivity</span>
                    <span className="text-xs font-bold text-white">84%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Neural Weight</span>
                    <span className="text-xs font-bold text-white">{selectedNode.val.toFixed(0)} pts</span>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
                    Focus Cluster
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!isFullScreen && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="lg:w-96 flex flex-col gap-6 p-8 border-l border-white/5 bg-black/20 backdrop-blur-xl overflow-y-auto scrollbar-hide"
            >
              <div className="glass-panel p-6 rounded-3xl border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">AI Mix Matrix</h3>
                  <Activity className="w-4 h-4 text-white/20" />
                </div>
                <div className="relative h-48 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-[1px] border-white/5 relative animate-[spin_20s_linear_infinite]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                    </div>
                  </div>
                  <div className="text-center z-10">
                    <div className="text-4xl font-bold tracking-tighter">45%</div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1">GPT-4o Dominant</div>
                  </div>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle 
                      cx="50%" cy="50%" r="60" fill="none" 
                      stroke="#10a37f" strokeWidth="12" 
                      strokeDasharray="377" strokeDashoffset={377 * (1 - 0.45)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {MODELS.map(model => (
                    <div key={model.name} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-white/40 uppercase tracking-widest">{model.name}</span>
                        <span className="text-[9px] font-mono text-white/60">{model.value}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: model.color, width: `${model.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-6">Efficiency Matrix</h3>
                <div className="space-y-3">
                  {[
                    { icon: Database, label: 'Knowledge Growth', val: '+124', unit: 'Artifacts', color: '#10a37f' },
                    { icon: Clock, label: 'Time Optimized', val: '14.5h', unit: 'Saved', color: '#8ab4f8' },
                    { icon: Zap, label: 'Neural Sync', val: '94%', unit: 'Accuracy', color: '#a855f7' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-default">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white/80">{item.label}</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest">{item.unit}</div>
                      </div>
                      <div className="ml-auto text-xs font-mono font-bold" style={{ color: item.color }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/5 flex-1">
                <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-6">Topic Heatmap</h3>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic, i) => (
                    <motion.div
                      key={topic.name}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/50 cursor-default transition-all"
                      style={{ 
                        opacity: 0.4 + topic.weight * 0.3,
                        borderLeft: `2px solid rgba(255,255,255,${topic.weight * 0.2})`
                      }}
                    >
                      {topic.name}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-24 px-10 flex flex-col justify-center border-t border-white/5 bg-black/40 backdrop-blur-3xl z-30 shrink-0">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Timeline Explorer</span>
              <div className="h-px w-12 bg-white/10" />
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">Active Sync</span>
            </div>
            <span className="text-[10px] font-mono text-white/60 tracking-[0.2em]">MARCH 2026</span>
          </div>
          
          <div className="relative h-1.5 w-full bg-white/5 rounded-full group">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
              style={{ width: `${timeValue}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={timeValue} 
              onChange={(e) => setTimeValue(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] pointer-events-none transition-all duration-300 border-4 border-black"
              style={{ left: `calc(${timeValue}% - 8px)` }}
            />
          </div>
          
          <div className="flex justify-between mt-3 px-1">
            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'].map(m => (
              <span key={m} className={`text-[9px] font-mono transition-colors ${m === 'MAR' ? 'text-white' : 'text-white/10'}`}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-node {
          backdrop-filter: blur(8px);
        }
        .node-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          70% { transform: scale(1.2); opacity: 0.5; box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .neural-edge-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 5s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
}
