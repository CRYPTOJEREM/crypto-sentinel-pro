import { useState } from 'react';
import { getFearGreedClass } from '../utils/classifications';
import Badge from './Badge';
import Loader from './Loader';

export default function FearGreedIndex({ value, history, btcHistory }) {
  const [range, setRange] = useState('1y');

  if (!history || history.length === 0)
    return <div className="glass rounded-2xl p-6"><Loader text="Chargement Fear & Greed Index..." /></div>;

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
    <div className="glass rounded-2xl overflow-hidden animate-fadeInUp">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left: Gauge */}
        <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color, boxShadow: `0 0 8px ${c.color}` }} />
            <h3 className="text-base font-bold text-white tracking-tight">Fear & Greed Index</h3>
          </div>
          <p className="text-[11px] text-gray-500 mb-6 ml-4">Source: Alternative.me (données réelles)</p>

          <div className="flex justify-center mb-6">
            <svg width="220" height="135" viewBox="0 0 220 135">
              <defs>
                <linearGradient id="fgArc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea3943" /><stop offset="25%" stopColor="#ea8c00" />
                  <stop offset="50%" stopColor="#c9b003" /><stop offset="75%" stopColor="#93d900" />
                  <stop offset="100%" stopColor="#16c784" />
                </linearGradient>
                <filter id="fgGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="rgba(30,58,95,0.4)" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="url(#fgArc)" strokeWidth="14" strokeLinecap="round" filter="url(#fgGlow)" />
              {[0, 25, 50, 75, 100].map((tick) => {
                const angle = ((-180 + (tick / 100) * 180) * Math.PI) / 180;
                return <line key={tick} x1={110 + Math.cos(angle) * 78} y1={110 + Math.sin(angle) * 78} x2={110 + Math.cos(angle) * 70} y2={110 + Math.sin(angle) * 70} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />;
              })}
              <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '110px 110px', transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                <line x1="110" y1="110" x2="110" y2="32" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${c.color})` }} />
                <circle cx="110" cy="110" r="8" fill={c.color} style={{ filter: `drop-shadow(0 0 8px ${c.color})` }} />
                <circle cx="110" cy="110" r="4" fill="#0f2744" />
              </g>
              <text x="110" y="96" textAnchor="middle" fill={c.color} fontSize="38" fontWeight="800" fontFamily="'JetBrains Mono', monospace" style={{ filter: `drop-shadow(0 0 10px ${c.color}40)` }}>{value}</text>
            </svg>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2.5 mb-2">
              <span className="text-3xl animate-float">{c.emoji}</span>
              <span className="text-xl font-extrabold tracking-tight" style={{ color: c.color }}>{c.label}</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">{c.desc}</p>
          </div>

          <div className="space-y-2.5 mb-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Historique</h4>
            {[{ l: 'Hier', v: yesterday }, { l: 'Semaine', v: lastWeek }, { l: 'Mois', v: lastMonth }].map((x, i) => {
              const cl = getFearGreedClass(x.v);
              return (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-500">{x.l}</span>
                  <Badge color={cl.color}>{cl.label} - {x.v}</Badge>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-white/5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annuel</h4>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500 flex items-center gap-1.5"><span className="text-emerald-400">▲</span> High</span>
              <Badge color={getFearGreedClass(yHigh).color} glow>{getFearGreedClass(yHigh).label} - {yHigh}</Badge>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500 flex items-center gap-1.5"><span className="text-red-400">▼</span> Low</span>
              <Badge color={getFearGreedClass(yLow).color}>{getFearGreedClass(yLow).label} - {yLow}</Badge>
            </div>
          </div>
        </div>

        {/* Right: Chart */}
        <div className="lg:col-span-2 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Graphique Fear & Greed</h3>
              <div className="flex items-center gap-5 mt-2 text-xs">
                <div className="flex items-center gap-2"><span className="w-5 h-0.5 rounded-full bg-orange-500" /><span className="text-gray-500">Fear & Greed</span></div>
                <div className="flex items-center gap-2"><span className="w-5 h-0.5 rounded-full bg-gray-500" /><span className="text-gray-500">BTC Price</span></div>
              </div>
            </div>
            <div className="flex gap-1 glass-light rounded-xl p-1">
              {['30d', '1y', 'All'].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${range === r ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-gray-300'}`}>{r}</button>
              ))}
            </div>
          </div>

          <div className="relative h-72 bg-[#070d1a]/80 rounded-xl overflow-hidden border border-white/5">
            <div className="absolute inset-0 flex flex-col">
              {[{ c: '#16c784' }, { c: '#93d900' }, { c: '#c9b003' }, { c: '#ea8c00' }, { c: '#ea3943' }].map((z, i) => (
                <div key={i} className="flex-1" style={{ background: `linear-gradient(180deg, ${z.c}06 0%, ${z.c}02 100%)`, borderBottom: i < 4 ? `1px solid ${z.c}12` : 'none' }} />
              ))}
            </div>
            <div className="absolute right-2.5 top-0 bottom-0 flex flex-col justify-between py-3 text-[9px] font-mono font-medium z-10">
              <span className="text-gray-600">100</span>
              <span style={{ color: '#16c78499' }}>Extreme Greed</span>
              <span style={{ color: '#93d90099' }}>Greed</span>
              <span style={{ color: '#c9b00399' }}>Neutral</span>
              <span style={{ color: '#ea8c0099' }}>Fear</span>
              <span style={{ color: '#ea394399' }}>Extreme Fear</span>
              <span className="text-gray-600">0</span>
            </div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {[20, 40, 55, 74].map((y) => <line key={y} x1="0" y1={100 - y} x2="92" y2={100 - y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />)}
              {filteredBtc.length > 1 && (
                <path d={filteredBtc.map((p, i) => {
                  const x = (i / (filteredBtc.length - 1)) * 92;
                  const y = 100 - ((p.price - btcMin) / (btcMax - btcMin)) * 90 - 5;
                  return `${i === 0 ? 'M' : 'L'} ${x},${Math.max(0, Math.min(100, y))}`;
                }).join(' ')} fill="none" stroke="rgba(156,163,175,0.25)" strokeWidth="0.3" />
              )}
              <defs>
                <linearGradient id="fgFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={c.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              {filtered.length > 1 && (
                <path d={`M 0,100 ${filtered.map((p, i) => `L ${(i / (filtered.length - 1)) * 92},${100 - p.value}`).join(' ')} L ${92},100 Z`} fill="url(#fgFill)" />
              )}
              {filtered.map((p, i) => {
                if (i === 0) return null;
                const pr = filtered[i - 1];
                return <line key={i} x1={((i - 1) / (filtered.length - 1)) * 92} y1={100 - pr.value} x2={(i / (filtered.length - 1)) * 92} y2={100 - p.value} stroke={getFearGreedClass((p.value + pr.value) / 2).color} strokeWidth="0.5" />;
              })}
            </svg>
            <div className="absolute right-16 px-2.5 py-1 rounded-lg text-xs font-black z-20 font-mono" style={{ top: `${100 - value}%`, backgroundColor: c.color, color: '#000', transform: 'translateY(-50%)', boxShadow: `0 0 16px ${c.color}50` }}>{value}</div>
          </div>

          <div className="flex justify-between mt-3 text-[10px] text-gray-600 font-mono pr-16">
            {getDateLabels().map((lbl, i) => <span key={i}>{lbl}</span>)}
          </div>

          <div className="mt-5 p-3.5 glass-light rounded-xl">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300">Tip :</strong> "Be fearful when others are greedy, and greedy when others are fearful." — Warren Buffett
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
