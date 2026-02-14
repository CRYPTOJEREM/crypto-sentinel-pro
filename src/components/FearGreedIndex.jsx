import { useState } from 'react';
import { getFearGreedClass } from '../utils/classifications';
import Loader from './Loader';

export default function FearGreedIndex({ value, history, btcHistory }) {
  const [range, setRange] = useState('1y');

  if (!history || history.length === 0)
    return <div className="card p-6"><Loader text="Chargement Fear & Greed Index..." /></div>;

  const c = getFearGreedClass(value);
  const yesterday = history[history.length - 2]?.value || 0;
  const lastWeek = history[history.length - 8]?.value || 0;
  const lastMonth = history[history.length - 31]?.value || 0;
  const yearData = history.slice(-365);
  const yHigh = Math.max(...yearData.map((d) => d.value));
  const yLow = Math.min(...yearData.map((d) => d.value));
  const filtered = range === '30d' ? history.slice(-30) : range === '1y' ? history.slice(-365) : history;
  const filteredBtc = range === '30d' ? (btcHistory || []).slice(-30) : range === '1y' ? (btcHistory || []).slice(-365) : (btcHistory || []);
  const btcMin = filteredBtc.length > 0 ? Math.min(...filteredBtc.map((b) => b.price)) : 0;
  const btcMax = filteredBtc.length > 0 ? Math.max(...filteredBtc.map((b) => b.price)) : 1;
  const needleAngle = -90 + (value / 100) * 180;

  const getDateLabels = () => {
    if (filtered.length === 0) return [];
    const first = new Date(filtered[0].ts * 1000);
    const last = new Date(filtered[filtered.length - 1].ts * 1000);
    const fmt = (d) => d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    if (range === '30d') return [fmt(first), fmt(new Date((first.getTime() + last.getTime()) / 2)), 'Auj.'];
    const step = Math.floor(filtered.length / 4);
    return [0, step, step * 2, step * 3, filtered.length - 1].map((i) =>
      filtered[i] ? fmt(new Date(filtered[i].ts * 1000)) : ''
    );
  };

  return (
    <div className="card overflow-hidden animate-fadeInUp">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left: Gauge */}
        <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">Fear & Greed Index</h3>
          <p className="text-xs text-zinc-600 mb-6">Source: Alternative.me</p>

          <div className="flex justify-center mb-6">
            <svg width="200" height="125" viewBox="0 0 200 125">
              <defs>
                <linearGradient id="fgArc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" /><stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" /><stop offset="75%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#27272a" strokeWidth="10" strokeLinecap="round" />
              <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="url(#fgArc)" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
              <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 100px', transition: 'transform 1s ease-out' }}>
                <line x1="100" y1="100" x2="100" y2="28" stroke={c.color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                <circle cx="100" cy="100" r="5" fill={c.color} opacity="0.9" />
                <circle cx="100" cy="100" r="2.5" fill="#18181b" />
              </g>
              <text x="100" y="88" textAnchor="middle" fill={c.color} fontSize="32" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{value}</text>
            </svg>
          </div>

          <div className="text-center mb-6">
            <span className="text-lg font-semibold" style={{ color: c.color }}>{c.label}</span>
            <p className="text-xs text-zinc-500 mt-0.5">{c.desc}</p>
          </div>

          <div className="space-y-2 mb-5">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Historique</h4>
            {[{ l: 'Hier', v: yesterday }, { l: 'Semaine', v: lastWeek }, { l: 'Mois', v: lastMonth }].map((x, i) => {
              const cl = getFearGreedClass(x.v);
              return (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-zinc-500">{x.l}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cl.color }} />
                    <span className="text-sm font-mono font-medium" style={{ color: cl.color }}>{x.v}</span>
                    <span className="text-xs text-zinc-600">{cl.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Annuel</h4>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-500">High</span>
              <span className="text-sm font-mono font-medium" style={{ color: getFearGreedClass(yHigh).color }}>{yHigh}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-500">Low</span>
              <span className="text-sm font-mono font-medium" style={{ color: getFearGreedClass(yLow).color }}>{yLow}</span>
            </div>
          </div>
        </div>

        {/* Right: Chart */}
        <div className="lg:col-span-2 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-zinc-300">Graphique Fear & Greed</h3>
              <div className="flex items-center gap-4 mt-1.5 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 rounded-full bg-orange-400" /><span className="text-zinc-600">Fear & Greed</span></div>
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 rounded-full bg-zinc-600" /><span className="text-zinc-600">BTC Price</span></div>
              </div>
            </div>
            <div className="flex gap-0.5 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
              {['30d', '1y', 'All'].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${range === r ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{r}</button>
              ))}
            </div>
          </div>

          <div className="relative h-64 bg-zinc-900/50 rounded-lg overflow-hidden border border-zinc-800/50">
            <div className="absolute right-3 top-0 bottom-0 flex flex-col justify-between py-3 text-[9px] font-mono z-10 text-zinc-600">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {[25, 50, 75].map((y) => <line key={y} x1="0" y1={100 - y} x2="92" y2={100 - y} stroke="rgba(63,63,70,0.3)" strokeWidth="0.2" />)}
              {filteredBtc.length > 1 && (
                <path d={filteredBtc.map((p, i) => {
                  const x = (i / (filteredBtc.length - 1)) * 92;
                  const y = 100 - ((p.price - btcMin) / (btcMax - btcMin)) * 90 - 5;
                  return `${i === 0 ? 'M' : 'L'} ${x},${Math.max(0, Math.min(100, y))}`;
                }).join(' ')} fill="none" stroke="rgba(113,113,122,0.3)" strokeWidth="0.4" />
              )}
              <defs>
                <linearGradient id="fgFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.color} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={c.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              {filtered.length > 1 && (
                <path d={`M 0,100 ${filtered.map((p, i) => `L ${(i / (filtered.length - 1)) * 92},${100 - p.value}`).join(' ')} L ${92},100 Z`} fill="url(#fgFill)" />
              )}
              {filtered.map((p, i) => {
                if (i === 0) return null;
                const pr = filtered[i - 1];
                return <line key={i} x1={((i - 1) / (filtered.length - 1)) * 92} y1={100 - pr.value} x2={(i / (filtered.length - 1)) * 92} y2={100 - p.value} stroke={getFearGreedClass((p.value + pr.value) / 2).color} strokeWidth="0.5" opacity="0.7" />;
              })}
            </svg>
            <div className="absolute right-12 px-2 py-0.5 rounded text-xs font-bold z-20 font-mono" style={{ top: `${100 - value}%`, backgroundColor: c.color, color: '#09090b', transform: 'translateY(-50%)' }}>{value}</div>
          </div>

          <div className="flex justify-between mt-2 text-[10px] text-zinc-600 font-mono pr-12">
            {getDateLabels().map((lbl, i) => <span key={i}>{lbl}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
