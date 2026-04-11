import { Handle, Position, useReactFlow } from '@xyflow/react';
import { MessageSquare, Zap, X } from 'lucide-react';

export function GlassNode({ id, data }: any) {
  const isPrompt = data.type === 'prompt';
  const Icon = isPrompt ? Zap : MessageSquare;
  const { setNodes } = useReactFlow();

  const onDelete = () => {
    setNodes((nodes) => nodes.filter((n) => n.id !== id));
  };

  return (
    <div className="glass-panel p-4 min-w-[200px] flex items-start gap-3 relative group transition-all hover:border-white/20">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white/50 border-none" />
      
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isPrompt ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 pr-4">
        <h3 className="text-sm font-semibold text-white/90 mb-1">{data.title}</h3>
        <p className="text-xs text-white/50 line-clamp-2">{data.description}</p>
      </div>

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 rounded text-white/50 transition-all font-bold"
      >
        <X className="w-3 h-3" />
      </button>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white/50 border-none" />
    </div>
  );
}
