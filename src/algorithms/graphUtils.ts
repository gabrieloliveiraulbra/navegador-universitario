import type { CampusNode, CampusEdge } from '../types';

// ─── Graph Adjacency Helpers ──────────────────────────────────────────────────

export interface AdjEntry {
  nodeId: string;
  weight: number;
  edgeKey: string;
}

export function buildAdjacency(
  nodes: CampusNode[],
  edges: CampusEdge[],
): Map<string, AdjEntry[]> {
  const adj = new Map<string, AdjEntry[]>();
  for (const n of nodes) adj.set(n.id, []);

  for (const e of edges) {
    const key = edgeKey(e.source, e.target);
    adj.get(e.source)!.push({ nodeId: e.target, weight: e.weight, edgeKey: key });
    adj.get(e.target)!.push({ nodeId: e.source, weight: e.weight, edgeKey: key });
  }
  return adj;
}

export function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('--');
}

export function euclidean(a: CampusNode, b: CampusNode): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
