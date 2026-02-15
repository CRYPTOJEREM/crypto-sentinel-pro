import { useState, useEffect } from 'react';
import { getOppClass } from '../utils/classifications';
import { getFactorInterpretation, getSignalColor } from '../utils/interpretations';

const FACTOR_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#a855f7'];

export default function OpportunityIndex({ score, indicators, showDetails, setShowDetails, optResult }) {
  const [anim, setAnim] = useState(0);
  const [expandedFactor, setExpandedFactor] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnim(score), 100);
  }, [score]);

  const c = getOppClass(anim);
  const needleAngle = -90 + (anim / 100) * 180;

  return (
    <div className="bg-[#16162a] border border-[#2a2a45] rounded-xl p-5 animate-fadeInUp flex flex-col" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-300">Indice d'Opportunité</h2>
          <p className="text-[11px] text-zinc-600">Backtest 2 ans{optResult && optResult.accuracy > 0 ? ` \u2022 r=${optResult.correlation}` : ''}</p>
        </div>
        <button onClick={() => setShowDetails(!showDetails)} className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all bg-[#16162a] border border-[#2a2a45] text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center gap-1">
          {showDetails ? 'Masquer' : 'Guide'}
          <svg className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <svg width="120" height="78" viewBox="0 0 140 90" className="shrink-0">
          <defs>
            <linearGradient id="oppG" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" /><stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" /><stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />
          <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="url(#oppG)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
          <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '70px 75px', transition: 'transform 1.2s ease-out' }}>
            <line x1="70" y1="75" x2="70" y2="22" stroke={c.color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <circle cx="70" cy="75" r="4" fill={c.color} opacity="0.9" />
            <circle cx="70" cy="75" r="2" fill="#18181b" />
          </g>
          <text x="70" y="66" textAnchor="middle" fill={c.color} fontSize="24" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{Math.round(anim)}</text>
        </svg>
        <div>
          <div className="text-base font-semibold" style={{ color: c.color }}>{c.label}</div>
          <p className="text-xs text-zinc-500 mt-0.5">{c.desc}</p>
        </div>
      </div>

      <div className="flex-1 space-y-1.5">
        {indicators.map((ind, i) => {
          const fc = FACTOR_COLORS[i] || '#3b82f6';
          const interp = getFactorInterpretation(ind.name, ind.current);
          const isExpanded = expandedFactor === i;
          return (
            <div key={i} className="bg-[#111122] border border-[#222238] rounded-lg p-2.5 cursor-pointer transition-all hover:border-zinc-600" onClick={(e) => { e.stopPropagation(); setExpandedFactor(isExpanded ? null : i); }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: fc }} />
                  <span className="text-xs font-medium text-zinc-300">{ind.name}</span>
                  <span className="text-[9px] font-mono text-zinc-600">{ind.weight}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-medium" style={{ color: getSignalColor(interp.signal) }}>{interp.signal}</span>
                  <span className="text-xs font-semibold font-mono" style={{ color: fc }}>{ind.current}</span>
                </div>
              </div>
              <div className="relative h-1 bg-[#0b0b14] rounded-full overflow-hidden">
                <div className="absolute h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${ind.current}%`, backgroundColor: fc, opacity: 0.8 }} />
              </div>
              {isExpanded && (
                <div className="mt-2 pt-1.5 border-t border-[#222238] animate-fadeInUp">
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{interp.text}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-[#222238] animate-fadeInUp">
          <h3 className="text-xs font-semibold text-zinc-400 mb-3">Guide rapide</h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { n: 'F&G Contrarian', t: 'Peur = opportunité, Euphorie = prudence' },
              { n: 'BTC vs ATH', t: 'Proche du record = marché en force' },
              { n: 'Market Breadth', t: 'Large participation = marché sain' },
              { n: 'Volatilité', t: 'Modérée = conditions idéales' },
              { n: 'Momentum 30j', t: 'Tendance haussière = signal positif' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: FACTOR_COLORS[i] }} />
                <span className="text-zinc-400 font-medium">{f.n}:</span>
                <span className="text-zinc-600">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
