import type { EdgeProps, Edge } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';

export function NeuralEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<Edge<{ isHovered: boolean }>>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isHovered = data?.isHovered;

  return (
    <>
      {/* Background glow path */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd || ''} 
        style={{ 
          ...style, 
          stroke: isHovered ? 'rgba(56, 189, 248, 0.6)' : 'rgba(56, 189, 248, 0.2)', 
          strokeWidth: isHovered ? 8 : 6, 
          filter: isHovered ? 'blur(6px)' : 'blur(4px)',
          transition: 'all 0.3s ease'
        }} 
      />
      
      {/* Animated dashed path */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd || ''} 
        style={{ 
          ...style, 
          stroke: isHovered ? 'rgba(56, 189, 248, 1)' : 'rgba(56, 189, 248, 0.8)', 
          strokeWidth: isHovered ? 3 : 2,
          transition: 'all 0.3s ease'
        }} 
        className={isHovered ? "neural-edge-path-fast" : "neural-edge-path"}
      />
    </>
  );
}
