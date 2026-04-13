import type { CampusNode, CampusEdge, AnimationStep, SearchResult, NodeState, EdgeState } from '../types';
import { buildAdjacency, edgeKey } from './graphUtils';

// ─── Step Builder Helpers ─────────────────────────────────────────────────────

function initStates(nodes: CampusNode[], start: string, end: string) {
  const ns: Record<string, NodeState> = {};
  const es: Record<string, EdgeState> = {};
  for (const n of nodes) ns[n.id] = 'unvisited';
  ns[start] = 'start';
  ns[end] = 'end';
  return { ns, es };
}

function cloneState(
  ns: Record<string, NodeState>,
  es: Record<string, EdgeState>,
): { ns: Record<string, NodeState>; es: Record<string, EdgeState> } {
  return { ns: { ...ns }, es: { ...es } };
}

function buildPathSteps(
  path: string[],
  ns: Record<string, NodeState>,
  es: Record<string, EdgeState>,
  totalWeight: number,
  startLabel: string,
  endLabel: string,
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const newNs = { ...ns };
  const newEs = { ...es };

  for (let i = 0; i < path.length; i++) {
    newNs[path[i]] = 'path';
    if (i > 0) newEs[edgeKey(path[i - 1], path[i])] = 'path';
    steps.push({
      nodeStates: { ...newNs },
      edgeStates: { ...newEs },
      logMessage:
        i === path.length - 1
          ? `✅ Rota encontrada! ${startLabel} → ${endLabel} | Tempo total: ${totalWeight} min`
          : `🟢 Marcando rota: ${path[i]}`,
    });
  }
  return steps;
}

// ─── BFS ─────────────────────────────────────────────────────────────────────

export function runBFS(
  nodes: CampusNode[],
  edges: CampusEdge[],
  startId: string,
  endId: string,
): SearchResult {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adj = buildAdjacency(nodes, edges);
  const { ns, es } = initStates(nodes, startId, endId);
  const steps: AnimationStep[] = [];

  steps.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    logMessage: `🔵 BFS iniciado em "${nodeMap.get(startId)!.label}". Expandindo por camadas…`,
  });

  const visited = new Set<string>([startId]);
  const parent = new Map<string, string>();
  const parentEdge = new Map<string, string>();
  const queue: string[] = [startId];
  let found = false;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current !== startId && current !== endId) {
      ns[current] = 'visiting';
      steps.push({
        nodeStates: { ...ns },
        edgeStates: { ...es },
        logMessage: `🔍 Visitando: "${nodeMap.get(current)!.label}"`,
      });
    }

    for (const { nodeId: neighbor, edgeKey: ek } of adj.get(current)!) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        parentEdge.set(neighbor, ek);

        const st = cloneState(ns, es);
        st.es[ek] = 'visited';
        if (neighbor !== endId) st.ns[neighbor] = 'visiting';
        steps.push({
          nodeStates: st.ns,
          edgeStates: st.es,
          logMessage: `📡 Descoberto: "${nodeMap.get(neighbor)!.label}" (${ek.split('--').join(' → ')})`,
        });
        Object.assign(es, { [ek]: 'visited' });
        if (neighbor !== endId) ns[neighbor] = 'visiting';

        if (neighbor === endId) {
          found = true;
          break;
        }
        queue.push(neighbor);
      }
    }

    if (current !== startId && current !== endId) ns[current] = 'visited';
    if (found) break;
  }

  if (!found) {
    steps.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      logMessage: '❌ Caminho não encontrado.',
    });
    return { steps, path: [], totalWeight: 0, found: false };
  }

  // Reconstruct path
  const path: string[] = [];
  let cur = endId;
  let totalWeight = 0;
  while (cur !== startId) {
    const prev = parent.get(cur)!;
    const ek = edgeKey(prev, cur);
    const edge = edges.find((e) => edgeKey(e.source, e.target) === ek);
    totalWeight += edge?.weight ?? 0;
    path.unshift(cur);
    cur = prev;
  }
  path.unshift(startId);

  const pathSteps = buildPathSteps(
    path,
    ns,
    es,
    totalWeight,
    nodeMap.get(startId)!.label,
    nodeMap.get(endId)!.label,
  );
  return { steps: [...steps, ...pathSteps], path, totalWeight, found: true };
}

// ─── DFS ─────────────────────────────────────────────────────────────────────

export function runDFS(
  nodes: CampusNode[],
  edges: CampusEdge[],
  startId: string,
  endId: string,
): SearchResult {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adj = buildAdjacency(nodes, edges);
  const { ns, es } = initStates(nodes, startId, endId);
  const steps: AnimationStep[] = [];

  steps.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    logMessage: `🟡 DFS iniciado em "${nodeMap.get(startId)!.label}". Explorando profundamente…`,
  });

  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const parentEdge = new Map<string, string>();
  let found = false;

  function dfs(current: string): boolean {
    visited.add(current);

    if (current !== startId && current !== endId) {
      ns[current] = 'visiting';
      steps.push({
        nodeStates: { ...ns },
        edgeStates: { ...es },
        logMessage: `🔍 Explorando fundo: "${nodeMap.get(current)!.label}"`,
      });
    }

    if (current === endId) return true;

    for (const { nodeId: neighbor, edgeKey: ek } of adj.get(current)!) {
      if (!visited.has(neighbor)) {
        parent.set(neighbor, current);
        parentEdge.set(neighbor, ek);
        es[ek] = 'visited';
        if (neighbor !== endId) ns[neighbor] = 'visiting';
        steps.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          logMessage: `📡 Avançando para: "${nodeMap.get(neighbor)!.label}"`,
        });

        if (dfs(neighbor)) return true;

        // Backtrack
        if (neighbor !== endId) ns[neighbor] = 'visited';
        steps.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          logMessage: `↩️ Retrocedendo de "${nodeMap.get(neighbor)!.label}"`,
        });
      }
    }

    if (current !== startId && current !== endId) ns[current] = 'visited';
    return false;
  }

  found = dfs(startId);

  if (!found) {
    steps.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      logMessage: '❌ Caminho não encontrado.',
    });
    return { steps, path: [], totalWeight: 0, found: false };
  }

  const path: string[] = [];
  let cur = endId;
  let totalWeight = 0;
  while (cur !== startId) {
    const prev = parent.get(cur)!;
    const ek = edgeKey(prev, cur);
    const edge = edges.find((e) => edgeKey(e.source, e.target) === ek);
    totalWeight += edge?.weight ?? 0;
    path.unshift(cur);
    cur = prev;
  }
  path.unshift(startId);

  const pathSteps = buildPathSteps(
    path,
    ns,
    es,
    totalWeight,
    nodeMap.get(startId)!.label,
    nodeMap.get(endId)!.label,
  );
  return { steps: [...steps, ...pathSteps], path, totalWeight, found: true };
}

// ─── Dijkstra ─────────────────────────────────────────────────────────────────

export function runDijkstra(
  nodes: CampusNode[],
  edges: CampusEdge[],
  startId: string,
  endId: string,
): SearchResult {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adj = buildAdjacency(nodes, edges);
  const { ns, es } = initStates(nodes, startId, endId);
  const steps: AnimationStep[] = [];

  steps.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    logMessage: `🟢 Dijkstra iniciado em "${nodeMap.get(startId)!.label}". Priorizando menor tempo…`,
  });

  const dist = new Map<string, number>();
  const parent = new Map<string, string>();
  const parentEdge = new Map<string, string>();
  const visited = new Set<string>();

  for (const n of nodes) dist.set(n.id, Infinity);
  dist.set(startId, 0);

  // Simple priority queue (min-heap via sorted array for clarity)
  type PQEntry = { id: string; cost: number };
  const pq: PQEntry[] = [{ id: startId, cost: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { id: current, cost } = pq.shift()!;

    if (visited.has(current)) continue;
    visited.add(current);

    if (current !== startId && current !== endId) {
      ns[current] = 'visiting';
      steps.push({
        nodeStates: { ...ns },
        edgeStates: { ...es },
        logMessage: `⚖️ Processando "${nodeMap.get(current)!.label}" | dist=${cost} min`,
      });
    }

    if (current === endId) break;

    for (const { nodeId: neighbor, weight, edgeKey: ek } of adj.get(current)!) {
      if (visited.has(neighbor)) continue;
      const newDist = cost + weight;
      if (newDist < dist.get(neighbor)!) {
        dist.set(neighbor, newDist);
        parent.set(neighbor, current);
        parentEdge.set(neighbor, ek);
        pq.push({ id: neighbor, cost: newDist });
        es[ek] = 'visited';
        if (neighbor !== endId) ns[neighbor] = 'visiting';
        steps.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          logMessage: `📏 Avaliando aresta → "${nodeMap.get(neighbor)!.label}" (${weight} min) | total=${newDist} min`,
        });
      }
    }

    if (current !== startId && current !== endId) ns[current] = 'visited';
  }

  if (dist.get(endId) === Infinity) {
    steps.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      logMessage: '❌ Caminho não encontrado.',
    });
    return { steps, path: [], totalWeight: 0, found: false };
  }

  const path: string[] = [];
  let cur = endId;
  while (cur !== startId) {
    path.unshift(cur);
    cur = parent.get(cur)!;
  }
  path.unshift(startId);

  const totalWeight = dist.get(endId)!;
  const pathSteps = buildPathSteps(
    path,
    ns,
    es,
    totalWeight,
    nodeMap.get(startId)!.label,
    nodeMap.get(endId)!.label,
  );
  return { steps: [...steps, ...pathSteps], path, totalWeight, found: true };
}

// ─── A* ───────────────────────────────────────────────────────────────────────

export function runAStar(
  nodes: CampusNode[],
  edges: CampusEdge[],
  startId: string,
  endId: string,
): SearchResult {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adj = buildAdjacency(nodes, edges);
  const { ns, es } = initStates(nodes, startId, endId);
  const steps: AnimationStep[] = [];

  const endNode = nodeMap.get(endId)!;
  const h = (id: string) => {
    const n = nodeMap.get(id)!;
    return Math.sqrt((n.x - endNode.x) ** 2 + (n.y - endNode.y) ** 2) / 50; // scale to ~minutes
  };

  steps.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    logMessage: `🔮 A* iniciado em "${nodeMap.get(startId)!.label}". Heurística: distância euclidiana → "${nodeMap.get(endId)!.label}"`,
  });

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const parent = new Map<string, string>();
  const visited = new Set<string>();

  for (const n of nodes) {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  }
  gScore.set(startId, 0);
  fScore.set(startId, h(startId));

  type PQEntry = { id: string; f: number };
  const openSet: PQEntry[] = [{ id: startId, f: fScore.get(startId)! }];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const { id: current } = openSet.shift()!;

    if (visited.has(current)) continue;
    visited.add(current);

    if (current !== startId && current !== endId) {
      ns[current] = 'visiting';
      steps.push({
        nodeStates: { ...ns },
        edgeStates: { ...es },
        logMessage: `🧭 Explorando "${nodeMap.get(current)!.label}" | g=${gScore.get(current)!.toFixed(1)}, h=${h(current).toFixed(1)}, f=${fScore.get(current)!.toFixed(1)}`,
      });
    }

    if (current === endId) break;

    for (const { nodeId: neighbor, weight, edgeKey: ek } of adj.get(current)!) {
      if (visited.has(neighbor)) continue;
      const tentativeG = gScore.get(current)! + weight;
      if (tentativeG < gScore.get(neighbor)!) {
        gScore.set(neighbor, tentativeG);
        fScore.set(neighbor, tentativeG + h(neighbor));
        parent.set(neighbor, current);
        openSet.push({ id: neighbor, f: fScore.get(neighbor)! });
        es[ek] = 'visited';
        if (neighbor !== endId) ns[neighbor] = 'visiting';
        steps.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          logMessage: `🧮 Avaliando "${nodeMap.get(neighbor)!.label}" | g=${tentativeG.toFixed(1)}, h=${h(neighbor).toFixed(1)}, f=${fScore.get(neighbor)!.toFixed(1)}`,
        });
      }
    }

    if (current !== startId && current !== endId) ns[current] = 'visited';
  }

  if (gScore.get(endId) === Infinity) {
    steps.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      logMessage: '❌ Caminho não encontrado.',
    });
    return { steps, path: [], totalWeight: 0, found: false };
  }

  const path: string[] = [];
  let cur = endId;
  while (cur !== startId) {
    path.unshift(cur);
    cur = parent.get(cur)!;
  }
  path.unshift(startId);

  const totalWeight = gScore.get(endId)!;
  const pathSteps = buildPathSteps(
    path,
    ns,
    es,
    totalWeight,
    nodeMap.get(startId)!.label,
    nodeMap.get(endId)!.label,
  );
  return { steps: [...steps, ...pathSteps], path, totalWeight, found: true };
}
