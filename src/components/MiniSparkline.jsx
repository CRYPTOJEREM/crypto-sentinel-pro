import { useMemo } from 'react';

export default function MiniSparkline({ data, width = 60, height = 24 }) {
  const { points, lineColor, lastY } = useMemo(() => {
    if (!data || data.length < 2) return { points: '', lineColor: '#666', lastY: 0 };
    const step = Math.max(1, Math.floor(data.length / 20));
    const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);
    const min = Math.min(...sampled);
    const max = Math.max(...sampled);
    const range = max - min || 1;
    const pts = sampled
      .map((v, i) => {
        const x = (i / (sampled.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 2) - 1;
        return `${x},${y}`;
      })
      .join(' ');
    const lastVal = sampled[sampled.length - 1];
    const firstVal = sampled[0];
    const color = lastVal >= firstVal ? '#22c55e' : '#ef4444';
    const ly = height - ((lastVal - min) / range) * (height - 2) - 1;
    return { points: pts, lineColor: color, lastY: ly };
  }, [data, width, height]);

  if (!data || data.length < 2) return null;

  const gradientId = `sp-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={lastY} r="2" fill={lineColor} />
    </svg>
  );
}
