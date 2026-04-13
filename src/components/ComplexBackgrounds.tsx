import type { CampusNode, ComplexName } from '../types';
import { COMPLEX_STYLES } from '../data/campusData';

interface ComplexBoundsProps {
  nodes: CampusNode[];
}

function getBoundsForComplex(nodes: CampusNode[], complex: ComplexName) {
  const group = nodes.filter((n) => n.complex === complex);
  if (group.length === 0) return null;
  const padding = 48;
  const xs = group.map((n) => n.x);
  const ys = group.map((n) => n.y);
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + padding;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function ComplexBackgrounds({ nodes }: ComplexBoundsProps) {
  const complexes = Object.keys(COMPLEX_STYLES) as ComplexName[];

  return (
    <g>
      {complexes.map((complex) => {
        const bounds = getBoundsForComplex(nodes, complex);
        if (!bounds) return null;
        const style = COMPLEX_STYLES[complex];
        return (
          <g key={complex}>
            <rect
              x={bounds.x}
              y={bounds.y}
              width={bounds.width}
              height={bounds.height}
              rx={16}
              ry={16}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={1.5}
              strokeDasharray="6 4"
            />
            {/* Complex label */}
            <text
              x={bounds.x + 12}
              y={bounds.y + 18}
              fill={style.label}
              fontSize={11}
              fontFamily="Inter, sans-serif"
              fontWeight={600}
              letterSpacing={0.5}
              opacity={0.85}
            >
              {complex}
            </text>
          </g>
        );
      })}
    </g>
  );
}
