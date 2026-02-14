import { useState, useEffect } from 'react';
import { getOppClass } from '../utils/classifications';
import { getFactorInterpretation, getSignalColor } from '../utils/interpretations';

const FACTOR_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#a855f7'];
const GUIDE_FACTORS = [
  { n: 'Fear/Greed Contrarian', c: '#3b82f6', ranges: [
    { r: '75-100', l: "Zone d'opportunit\u00e9 contrarian forte", cl: '#22c55e' },
    { r: '50-74', l: 'Signal mod\u00e9r\u00e9 \u2014 le march\u00e9 est craintif', cl: '#84cc16' },
    { r: '25-49', l: 'Zone neutre \u2014 pas de signal clair', cl: '#eab308' },
    { r: '0-24', l: 'March\u00e9 euphorique \u2014 prudence recommand\u00e9e', cl: '#ef4444' },
  ]},
  { n: 'BTC vs ATH', c: '#22c55e', ranges: [
    { r: '80-100', l: 'Proche du record \u2014 march\u00e9 en force', cl: '#22c55e' },
    { r: '60-79', l: 'Zone haute \u2014 tendance haussi\u00e8re confirm\u00e9e', cl: '#84cc16' },
    { r: '40-59', l: 'Mi-parcours \u2014 phase de consolidation', cl: '#eab308' },
    { r: '0-39', l: "Loin du ATH \u2014 zone d'accumulation potentielle", cl: '#f97316' },
  ]},
  { n: 'Market Breadth', c: '#eab308', ranges: [
    { r: '70-100', l: 'Large participation \u2014 march\u00e9 sain', cl: '#22c55e' },
    { r: '50-69', l: 'Majorit\u00e9 en hausse \u2014 plut\u00f4t positif', cl: '#84cc16' },
    { r: '30-49', l: 'March\u00e9 divis\u00e9 \u2014 rotation en cours', cl: '#eab308' },
    { r: '0-29', l: 'Faible participation \u2014 m\u00e9fiance', cl: '#ef4444' },
  ]},
  { n: 'Volatilit\u00e9', c: '#f97316', ranges: [
    { r: '70-100', l: 'Volatilit\u00e9 mod\u00e9r\u00e9e \u2014 conditions id\u00e9ales', cl: '#22c55e' },
    { r: '50-69', l: 'Fourchette normale \u2014 acceptable', cl: '#84cc16' },
    { r: '30-49', l: 'Tr\u00e8s faible \u2014 compression, mouvement \u00e0 venir', cl: '#eab308' },
    { r: '0-29', l: 'Extr\u00eame \u2014 risque maximal', cl: '#ef4444' },
  ]},
  { n: 'Momentum 30j', c: '#a855f7', ranges: [
    { r: '70-100', l: 'Fort momentum haussier \u00e9tabli', cl: '#22c55e' },
    { r: '50-69', l: 'Tendance l\u00e9g\u00e8rement positive', cl: '#84cc16' },
    { r: '30-49', l: 'Neutre \u00e0 baissier \u2014 attente', cl: '#eab308' },
    { r: '0-29', l: 'Momentum baissier \u2014 correction active', cl: '#ef4444' },
  ]},
];

export default function OpportunityIndex({ score, indicators, showDetails, setShowDetails, optResult }) {
  const [anim, setAnim] = useState(0);
  const [expandedFactor, setExpandedFactor] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnim(score), 100);
  }, [score]);

  const c = getOppClass(anim);
  const needleAngle = -90 + (anim / 100) * 180;

  return (
    <div className="card p-6 lg:p-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">Indice d'Opportunit&eacute;</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-zinc-500">Poids optimis&eacute;s par backtest sur 2 ans</p>
            {optResult && optResult.accuracy > 0 && (
              <span className="text-[10px] font-mono text-zinc-600">
                {optResult.tested.toLocaleString()} tests &bull; r={optResult.correlation}
              </span>
            )}
          </div>
        </div>
        <button onClick={() => setShowDetails(!showDetails)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 flex items-center gap-1.5">
          {showDetails ? 'Masquer' : 'Guide'}
          <svg className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <svg width="260" height="155" viewBox="0 0 260 155">
            <defs>
              <linearGradient id="oppG" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" /><stop offset="25%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#eab308" /><stop offset="75%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <path d="M 20 130 A 110 110 0 0 1 240 130" fill="none" stroke="#27272a" strokeWidth="12" strokeLinecap="round" />
            <path d="M 20 130 A 110 110 0 0 1 240 130" fill="none" stroke="url(#oppG)" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
            <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '130px 130px', transition: 'transform 1.2s ease-out' }}>
              <line x1="130" y1="130" x2="130" y2="32" stroke={c.color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <circle cx="130" cy="130" r="6" fill={c.color} opacity="0.9" />
              <circle cx="130" cy="130" r="3" fill="#18181b" />
            </g>
            <text x="130" y="115" textAnchor="middle" fill={c.color} fontSize="38" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{Math.round(anim)}</text>
            <text x="18" y="148" fill="#71717a" fontSize="9" fontFamily="'JetBrains Mono', monospace">0</text>
            <text x="234" y="148" fill="#71717a" fontSize="9" fontFamily="'JetBrains Mono', monospace">100</text>
          </svg>
          <div className="text-center mt-2">
            <span className="text-xl font-semibold" style={{ color: c.color }}>{c.label}</span>
            <p className="text-sm text-zinc-500 mt-0.5">{c.desc}</p>
          </div>
        </div>

        {/* Factors */}
        <div>
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">D&eacute;composition des facteurs</h3>
          <div className="space-y-2">
            {indicators.map((ind, i) => {
              const fc = FACTOR_COLORS[i] || '#3b82f6';
              const interp = getFactorInterpretation(ind.name, ind.current);
              const isExpanded = expandedFactor === i;
              return (
                <div key={i} className="card-subtle rounded-lg p-3 cursor-pointer transition-all hover:border-zinc-600" onClick={(e) => { e.stopPropagation(); setExpandedFactor(isExpanded ? null : i); }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: fc }} />
                      <span className="text-sm font-medium text-zinc-200">{ind.name}</span>
                      <span className="text-[10px] font-mono text-zinc-600">{ind.weight}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium" style={{ color: getSignalColor(interp.signal) }}>{interp.signal}</span>
                      <span className="text-sm font-semibold font-mono" style={{ color: fc }}>{ind.current}</span>
                    </div>
                  </div>
                  <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="absolute h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${ind.current}%`, backgroundColor: fc, opacity: 0.8 }} />
                  </div>
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800 animate-fadeInUp">
                      <p className="text-xs text-zinc-500 leading-relaxed">{interp.text}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guide */}
      {showDetails && (
        <div className="mt-8 pt-6 border-t border-zinc-800 animate-fadeInUp">
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">Guide d'interpr&eacute;tation</h3>
          <p className="text-xs text-zinc-600 mb-5">Comment lire chaque facteur.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {GUIDE_FACTORS.map((f, i) => (
              <div key={i} className="card-subtle rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: f.c }} />
                  <span className="font-medium text-zinc-200 text-sm">{f.n}</span>
                </div>
                <div className="space-y-1.5">
                  {f.ranges.map((r, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-[10px] font-mono w-11 flex-shrink-0 text-right text-zinc-500">{r.r}</span>
                      <span className="text-[11px] text-zinc-500">{r.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
