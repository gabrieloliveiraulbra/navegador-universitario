import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { AlgorithmId, NodeState, EdgeState, SearchResult } from './types';
import { CAMPUS_GRAPH } from './data/campusData';
import { runBFS, runDFS, runDijkstra, runAStar } from './algorithms/searchAlgorithms';
import { GraphCanvas } from './components/GraphCanvas';
import { ControlPanel } from './components/ControlPanel';
import { LogPanel } from './components/LogPanel';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialNodeStates(startId: string, endId: string): Record<string, NodeState> {
  const ns: Record<string, NodeState> = {};
  for (const n of CAMPUS_GRAPH.nodes) ns[n.id] = 'unvisited';
  ns[startId] = 'start';
  ns[endId] = 'end';
  return ns;
}

const EMPTY_EDGE_STATES: Record<string, EdgeState> = {};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>('bfs');
  const [startId, setStartId] = useState('entrance');
  const [endId, setEndId] = useState('cs_lib');
  const [speed, setSpeed] = useState(5);
  // 'start' = next click sets start, 'end' = next click sets end
  const [clickMode, setClickMode] = useState<'start' | 'end'>('start');

  // Animation state
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Derived visual state ───────────────────────────────────────────────────
  const nodeStates: Record<string, NodeState> = searchResult
    ? (searchResult.steps[currentStep]?.nodeStates ?? buildInitialNodeStates(startId, endId))
    : buildInitialNodeStates(startId, endId);

  const edgeStates: Record<string, EdgeState> = searchResult
    ? (searchResult.steps[currentStep]?.edgeStates ?? EMPTY_EDGE_STATES)
    : EMPTY_EDGE_STATES;

  const totalSteps = searchResult ? searchResult.steps.length - 1 : 0;
  const isFinished = currentStep >= totalSteps && totalSteps > 0;

  // ── Run algorithm ──────────────────────────────────────────────────────────
  const runAlgorithm = useCallback(() => {
    const { nodes, edges } = CAMPUS_GRAPH;
    let result: SearchResult;
    switch (algorithmId) {
      case 'bfs':      result = runBFS(nodes, edges, startId, endId); break;
      case 'dfs':      result = runDFS(nodes, edges, startId, endId); break;
      case 'dijkstra': result = runDijkstra(nodes, edges, startId, endId); break;
      case 'astar':    result = runAStar(nodes, edges, startId, endId); break;
    }
    setSearchResult(result);
    setCurrentStep(0);

    setIsPlaying(false);
  }, [algorithmId, startId, endId]);

  const logs = useMemo(() => {
    if (!searchResult) return [];
    const upTo = Math.min(currentStep, searchResult.steps.length - 1);
    return searchResult.steps.slice(0, upTo + 1).map((s) => s.logMessage);
  }, [currentStep, searchResult]);

  // ── Auto-play interval ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying && searchResult) {
      const delay = Math.max(50, 1100 - speed * 100);
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= searchResult.steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, delay);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, searchResult]);





  // If already have result and press Play, just resume
  const handlePlayWrapper = () => {
    if (!searchResult) {
      // compute then immediately start
      const { nodes, edges } = CAMPUS_GRAPH;
      let result: SearchResult;
      switch (algorithmId) {
        case 'bfs':      result = runBFS(nodes, edges, startId, endId); break;
        case 'dfs':      result = runDFS(nodes, edges, startId, endId); break;
        case 'dijkstra': result = runDijkstra(nodes, edges, startId, endId); break;
        case 'astar':    result = runAStar(nodes, edges, startId, endId); break;
      }
      setSearchResult(result);
      setCurrentStep(0);

      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handlePause = () => setIsPlaying(false);

  const handleStep = () => {
    if (!searchResult) {
      runAlgorithm();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleReset = useCallback(() => {
    setSearchResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const changeAlgorithm = (id: AlgorithmId) => {
    setAlgorithmId(id);
    handleReset();
  };

  const changeStart = (id: string) => {
    setStartId(id);
    handleReset();
  };

  const changeEnd = (id: string) => {
    setEndId(id);
    handleReset();
  };

  const handleNodeClick = (id: string) => {
    if (clickMode === 'start') {
      // Don't re-select the same start
      if (id === startId) return;
      changeStart(id);
      setClickMode('end');
    } else {
      // Don't re-select the same end, and don't pick the current start
      if (id === endId || id === startId) return;
      changeEnd(id);
      setClickMode('start');
    }
  };

  const finalResult = searchResult?.found ? searchResult : undefined;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Left panel */}
      <ControlPanel
        algorithmId={algorithmId}
        startId={startId}
        endId={endId}
        speed={speed}
        isPlaying={isPlaying}
        isFinished={isFinished}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onAlgorithmChange={changeAlgorithm}
        onStartChange={changeStart}
        onEndChange={changeEnd}
        onSpeedChange={setSpeed}
        onPlay={handlePlayWrapper}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
      />

      {/* Right: canvas + log */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Graph Canvas */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <GraphCanvas
            nodes={CAMPUS_GRAPH.nodes}
            edges={CAMPUS_GRAPH.edges}
            nodeStates={nodeStates}
            edgeStates={edgeStates}
            startId={startId}
            endId={endId}
            clickMode={clickMode}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Log panel */}
        <LogPanel
          logs={logs}
          totalWeight={finalResult?.totalWeight}
          pathLength={finalResult?.path.length}
        />
      </div>
    </div>
  );
}
