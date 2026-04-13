import { useRef, useEffect } from 'react';
import { Terminal, Info } from 'lucide-react';

interface LogPanelProps {
  logs: string[];
  totalWeight?: number;
  pathLength?: number;
}

export function LogPanel({ logs, totalWeight, pathLength }: LogPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#161b27',
        borderTop: '1px solid #2a3347',
        height: 180,
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid #2a3347',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Terminal size={13} color="#10b981" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8892a4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Log de Busca
          </span>
        </div>

        {totalWeight !== undefined && pathLength !== undefined && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Info size={11} color="#4a5568" />
              <span style={{ fontSize: 11, color: '#4a5568' }}>
                {pathLength} paradas · {totalWeight} min
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Log messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {logs.length === 0 ? (
          <p style={{ fontSize: 12, color: '#4a5568', fontStyle: 'italic', marginTop: 4 }}>
            Configure o algoritmo, defina os pontos e pressione Iniciar.
          </p>
        ) : (
          logs.map((log, i) => {
            const isLast = i === logs.length - 1;
            const isSuccess = log.startsWith('✅');
            const isError = log.startsWith('❌');
            return (
              <div
                key={i}
                className="log-entry"
                style={{
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: isSuccess
                    ? '#10b981'
                    : isError
                    ? '#ef4444'
                    : isLast
                    ? '#e8eaf0'
                    : '#8892a4',
                  display: 'flex',
                  gap: 6,
                  alignItems: 'flex-start',
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: '#2a3347', flexShrink: 0, minWidth: 30 }}>
                  {String(i + 1).padStart(3, '0')}
                </span>
                <span>{log}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
