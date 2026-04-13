import type { CampusNode, CampusEdge, EdgeState } from '../types';
import { edgeKey } from '../algorithms/graphUtils';

const EDGE_COLORS: Record<EdgeState, string> = {
  unvisited: '#2a3347',
  visited:   '#3b82f6',
  path:      '#10b981',
};

const EDGE_WIDTH: Record<EdgeState, number> = {
  unvisited: 1.5,
  visited:   2,
  path:      3.5,
};

interface GraphEdgesProps {
  nodes: CampusNode[];
  edges: CampusEdge[];
  edgeStates: Record<string, EdgeState>;
}

export function GraphEdges({ nodes, edges, edgeStates }: GraphEdgesProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <g>
      {edges.map((edge) => {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) return null;
        const ek = edgeKey(edge.source, edge.target);
        const state: EdgeState = edgeStates[ek] ?? 'unvisited';
        const color = EDGE_COLORS[state];
        const width = EDGE_WIDTH[state];
        const mx = (src.x + tgt.x) / 2;
        const my = (src.y + tgt.y) / 2;

        return (
          <g key={ek}>
            {/* Glow layer for path */}
            {state === 'path' && (
              <line
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke="#10b981" strokeWidth={8} opacity={0.2}
                strokeLinecap="round"
              />
            )}
            <line
              x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
            {/* Weight label */}
            <rect
              x={mx - 12} y={my - 9}
              width={24} height={15}
              rx={4}
              fill="#0f1117"
              opacity={0.85}
            />
            <text
              x={mx} y={my + 2}
              textAnchor="middle"
              fill={state === 'path' ? '#10b981' : state === 'visited' ? '#60a5fa' : '#4a5568'}
              fontSize={9}
              fontFamily="JetBrains Mono, monospace"
              fontWeight={600}
              style={{ userSelect: 'none' }}
            >
              {edge.weight}m
            </text>
          </g>
        );
      })}
    </g>
  );
}
