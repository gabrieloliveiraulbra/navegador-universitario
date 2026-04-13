import { useRef } from 'react';
import type { CampusNode, CampusEdge, NodeState, EdgeState } from '../types';
import { ComplexBackgrounds } from './ComplexBackgrounds';
import { GraphEdges } from './GraphEdges';
import { GraphNode } from './GraphNode';
import { MapPin } from 'lucide-react';

interface GraphCanvasProps {
  nodes: CampusNode[];
  edges: CampusEdge[];
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<string, EdgeState>;
  startId: string;
  endId: string;
  clickMode: 'start' | 'end';
  onNodeClick: (id: string) => void;
}

export function GraphCanvas({
  nodes,
  edges,
  nodeStates,
  edgeStates,
  startId,
  endId,
  clickMode,
  onNodeClick,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const isStart = clickMode === 'start';
  const modeColor = isStart ? '#6366f1' : '#e11d48';
  const modeLabel = isStart ? 'Clique para definir PARTIDA' : 'Clique para definir CHEGADA';

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: '#0a0e18' }}>
      {/* Grid lines */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* ── Click-mode HUD badge ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 14,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '6px 12px',
          borderRadius: 20,
          background: `${modeColor}22`,
          border: `1.5px solid ${modeColor}66`,
          backdropFilter: 'blur(6px)',
          transition: 'all 0.25s ease',
          pointerEvents: 'none',
        }}
      >
        <MapPin size={12} color={modeColor} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: modeColor,
            letterSpacing: '0.04em',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          {modeLabel}
        </span>
        {/* Blinking dot */}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: modeColor,
            display: 'inline-block',
            animation: 'visiting-pulse 1s ease-in-out infinite',
          }}
        />
      </div>

      {/* Main SVG graph */}
      <svg
        ref={svgRef}
        viewBox="0 0 900 620"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Complex background blobs */}
        <ComplexBackgrounds nodes={nodes} />

        {/* Edges */}
        <GraphEdges nodes={nodes} edges={edges} edgeStates={edgeStates} />

        {/* Nodes */}
        {nodes.map((node) => (
          <GraphNode
            key={node.id}
            node={node}
            state={nodeStates[node.id] ?? 'unvisited'}
            isSelected={node.id === startId || node.id === endId}
            onClick={onNodeClick}
          />
        ))}
      </svg>
    </div>
  );
}
