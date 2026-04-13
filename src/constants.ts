import { NodeState } from './types';

export const NODE_STATE_COLORS: Record<NodeState, { bg: string; ring: string; icon: string }> = {
  unvisited: { bg: '#1e2535', ring: '#2a3347', icon: '#8892a4' },
  visiting:  { bg: '#78350f', ring: '#f59e0b', icon: '#fcd34d' },
  visited:   { bg: '#1e3a5f', ring: '#3b82f6', icon: '#60a5fa' },
  path:      { bg: '#064e3b', ring: '#10b981', icon: '#34d399' },
  start:     { bg: '#312e81', ring: '#6366f1', icon: '#a5b4fc' },
  end:       { bg: '#4c0519', ring: '#e11d48', icon: '#fb7185' },
};
