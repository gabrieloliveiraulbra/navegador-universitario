import type { CampusNode, NodeType, NodeState } from '../types';

// ─── Node Colors per State ────────────────────────────────────────────────────

export const NODE_STATE_COLORS: Record<NodeState, { bg: string; ring: string; icon: string }> = {
  unvisited: { bg: '#1e2535', ring: '#2a3347', icon: '#8892a4' },
  visiting:  { bg: '#78350f', ring: '#f59e0b', icon: '#fcd34d' },
  visited:   { bg: '#1e3a5f', ring: '#3b82f6', icon: '#60a5fa' },
  path:      { bg: '#064e3b', ring: '#10b981', icon: '#34d399' },
  start:     { bg: '#312e81', ring: '#6366f1', icon: '#a5b4fc' },
  end:       { bg: '#4c0519', ring: '#e11d48', icon: '#fb7185' },
};

// ─── Pure SVG Icons (no foreignObject — avoids blocking pointer events) ───────
// Each icon is drawn with SVG primitives so clicks pass through to the <g> handler.

function IconLibrary({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
      {/* Book shape */}
      <rect x={-7} y={-8} width={14} height={16} rx={1.5} />
      <line x1={-2} y1={-8} x2={-2} y2={8} />
      <line x1={-5} y1={-4} x2={-3} y2={-4} />
      <line x1={-5} y1={-1} x2={-3} y2={-1} />
      <line x1={-5} y1={2}  x2={-3} y2={2}  />
    </g>
  );
}

function IconClassroom({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
      {/* Monitor */}
      <rect x={-7} y={-6} width={14} height={9} rx={1.5} />
      <line x1={-3} y1={3} x2={3} y2={3} />
      <line x1={0}  y1={3} x2={0} y2={6} />
      <line x1={-3} y1={6} x2={3} y2={6} />
    </g>
  );
}

function IconCafeteria({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
      {/* Coffee cup */}
      <path d="M-6,-2 L-6,5 Q-6,7 -4,7 L4,7 Q6,7 6,5 L6,-2 Z" />
      <path d="M6,0 Q9,0 9,3 Q9,6 6,6" />
      <line x1={-3} y1={-6} x2={-3} y2={-3} />
      <line x1={0}  y1={-7} x2={0}  y2={-4} />
      <line x1={3}  y1={-6} x2={3}  y2={-3} />
    </g>
  );
}

function IconEntrance({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
      {/* House */}
      <polyline points="-8,2 0,-7 8,2" />
      <rect x={-6} y={2} width={12} height={6} rx={0.5} />
      <rect x={-2} y={4} width={4} height={4} rx={0.5} />
    </g>
  );
}

function IconRestArea({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
      {/* Smiley */}
      <circle cx={0} cy={0} r={7} />
      <path d="M-3,2 Q0,5 3,2" />
      <circle cx={-2.5} cy={-2} r={0.8} fill={color} stroke="none" />
      <circle cx={2.5}  cy={-2} r={0.8} fill={color} stroke="none" />
    </g>
  );
}

function NodeIcon({ type, color }: { type: NodeType; color: string }) {
  switch (type) {
    case 'library':   return <IconLibrary color={color} />;
    case 'classroom': return <IconClassroom color={color} />;
    case 'cafeteria': return <IconCafeteria color={color} />;
    case 'entrance':  return <IconEntrance color={color} />;
    case 'rest_area': return <IconRestArea color={color} />;
    default:          return null;
  }
}

// ─── Node Renderer ────────────────────────────────────────────────────────────

interface GraphNodeProps {
  node: CampusNode;
  state: NodeState;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function GraphNode({ node, state, isSelected, onClick }: GraphNodeProps) {
  const colors = NODE_STATE_COLORS[state];
  const r = 22;
  const isVisiting = state === 'visiting';
  const isPath = state === 'path';

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => onClick(node.id)}
      style={{ cursor: 'pointer' }}
      className={isVisiting ? 'visiting-node' : ''}
    >
      {/* Transparent hit area — always on top of everything for reliable clicking */}
      <circle r={r + 8} fill="transparent" stroke="none" />

      {/* Pulse ring for visiting */}
      {isVisiting && (
        <circle r={r + 6} fill="none" stroke={colors.ring} strokeWidth={1.5} opacity={0.6}
          style={{ animation: 'pulse-ring 1s ease-out infinite', pointerEvents: 'none' }}
        />
      )}

      {/* Path glow */}
      {isPath && (
        <circle r={r + 4} fill={colors.ring} opacity={0.2} style={{ pointerEvents: 'none' }} />
      )}

      {/* Selection ring */}
      {isSelected && (
        <circle r={r + 7} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="4 3" opacity={0.8}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Main circle */}
      <circle
        r={r}
        fill={colors.bg}
        stroke={colors.ring}
        strokeWidth={isPath ? 2.5 : 1.5}
        style={{ pointerEvents: 'none' }}
      />

      {/* Pure SVG icon — no foreignObject, no click blocking */}
      <NodeIcon type={node.type} color={colors.icon} />

      {/* Label */}
      <text
        y={r + 14}
        textAnchor="middle"
        fill={state === 'unvisited' ? '#8892a4' : colors.icon}
        fontSize={10}
        fontFamily="Inter, sans-serif"
        fontWeight={isPath ? 600 : 400}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {node.label.length > 18 ? node.label.slice(0, 16) + '…' : node.label}
      </text>
    </g>
  );
}
