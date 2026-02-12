import { useState, useEffect } from 'react';
import { getOppClass } from '../utils/classifications';
import { getFactorInterpretation, getSignalColor } from '../utils/interpretations';

const FACTOR_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#a855f7'];
const GUIDE_FACTORS = [
  { n: 'Fear/Greed Contrarian', c: '#3b82f6', ranges: [
    { r: '75-100', l: "Zone d'opportunité contrarian forte", cl: '#16c784' },
    { r: '50-74', l: 'Signal modéré — le marché est craintif', cl: '#93d900' },
    { r: '25-49', l: 'Zone neutre — pas de signal clair', cl: '#c9b003' },
    { r: '0-24', l: 'Marché euphorique — prudence recommandée', cl: '#ea3943' },
  ]},
  { n: 'BTC vs ATH', c: '#22c55e', ranges: [
    { r: '80-100', l: 'Proche du record — marché en force', cl: '#16c784' },
    { r: '60-79', l: 'Zone haute — tendance haussière confirmée', cl: '#93d900' },
    { r: '40-59', l: 'Mi-parcours — phase de consolidation', cl: '#c9b003' },
    { r: '0-39', l: "Loin du ATH — zone d'accumulation potentielle", cl: '#ea8c00' },
  ]},
  { n: 'Market Breadth', c: '#eab308', ranges: [
    { r: '70-100', l: 'Large participation — marché sain', cl: '#16c784' },
    { r: '50-69', l: 'Majorité en hausse — plutôt positif', cl: '#93d900' },
    { r: '30-49', l: 'Marché divisé — rotation en cours', cl: '#c9b003' },
    { r: '0-29', l: 'Faible participation — méfiance', cl: '#ea3943' },
  ]},
  { n: 'Volatilité', c: '#f97316', ranges: [
    { r: '70-100', l: 'Volatilité modérée — conditions idéales', cl: '#16c784' },
    { r: '50-69', l: 'Fourchette normale — acceptable', cl: '#93d900' },
    { r: '30-49', l: 'Très faible — compression, mouvement à venir', cl: '#c9b003' },
    { r: '0-29', l: 'Extrême — risque maximal', cl: '#ea3943' },
  ]},
  { n: 'Momentum 30j', c: '#a855f7', ranges: [
    { r: '70-100', l: 'Fort momentum haussier établi', cl: '#16c784' },
    { r: '50-69', l: 'Tendance légèrement positive', cl: '#93d900' },
    { r: '30-49', l: 'Neutre à baissier — attente', cl: '#c9b003' },
    { r: '0-29', l: 'Momentum baissier — correction active', cl: '#ea3943' },
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
    <div className="glass rounded-2xl p-6 lg:p-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${c.color}15`, border: `1px solid ${c.color}25` }}>🎯</div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Indice d'Opportunité</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] text-gray-500">Poids optimisés par backtest sur 2 ans</p>
              {optResult && optResult.accuracy > 0 && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {optResult.tested.toLocaleString()} combinaisons testées • r={optResult.correlation}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => setShowDetails(!showDetails)} className="px-4 py-2 glass-light rounded-xl text-sm font-bold transition-all hover:bg-blue-600/20 text-blue-400 flex items-center gap-2">
          {showDetails ? 'MASQUER' : 'GUIDE'}
          <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <svg width="280" height="165" viewBox="0 0 280 165">
            <defs>
              <linearGradient id="oppG" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea3943" /><stop offset="25%" stopColor="#ea8c00" />
                <stop offset="50%" stopColor="#c9b003" /><stop offset="75%" stopColor="#93d900" />
                <stop offset="100%" stopColor="#16c784" />
              </linearGradient>
              <filter id="oppGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path d="M 25 140 A 115 115 0 0 1 255 140" fill="none" stroke="rgba(30,58,95,0.3)" strokeWidth="16" strokeLinecap="round" />
            <path d="M 25 140 A 115 115 0 0 1 255 140" fill="none" stroke="url(#oppG)" strokeWidth="16" strokeLinecap="round" filter="url(#oppGlow)" />
            {[0, 20, 40, 60, 80, 100].map((tick) => {
              const angle = ((-180 + (tick / 100) * 180) * Math.PI) / 180;
              return <line key={tick} x1={140 + Math.cos(angle) * 103} y1={140 + Math.sin(angle) * 103} x2={140 + Math.cos(angle) * 95} y2={140 + Math.sin(angle) * 95} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />;
            })}
            <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '140px 140px', transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              <polygon points="140,38 136,140 144,140" fill={c.color} style={{ filter: `drop-shadow(0 0 8px ${c.color})` }} />
              <circle cx="140" cy="140" r="10" fill={c.color} style={{ filter: `drop-shadow(0 0 10px ${c.color})` }} />
              <circle cx="140" cy="140" r="5" fill="#0f2744" />
            </g>
            <text x="140" y="122" textAnchor="middle" fill={c.color} fontSize="44" fontWeight="800" fontFamily="'JetBrains Mono', monospace" style={{ filter: `drop-shadow(0 0 12px ${c.color}40)` }}>{Math.round(anim)}</text>
            <text x="22" y="158" fill="#ea3943" fontSize="10" fontWeight="700" fontFamily="'JetBrains Mono', monospace" opacity="0.6">0</text>
            <text x="248" y="158" fill="#16c784" fontSize="10" fontWeight="700" fontFamily="'JetBrains Mono', monospace" opacity="0.6">100</text>
          </svg>
          <div className="text-center mt-3">
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-3xl animate-float">{c.emoji}</span>
              <span className="text-2xl font-extrabold tracking-tight" style={{ color: c.color }}>{c.label}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1 font-medium">{c.desc}</p>
          </div>
        </div>

        {/* Factors */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Décomposition des facteurs</h3>
          <div className="space-y-2">
            {indicators.map((ind, i) => {
              const fc = FACTOR_COLORS[i] || '#3b82f6';
              const interp = getFactorInterpretation(ind.name, ind.current);
              const isExpanded = expandedFactor === i;
              return (
                <div key={i} className="glass-light rounded-xl p-3.5 transition-all hover:border-white/10 cursor-pointer" style={{ borderLeft: `3px solid ${fc}` }} onClick={(e) => { e.stopPropagation(); setExpandedFactor(isExpanded ? null : i); }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{ind.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${fc}15`, color: fc }}>{ind.weight}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${getSignalColor(interp.signal)}15`, color: getSignalColor(interp.signal) }}>{interp.signal}</span>
                      <span className="text-sm font-black font-mono" style={{ color: fc }}>{ind.current}</span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-[#070d1a]/60 rounded-full overflow-hidden progress-bar">
                    <div className="absolute h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${ind.current}%`, background: `linear-gradient(90deg, ${fc}80, ${fc})` }} />
                  </div>
                  {isExpanded && (
                    <div className="mt-3 pt-2.5 border-t border-white/5 animate-fadeInUp">
                      <p className="text-[11px] text-gray-400 leading-relaxed">{interp.text}</p>
                    </div>
                  )}
                  {!isExpanded && <div className="mt-1 text-[9px] text-gray-600 text-right">cliquer pour lire l'analyse</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guide */}
      {showDetails && (
        <div className="mt-8 pt-6 border-t border-white/5 animate-fadeInUp">
          <h3 className="text-base font-extrabold text-white mb-2 flex items-center gap-2">
            <span className="text-lg">📖</span> Guide d'interprétation
          </h3>
          <p className="text-xs text-gray-500 mb-5">Comment lire chaque facteur — cliquez sur un facteur ci-dessus pour l'analyse détaillée en temps réel.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDE_FACTORS.map((f, i) => (
              <div key={i} className="glass-light rounded-xl p-5 transition-all hover:border-white/10" style={{ borderLeft: `3px solid ${f.c}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-white text-sm">{f.n}</span>
                </div>
                <div className="space-y-2">
                  {f.ranges.map((r, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-[10px] font-mono font-bold w-12 flex-shrink-0 text-right" style={{ color: r.cl }}>{r.r}</span>
                      <span className="text-[11px] text-gray-400">{r.l}</span>
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
