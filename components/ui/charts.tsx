'use client';

/**
 * charts.tsx
 *
 * Componentes de gráficos ligeros (SVG + framer-motion), sin dependencias
 * externas. Se usan para visualizar datos reales provenientes de la base de
 * datos (ventas, órdenes, inventario) con animación de entrada y valores que
 * se recalculan dinámicamente cuando cambian los datos.
 */

import { motion } from 'framer-motion';

export interface BarDatum {
  label: string;
  value: number;
  /** Color opcional por barra; si no se da, se usa el prop `color` del chart. */
  color?: string;
}

interface MiniBarChartProps {
  data: BarDatum[];
  valuePrefix?: string;
  color?: string;
  emptyLabel?: string;
}

export function MiniBarChart({ data, valuePrefix = '', color = '#1DB849', emptyLabel = 'Sin datos todavia' }: MiniBarChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-white/40">{emptyLabel}</div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-xs font-semibold text-white/70">
            {valuePrefix}
            {d.value.toLocaleString('es-CR', { maximumFractionDigits: 0 })}
          </span>
          <div className="flex w-full flex-1 items-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, (d.value / max) * 100)}%` }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
              className="w-full rounded-t-lg"
              style={{
                background: `linear-gradient(180deg, ${d.color || color}, ${d.color || color}88)`,
                minHeight: 4,
              }}
            />
          </div>
          <span className="max-w-[72px] truncate text-[10px] uppercase tracking-wide text-white/45" title={d.label}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface MiniDonutChartProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  emptyLabel?: string;
}

export function MiniDonutChart({ data, size = 168, thickness = 22, emptyLabel = 'Sin datos todavia' }: MiniDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (!total) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-white/40">{emptyLabel}</div>
    );
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.18)"
          strokeWidth={thickness}
        />
        {data.map((d, i) => {
          const fraction = d.value / total;
          const dash = fraction * circumference;
          const dashOffset = -cumulative;
          cumulative += dash;
          return (
            <motion.circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              initial={{ strokeDashoffset: circumference, opacity: 0 }}
              animate={{ strokeDashoffset: dashOffset, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      <div className="w-full space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="truncate text-white/70">{d.label}</span>
            <span className="ml-auto shrink-0 font-semibold text-white">
              {((d.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
