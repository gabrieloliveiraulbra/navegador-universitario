import { Play, Pause, SkipForward, RotateCcw, Gauge, MapPin, Navigation } from 'lucide-react';
import type { AlgorithmId } from '../types';
import { ALGORITHMS, CAMPUS_GRAPH } from '../data/campusData';

interface ControlPanelProps {
  algorithmId: AlgorithmId;
  startId: string;
  endId: string;
  speed: number;
  isPlaying: boolean;
  isFinished: boolean;
  currentStep: number;
  totalSteps: number;
  canStep: boolean;
  onAlgorithmChange: (id: AlgorithmId) => void;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  onSpeedChange: (v: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

// Group nodes by complex for optgroup
function groupedNodes() {
  const groups: Record<string, typeof CAMPUS_GRAPH.nodes> = {};
  for (const n of CAMPUS_GRAPH.nodes) {
    const g = n.complex ?? 'Sem Complexo';
    if (!groups[g]) groups[g] = [];
    groups[g].push(n);
  }
  return groups;
}

export function ControlPanel({
  algorithmId,
  startId,
  endId,
  speed,
  isPlaying,
  isFinished,
  currentStep,
  totalSteps,
  canStep,
  onAlgorithmChange,
  onStartChange,
  onEndChange,
  onSpeedChange,
  onPlay,
  onPause,
  onStep,
  onReset,
}: ControlPanelProps) {
  const groups = groupedNodes();
  const algo = ALGORITHMS.find((a) => a.id === algorithmId)!;
  const progress = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
        background: '#161b27',
        borderRight: '1px solid #2a3347',
        width: 280,
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Navigation size={18} color="#3b82f6" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#e8eaf0' }}>
            Campus Navigator
          </span>
        </div>
        <p style={{ fontSize: 11, color: '#4a5568' }}>
          Visualizador de Algoritmos de Busca
        </p>
      </div>

      <div className="divider" />

      {/* Algorithm */}
      <div>
        <label>Algoritmo</label>
        <select
          value={algorithmId}
          onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmId)}
        >
          {ALGORITHMS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <p style={{ fontSize: 11, color: '#4a5568', marginTop: 6, lineHeight: 1.5 }}>
          {algo.description}
        </p>
      </div>

      {/* Start / End */}
      <div>
        <label>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={11} color="#6366f1" />
            Ponto de Partida
          </span>
        </label>
        <select value={startId} onChange={(e) => onStartChange(e.target.value)}>
          {Object.entries(groups).map(([group, nodes]) => (
            <optgroup key={group} label={group}>
              {nodes.map((n) => (
                <option key={n.id} value={n.id} disabled={n.id === endId}>
                  {n.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={11} color="#e11d48" />
            Ponto de Chegada
          </span>
        </label>
        <select value={endId} onChange={(e) => onEndChange(e.target.value)}>
          {Object.entries(groups).map(([group, nodes]) => (
            <optgroup key={group} label={group}>
              {nodes.map((n) => (
                <option key={n.id} value={n.id} disabled={n.id === startId}>
                  {n.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="divider" />

      {/* Speed */}
      <div>
        <label>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Gauge size={11} />
            Velocidade da Animação
          </span>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, color: '#4a5568', minWidth: 24 }}>Lento</span>
          <input
            type="range"
            min={1}
            max={10}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          />
          <span style={{ fontSize: 10, color: '#4a5568', minWidth: 30 }}>Rápido</span>
        </div>
        <p style={{ fontSize: 11, color: '#4a5568', marginTop: 4, textAlign: 'center' }}>
          {Math.round(1100 - speed * 100)}ms / passo
        </p>
      </div>

      <div className="divider" />

      {/* Progress */}
      {totalSteps > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#8892a4' }}>
              Passo {currentStep} / {totalSteps}
            </span>
            <span style={{ fontSize: 11, color: '#8892a4' }}>{progress}%</span>
          </div>
          <div
            style={{
              height: 4,
              background: '#2a3347',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                borderRadius: 2,
                transition: 'width 0.2s',
              }}
            />
          </div>
        </div>
      )}

      {/* Playback controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        {!isPlaying ? (
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={onPlay}
            disabled={isFinished && currentStep === totalSteps}
          >
            <Play size={14} />
            {currentStep === 0 ? 'Iniciar' : 'Continuar'}
          </button>
        ) : (
          <button className="btn-primary" style={{ flex: 1 }} onClick={onPause}>
            <Pause size={14} />
            Pausar
          </button>
        )}
        <button
          className="btn-icon"
          onClick={onStep}
          disabled={isPlaying || (currentStep >= totalSteps && totalSteps > 0)}
          title="Avançar um passo"
        >
          <SkipForward size={14} />
        </button>
        <button
          className="btn-icon"
          onClick={onReset}
          title="Reiniciar"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Legend */}
      <div className="divider" />
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#8892a4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Legenda
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { color: '#2a3347', label: 'Não visitado' },
            { color: '#f59e0b', label: 'Visitando (atual)' },
            { color: '#3b82f6', label: 'Visitado' },
            { color: '#10b981', label: 'Caminho final' },
            { color: '#6366f1', label: 'Ponto de partida' },
            { color: '#e11d48', label: 'Ponto de chegada' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: color,
                  border: `2px solid ${color}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: '#8892a4' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
