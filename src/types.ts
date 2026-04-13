// ─── Domain Types ────────────────────────────────────────────────────────────

export type NodeType = 'classroom' | 'library' | 'cafeteria' | 'entrance' | 'rest_area';

export type ComplexName =
  | 'Complexo de Informática'
  | 'Complexo de Medicina'
  | 'Complexo de Direito'
  | 'Área Central';

export interface CampusNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: NodeType;
  complex?: ComplexName;
}

export interface CampusEdge {
  source: string;
  target: string;
  weight: number; // walking time in minutes
}

export interface CampusGraph {
  nodes: CampusNode[];
  edges: CampusEdge[];
}

// ─── Algorithm Types ─────────────────────────────────────────────────────────

export type AlgorithmId = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export interface AlgorithmInfo {
  id: AlgorithmId;
  name: string;
  description: string;
  badge: 'badge-blue' | 'badge-amber' | 'badge-green' | 'badge-purple';
}

// ─── Visual State ─────────────────────────────────────────────────────────────

export type NodeState = 'unvisited' | 'visiting' | 'visited' | 'path' | 'start' | 'end';
export type EdgeState = 'unvisited' | 'visited' | 'path';

export interface VisualState {
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<string, EdgeState>;
}

// ─── Animation Step ───────────────────────────────────────────────────────────

export interface AnimationStep {
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<string, EdgeState>;
  logMessage: string;
}

// ─── Search Result ────────────────────────────────────────────────────────────

export interface SearchResult {
  steps: AnimationStep[];
  path: string[];          // final path node IDs
  totalWeight: number;
  found: boolean;
}
