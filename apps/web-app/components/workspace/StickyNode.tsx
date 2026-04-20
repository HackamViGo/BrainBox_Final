import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export function StickyNode({ id, data }: { id: string; data: { text?: string } }) {
  const [text, setText] = useState(data.text || '');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setNodes } = useReactFlow();

  const onDelete = () => {
    setNodes((nodes) => nodes.filter((n) => n.id !== id));
  };

  return (
    <div className={`glass-panel-light flex flex-col relative group transition-all hover:border-white/20 shadow-xl shadow-black/40 ${isCollapsed ? 'w-[240px] h-[40px]' : 'w-[240px] h-[160px]'}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white/50 border-none" />
      
      <div className="w-full h-10 bg-white/5 rounded-t-md cursor-grab active:cursor-grabbing flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-white/10 rounded text-white/70 transition-colors">
            {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
          <button onClick={onDelete} className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded text-white/70 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <textarea
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-white/80 placeholder-white/30 p-3"
          placeholder="Type your note here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()} // Prevent dragging when typing
        />
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white/50 border-none" />
    </div>
  );
}
