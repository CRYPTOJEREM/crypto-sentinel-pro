import { useState } from 'react';
import { getFearGreedClass } from '../utils/classifications';
import Loader from './Loader';

export default function FearGreedIndex({ value, history, btcHistory }) {
  const [range, setRange] = useState('1y');

  if (!history || history.length === 0)
    return <div className="bg-[#16162a] border border-[#2a2a45] rounded-xl p-6"><Loader text="Chargement Fear & Greed..." /></div>;

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
    <div className="bg-[#16162a] border border-[#2a2a45] rounded-xl p-5 animate-fadeInUp flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-300">Fear & Greed Index</h3>
          <p className="text-[11px] text-zinc-600">Source: Alternative.me</p>
        </div>
        <div className="flex gap-0.5 bg-[#111122] rounded-lg p-0.5 border border-[#2a2a45]">
          {['30d', '1y', 'All'].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${range === r ? 'bg-[#2a2a45] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <svg width="120" height="78" viewBox="0 0 140 90" className="shrink-0">
          <defs>
            <linearGradient id="fgArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" /><stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" /><stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />
          <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="url(#fgArc)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
          <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '70px 75px', transition: 'transform 1s ease-out' }}>
            <line x1="70" y1="75" x2="70" y2="22" stroke={c.color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <circle cx="70" cy="75" r="4" fill={c.color} opacity="0.9" />
            <circle cx="70" cy="75" r="2" fill="#18181b" />
          </g>
          <text x="70" y="66" textAnchor="middle" fill={c.color} fontSize="24" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{value}</text>
        </svg>
        <div>
          <div className="text-base font-semibold" style={{ color: c.color }}>{c.label}</div>
          <p className="text-xs text-zinc-500 mt-0.5">{c.desc}</p>
          <div className="flex gap-3 mt-2">
            {[{ l: 'Hier', v: yesterday }, { l: 'Sem.', v: lastWeek }, { l: 'Mois', v: lastMonth }].map((x, i) => {
              const cl = getFearGreedClass(x.v);
              return (
                <div key={i} className="text-center">
                  <div className="text-[10px] text-zinc-600">{x.l}</div>
                  <div className="text-xs font-mono font-semibold" style={{ color: cl.color }}>{x.v}</div>
                </div>
              );
            })}
            <div className="text-center border-l border-[#2a2a45] pl-3">
              <div className="text-[10px] text-zinc-600">An. H/L</div>
              <div className="text-xs font-mono">
                <span style={{ color: getFearGreedClass(yHigh).color }}>{yHigh}</span>
                <span className="text-zinc-700">/</span>
                <span style={{ color: getFearGreedClass(yLow).color }}>{yLow}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-[140px] bg-[#111122] rounded-lg overflow-hidden border border-[#222238]">
        <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-[8px] font-mono z-10 text-zinc-700">
          <span>100</span><span>50</span><span>0</span>
        </div>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {[25, 50, 75].map((y) => <line key={y} x1="0" y1={100 - y} x2="94" y2={100 - y} stroke="rgba(63,63,70,0.2)" strokeWidth="0.2" />)}
          {filteredBtc.length > 1 && (
            <path d={filteredBtc.map((p, i) => {
              const x = (i / (filteredBtc.length - 1)) * 94;
              const y = 100 - ((p.price - btcMin) / (btcMax - btcMin)) * 90 - 5;
              return `${i === 0 ? 'M' : 'L'} ${x},${Math.max(0, Math.min(100, y))}`;
            }).join(' ')} fill="none" stroke="rgba(113,113,122,0.25)" strokeWidth="0.4" />
          )}
          <defs>
            <linearGradient id="fgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {filtered.length > 1 && (
            <path d={`M 0,100 ${filtered.map((p, i) => `L ${(i / (filtered.length - 1)) * 94},${100 - p.value}`).join(' ')} L ${94},100 Z`} fill="url(#fgFill)" />
          )}
          {filtered.map((p, i) => {
            if (i === 0) return null;
            const pr = filtered[i - 1];
            return <line key={i} x1={((i - 1) / (filtered.length - 1)) * 94} y1={100 - pr.value} x2={(i / (filtered.length - 1)) * 94} y2={100 - p.value} stroke={getFearGreedClass((p.value + pr.value) / 2).color} strokeWidth="0.5" opacity="0.7" />;
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-1.5 text-[9px] text-zinc-700 font-mono">
        {getDateLabels().map((lbl, i) => <span key={i}>{lbl}</span>)}
      </div>
    </div>
  );
}
