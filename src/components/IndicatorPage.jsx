import { useState } from 'react';
import { getOppHistory } from '../utils/oppHistory';
import { getAlertHistory, getAlertSettings, saveAlertSettings, testNotification } from '../utils/alerts';
import { getOppClass } from '../utils/classifications';

export default function IndicatorPage({ oppScore, indicators, fgValue }) {
  const [range, setRange] = useState('30d');
  const [settings, setSettings] = useState(getAlertSettings);
  const [testResult, setTestResult] = useState(null);

  const oppHistory = getOppHistory();
  const alertHistory = getAlertHistory().reverse();
  const c = getOppClass(oppScore);

  const filtered = range === '7d'
    ? oppHistory.slice(-84)
    : range === '30d'
      ? oppHistory.slice(-360)
      : oppHistory;

  const updateSetting = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveAlertSettings(next);
  };

  const handleTest = async () => {
    const ok = await testNotification();
    setTestResult(ok ? 'ok' : 'blocked');
    setTimeout(() => setTestResult(null), 3000);
  };

  const getDateLabels = () => {
    if (filtered.length < 2) return [];
    const fmt = (ts) => new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const step = Math.floor(filtered.length / 4);
    return [0, step, step * 2, step * 3, filtered.length - 1]
      .map((i) => filtered[i] ? fmt(filtered[i].ts) : '')
      .filter(Boolean);
  };

  // Determine current signal
  const signal = oppScore >= settings.buyThreshold ? 'buy' : oppScore <= settings.sellThreshold ? 'sell' : 'neutral';
  const signalLabel = signal === 'buy' ? "ZONE D'ACHAT" : signal === 'sell' ? 'ZONE PRUDENCE' : 'NEUTRE';
  const signalColor = signal === 'buy' ? '#22c55e' : signal === 'sell' ? '#ef4444' : '#eab308';
  const signalBg = signal === 'buy' ? 'bg-emerald-500/10 border-emerald-500/30' : signal === 'sell' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30';

  return (
    <div className="animate-fadeInUp max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Indicateur Crypto Sentinel</h2>
        <p className="text-sm text-zinc-500">Signal d'achat/vente basé sur l'algorithme propriétaire — 5 facteurs, backtest 2 ans</p>
      </div>

      {/* Signal actuel — gros panneau */}
      <div className={`border rounded-2xl p-6 ${signalBg}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 font-medium uppercase mb-1">Signal actuel</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold font-mono" style={{ color: signalColor }}>{oppScore}</span>
              <div>
                <p className="text-lg font-bold" style={{ color: signalColor }}>{signalLabel}</p>
                <p className="text-xs text-zinc-400">{c.desc}</p>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-zinc-600 uppercase mb-1">Fear & Greed</p>
            <p className="text-xl font-bold font-mono text-zinc-300">{fgValue}</p>
          </div>
        </div>
      </div>

      {/* Graphique principal */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-300">Historique du signal</h3>
          <div className="flex gap-0.5 bg-[#111122] rounded-lg p-0.5 border border-[#222238]/70">
            {['7d', '30d', 'All'].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${range === r ? 'bg-[#2a2a45] text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>{r}</button>
            ))}
          </div>
        </div>

        {filtered.length > 1 ? (
          <>
            <div className="relative h-[200px] bg-[#111122] rounded-xl overflow-hidden border border-[#222238]/70">
              <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-3 text-[9px] font-mono z-10 text-zinc-700">
                <span>100</span><span>70</span><span>50</span><span>30</span><span>0</span>
              </div>
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Buy zone */}
                <rect x="0" y="0" width="94" height="30" fill="rgba(34,197,94,0.06)" />
                {/* Sell zone */}
                <rect x="0" y="70" width="94" height="30" fill="rgba(239,68,68,0.06)" />
                {/* Grid lines */}
                <line x1="0" y1="30" x2="94" y2="30" stroke="rgba(34,197,94,0.25)" strokeWidth="0.3" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="94" y2="50" stroke="rgba(63,63,70,0.3)" strokeWidth="0.2" />
                <line x1="0" y1="70" x2="94" y2="70" stroke="rgba(239,68,68,0.25)" strokeWidth="0.3" strokeDasharray="2,2" />
                {/* Labels */}
                <text x="1" y="28" fill="rgba(34,197,94,0.4)" fontSize="2.5" fontFamily="monospace">ACHAT</text>
                <text x="1" y="73" fill="rgba(239,68,68,0.4)" fontSize="2.5" fontFamily="monospace">PRUDENCE</text>
                {/* Fill */}
                <defs>
                  <linearGradient id="indFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={signalColor} stopOpacity="0.12" />
                    <stop offset="100%" stopColor={signalColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M 0,100 ${filtered.map((p, i) => `L ${(i / (filtered.length - 1)) * 94},${100 - p.score}`).join(' ')} L ${94},100 Z`} fill="url(#indFill)" />
                {/* Line segments colored by zone */}
                {filtered.map((p, i) => {
                  if (i === 0) return null;
                  const pr = filtered[i - 1];
                  const avg = (p.score + pr.score) / 2;
                  const col = avg >= 70 ? '#22c55e' : avg <= 30 ? '#ef4444' : '#eab308';
                  return <line key={i} x1={((i - 1) / (filtered.length - 1)) * 94} y1={100 - pr.score} x2={(i / (filtered.length - 1)) * 94} y2={100 - p.score} stroke={col} strokeWidth="0.7" opacity="0.85" />;
                })}
                {/* Dots for alert crossings */}
                {filtered.map((p, i) => {
                  if (i === 0) return null;
                  const pr = filtered[i - 1];
                  const crossed = (p.score >= 70 && pr.score < 70) || (p.score <= 30 && pr.score > 30);
                  if (!crossed) return null;
                  const cx = (i / (filtered.length - 1)) * 94;
                  const cy = 100 - p.score;
                  const col = p.score >= 70 ? '#22c55e' : '#ef4444';
                  return <circle key={`dot-${i}`} cx={cx} cy={cy} r="1.2" fill={col} opacity="0.9" />;
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-1.5 text-[9px] text-zinc-700 font-mono">
              {getDateLabels().map((lbl, i) => <span key={i}>{lbl}</span>)}
            </div>
          </>
        ) : (
          <div className="h-[200px] bg-[#111122] rounded-xl border border-[#222238]/70 flex items-center justify-center">
            <p className="text-zinc-600 text-sm">L'historique se construit au fil des visites (1 point / 2h)</p>
          </div>
        )}
      </div>

      {/* Facteurs détaillés */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Décomposition du signal</h3>
        <div className="space-y-3">
          {(indicators || []).map((ind, i) => {
            const colors = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#a855f7'];
            const fc = colors[i] || '#3b82f6';
            const zone = ind.current >= 70 ? 'Positif' : ind.current <= 30 ? 'Négatif' : 'Neutre';
            const zoneColor = ind.current >= 70 ? 'text-emerald-400' : ind.current <= 30 ? 'text-red-400' : 'text-yellow-400';
            return (
              <div key={i} className="bg-[#111122] border border-[#222238]/70 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fc }} />
                    <span className="text-sm font-medium text-zinc-200">{ind.name}</span>
                    <span className="text-[10px] font-mono text-zinc-600">Poids: {ind.weight}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold ${zoneColor}`}>{zone}</span>
                    <span className="text-sm font-bold font-mono" style={{ color: fc }}>{ind.current}/100</span>
                  </div>
                </div>
                <div className="relative h-2 bg-[#0b0b14] rounded-full overflow-hidden">
                  <div className="absolute h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${ind.current}%`, backgroundColor: fc, opacity: 0.8 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Config alertes */}
        <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">Configuration alertes</h3>
            <button
              onClick={() => updateSetting('enabled', !settings.enabled)}
              className={`relative w-10 h-5.5 rounded-full transition-colors duration-300 ${
                settings.enabled ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                settings.enabled ? 'left-[22px]' : 'left-0.5'
              }`} />
            </button>
          </div>

          {settings.enabled && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">Seuil zone d'achat</span>
                  <span className="font-mono text-emerald-400 font-semibold">{settings.buyThreshold}</span>
                </div>
                <input type="range" min="50" max="90" value={settings.buyThreshold} onChange={(e) => updateSetting('buyThreshold', parseInt(e.target.value))} className="w-full accent-emerald-500 h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">Seuil zone prudence</span>
                  <span className="font-mono text-red-400 font-semibold">{settings.sellThreshold}</span>
                </div>
                <input type="range" min="10" max="50" value={settings.sellThreshold} onChange={(e) => updateSetting('sellThreshold', parseInt(e.target.value))} className="w-full accent-red-500 h-1.5" />
              </div>
              <button onClick={handleTest} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Tester les notifications
                {testResult === 'ok' && <span className="text-emerald-400">OK</span>}
                {testResult === 'blocked' && <span className="text-red-400">Bloquées</span>}
              </button>
            </div>
          )}
        </div>

        {/* Historique alertes */}
        <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Historique des alertes</h3>
          {alertHistory.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {alertHistory.slice(0, 20).map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#222238]/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${a.type === 'buy' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-zinc-300">{a.type === 'buy' ? "Zone d'achat" : 'Prudence'}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: a.type === 'buy' ? '#22c55e' : '#ef4444' }}>{a.score}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {new Date(a.ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-xs">Aucune alerte déclenchée pour le moment.</p>
          )}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">Comment lire l'indicateur</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-400">Score &gt; {settings.buyThreshold}</span>
            </div>
            <p className="text-[11px] text-zinc-500">Zone d'achat. Conditions favorables pour entrer en position. L'algo détecte un alignement positif des 5 facteurs.</p>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs font-semibold text-yellow-400">{settings.sellThreshold} - {settings.buyThreshold}</span>
            </div>
            <p className="text-[11px] text-zinc-500">Zone neutre. Pas de signal clair. Attendre une confirmation dans un sens ou l'autre avant d'agir.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-red-400">Score &lt; {settings.sellThreshold}</span>
            </div>
            <p className="text-[11px] text-zinc-500">Zone de prudence. Conditions défavorables. Éviter d'ouvrir de nouvelles positions ou renforcer la gestion du risque.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
