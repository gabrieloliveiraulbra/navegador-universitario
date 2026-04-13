import type { CampusGraph, AlgorithmInfo, ComplexName } from '../types';

// ─── Algorithm Metadata ───────────────────────────────────────────────────────

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bfs',
    name: 'BFS — Busca em Largura',
    description: 'Explora por camadas (ondas), garantindo o menor número de saltos.',
    badge: 'badge-blue',
  },
  {
    id: 'dfs',
    name: 'DFS — Busca em Profundidade',
    description: 'Explora um caminho até o fim antes de retroceder.',
    badge: 'badge-amber',
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra — Menor Peso',
    description: 'Garante o caminho de menor custo (tempo) entre dois pontos.',
    badge: 'badge-green',
  },
  {
    id: 'astar',
    name: 'A* — Heurístico',
    description: 'Usa distância euclidiana como heurística para focar na direção do alvo.',
    badge: 'badge-purple',
  },
];

// ─── Complex Color Scheme ─────────────────────────────────────────────────────

export const COMPLEX_STYLES: Record<
  ComplexName,
  { fill: string; stroke: string; label: string }
> = {
  'Complexo de Informática': {
    fill: 'rgba(59, 130, 246, 0.07)',
    stroke: 'rgba(59, 130, 246, 0.35)',
    label: '#3b82f6',
  },
  'Complexo de Medicina': {
    fill: 'rgba(16, 185, 129, 0.07)',
    stroke: 'rgba(16, 185, 129, 0.35)',
    label: '#10b981',
  },
  'Complexo de Direito': {
    fill: 'rgba(139, 92, 246, 0.07)',
    stroke: 'rgba(139, 92, 246, 0.35)',
    label: '#8b5cf6',
  },
  'Área Central': {
    fill: 'rgba(245, 158, 11, 0.07)',
    stroke: 'rgba(245, 158, 11, 0.35)',
    label: '#f59e0b',
  },
};

// ─── Campus Graph Data ────────────────────────────────────────────────────────
// Canvas: ~900 x 620  (used as SVG viewBox)
// Complexes are spatially grouped with nearby coordinates.

export const CAMPUS_GRAPH: CampusGraph = {
  nodes: [
    // ── Área Central ─────────────────────────────────────────────────────────
    {
      id: 'entrance',
      label: 'Entrada Principal',
      x: 450,
      y: 560,
      type: 'entrance',
      complex: 'Área Central',
    },
    {
      id: 'plaza',
      label: 'Praça de Alimentação',
      x: 450,
      y: 430,
      type: 'cafeteria',
      complex: 'Área Central',
    },
    {
      id: 'rest1',
      label: 'Jardim Central',
      x: 450,
      y: 310,
      type: 'rest_area',
      complex: 'Área Central',
    },

    // ── Complexo de Informática (left side) ───────────────────────────────────
    {
      id: 'cs_lib',
      label: 'Biblioteca de TI',
      x: 150,
      y: 100,
      type: 'library',
      complex: 'Complexo de Informática',
    },
    {
      id: 'cs_101',
      label: 'Lab Computação 101',
      x: 80,
      y: 190,
      type: 'classroom',
      complex: 'Complexo de Informática',
    },
    {
      id: 'cs_102',
      label: 'Lab Computação 102',
      x: 200,
      y: 200,
      type: 'classroom',
      complex: 'Complexo de Informática',
    },
    {
      id: 'cs_103',
      label: 'Sala de Projetos',
      x: 130,
      y: 290,
      type: 'classroom',
      complex: 'Complexo de Informática',
    },
    {
      id: 'cs_cafe',
      label: 'Café de TI',
      x: 230,
      y: 330,
      type: 'cafeteria',
      complex: 'Complexo de Informática',
    },

    // ── Complexo de Medicina (right side) ─────────────────────────────────────
    {
      id: 'med_lib',
      label: 'Biblioteca Médica',
      x: 760,
      y: 100,
      type: 'library',
      complex: 'Complexo de Medicina',
    },
    {
      id: 'med_101',
      label: 'Anfiteatro Medicina',
      x: 700,
      y: 185,
      type: 'classroom',
      complex: 'Complexo de Medicina',
    },
    {
      id: 'med_102',
      label: 'Lab Anatomia',
      x: 820,
      y: 205,
      type: 'classroom',
      complex: 'Complexo de Medicina',
    },
    {
      id: 'med_103',
      label: 'Clínica Escola',
      x: 760,
      y: 300,
      type: 'classroom',
      complex: 'Complexo de Medicina',
    },
    {
      id: 'med_rest',
      label: 'Lounge Médico',
      x: 670,
      y: 320,
      type: 'rest_area',
      complex: 'Complexo de Medicina',
    },

    // ── Complexo de Direito (top-center) ──────────────────────────────────────
    {
      id: 'law_lib',
      label: 'Biblioteca Jurídica',
      x: 450,
      y: 80,
      type: 'library',
      complex: 'Complexo de Direito',
    },
    {
      id: 'law_101',
      label: 'Tribunal Simulado',
      x: 350,
      y: 160,
      type: 'classroom',
      complex: 'Complexo de Direito',
    },
    {
      id: 'law_102',
      label: 'Sala de Debates',
      x: 545,
      y: 160,
      type: 'classroom',
      complex: 'Complexo de Direito',
    },
    {
      id: 'law_103',
      label: 'Auditório Direito',
      x: 450,
      y: 225,
      type: 'classroom',
      complex: 'Complexo de Direito',
    },

    // ── Extra connectors ──────────────────────────────────────────────────────
    {
      id: 'sports',
      label: 'Quadra Esportiva',
      x: 130,
      y: 480,
      type: 'rest_area',
    },
    {
      id: 'parking',
      label: 'Estacionamento',
      x: 760,
      y: 490,
      type: 'entrance',
    },
    {
      id: 'admin',
      label: 'Reitoria / Admin',
      x: 450,
      y: 490,
      type: 'entrance',
      complex: 'Área Central',
    },
  ],

  edges: [
    // ── Central connections ───────────────────────────────────────────────────
    { source: 'entrance', target: 'admin', weight: 3 },
    { source: 'admin', target: 'plaza', weight: 4 },
    { source: 'plaza', target: 'rest1', weight: 5 },

    // ── Central ↔ Informática ─────────────────────────────────────────────────
    { source: 'entrance', target: 'sports', weight: 6 },
    { source: 'sports', target: 'cs_103', weight: 5 },
    { source: 'plaza', target: 'cs_cafe', weight: 7 },
    { source: 'cs_cafe', target: 'cs_103', weight: 3 },
    { source: 'cs_103', target: 'cs_101', weight: 4 },
    { source: 'cs_103', target: 'cs_102', weight: 3 },
    { source: 'cs_101', target: 'cs_lib', weight: 4 },
    { source: 'cs_102', target: 'cs_lib', weight: 3 },
    { source: 'cs_102', target: 'cs_cafe', weight: 4 },

    // ── Central ↔ Direito ─────────────────────────────────────────────────────
    { source: 'rest1', target: 'law_103', weight: 4 },
    { source: 'law_103', target: 'law_101', weight: 3 },
    { source: 'law_103', target: 'law_102', weight: 3 },
    { source: 'law_101', target: 'law_lib', weight: 4 },
    { source: 'law_102', target: 'law_lib', weight: 4 },

    // ── Central ↔ Medicina ────────────────────────────────────────────────────
    { source: 'entrance', target: 'parking', weight: 5 },
    { source: 'parking', target: 'med_103', weight: 6 },
    { source: 'plaza', target: 'med_rest', weight: 8 },
    { source: 'med_rest', target: 'med_103', weight: 3 },
    { source: 'med_103', target: 'med_101', weight: 4 },
    { source: 'med_103', target: 'med_102', weight: 4 },
    { source: 'med_101', target: 'med_lib', weight: 4 },
    { source: 'med_102', target: 'med_lib', weight: 3 },

    // ── Cross-complex shortcuts ───────────────────────────────────────────────
    { source: 'law_101', target: 'cs_lib', weight: 9 },
    { source: 'law_102', target: 'med_lib', weight: 9 },
    { source: 'rest1', target: 'cs_103', weight: 10 },
    { source: 'rest1', target: 'med_rest', weight: 10 },
    { source: 'admin', target: 'med_rest', weight: 12 },
    { source: 'admin', target: 'cs_cafe', weight: 10 },
    { source: 'entrance', target: 'med_rest', weight: 15 },
  ],
};
