'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Connection, Edge, Node } from '@xyflow/react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { StickyNote, MessageSquare, Zap } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useShallow } from 'zustand/react/shallow';

import { GlassNode } from '@/components/workspace/GlassNode';
import { StickyNode } from '@/components/workspace/StickyNode';
import { NeuralEdge } from '@/components/workspace/NeuralEdge';
import { WhisperPanel } from '@/components/workspace/WhisperPanel';

const nodeTypes = {
  glassNode: GlassNode,
  stickyNode: StickyNode,
};

const edgeTypes = {
  neuralEdge: NeuralEdge,
};

let id_counter = 0;
const getId = () => `node_${Date.now()}_${id_counter++}`;

function WorkspaceCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<{ screenToFlowPosition: (pos: {x: number, y: number}) => {x: number, y: number} } | null>(null);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    flowPosition: { x: number; y: number };
  } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const { items } = useLibraryStore(useShallow((s) => ({ items: s.items })));

  useEffect(() => {
    if (nodes.length === 0 && items.length > 0) {
      const newNodes: Node[] = items.slice(0, 3).map((item, idx) => ({
        id: item.id,
        type: 'glassNode',
        position: { x: 100 + idx * 350, y: 100 + idx * 50 },
        data: { title: item.title, description: item.content, type: item.type },
      }));
      setNodes(newNodes);
    }
  }, [items, nodes.length, setNodes]);

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) => addEdge({ ...params, type: 'neuralEdge' }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      const dataStr = event.dataTransfer.getData('application/json');

      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const data = dataStr
        ? JSON.parse(dataStr)
        : { title: `${type} node`, description: 'Dropped from library' };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setMenu({
        x: event.clientX,
        y: event.clientY,
        flowPosition: position,
      });
    },
    [reactFlowInstance]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, []);

  const addNodeFromMenu = (type: string, data: Record<string, unknown>) => {
    if (!menu) return;

    const newNode: Node = {
      id: getId(),
      type,
      position: menu.flowPosition,
      data,
    };

    setNodes((nds) => nds.concat(newNode));
    setMenu(null);
  };



  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const edgesWithHoverState: Edge[] = edges.map((edge) => {
    const isHovered = !!(
      hoveredNodeId &&
      (edge.source === hoveredNodeId || edge.target === hoveredNodeId)
    );
    return {
      ...edge,
      data: { ...edge.data, isHovered },
      animated: isHovered,
      style: {
        ...edge.style,
        stroke: isHovered ? 'rgba(56, 189, 248, 1)' : 'rgba(56, 189, 248, 0.4)',
        strokeWidth: isHovered ? 3 : 2,
        filter: isHovered ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))' : 'none',
        transition: 'all 0.3s ease',
      },
    };
  });

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden lg:flex-row">
      {/* AssetLibrary removed as per user request */}

      <div className="relative h-full flex-1" ref={reactFlowWrapper} onContextMenu={onContextMenu}>
        <ReactFlow
          nodes={nodes}
          edges={edgesWithHoverState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={onPaneClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-black/20"
          defaultEdgeOptions={{ type: 'neuralEdge' }}
          panOnScroll={true}
          selectionOnDrag={true}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={2}
            color="rgba(255,255,255,0.05)"
          />
          <Controls
            showInteractive={false}
            position="bottom-left"
            className="glass-panel border-white/10"
          />
        </ReactFlow>

        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/20 via-transparent to-transparent" />

        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="glass-panel fixed z-50 flex min-w-[180px] flex-col overflow-hidden rounded-xl border border-white/10 py-1 shadow-2xl"
              style={{ top: menu.y, left: menu.x }}
            >
              <div className="mb-1 border-b border-white/5 px-3 py-2 text-[10px] font-bold tracking-wider text-white/40 uppercase">
                Add to Canvas
              </div>
              <button
                className="flex items-center gap-3 px-4 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
                onClick={() => addNodeFromMenu('stickyNode', { text: '' })}
              >
                <StickyNote className="h-4 w-4 text-emerald-400" /> Sticky Note
              </button>
              <button
                className="flex items-center gap-3 px-4 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
                onClick={() =>
                  addNodeFromMenu('glassNode', {
                    type: 'chat',
                    title: 'New Chat',
                    description: 'Empty chat session',
                  })
                }
              >
                <MessageSquare className="h-4 w-4 text-blue-400" /> Chat Node
              </button>
              <button
                className="flex items-center gap-3 px-4 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
                onClick={() =>
                  addNodeFromMenu('glassNode', {
                    type: 'prompt',
                    title: 'New Prompt',
                    description: 'Empty prompt template',
                  })
                }
              >
                <Zap className="h-4 w-4 text-amber-400" /> Prompt Node
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WhisperPanel />
    </div>
  );
}

export function Workspace() {
  return (
    <ReactFlowProvider>
      <WorkspaceCanvas />
    </ReactFlowProvider>
  );
}
