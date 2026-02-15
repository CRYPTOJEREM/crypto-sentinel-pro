import { useState, useEffect, useRef } from 'react';
import { getOppHistory } from '../utils/oppHistory';
import { getAlertHistory, getAlertSettings, saveAlertSettings, testNotification } from '../utils/alerts';
import { getOppClass } from '../utils/classifications';
import { computeRSI } from '../utils/sentiment';

const TOP_CRYPTOS = [
  { sym: 'BTC', label: 'Bitcoin' },
  { sym: 'ETH', label: 'Ethereum' },
  { sym: 'SOL', label: 'Solana' },
  { sym: 'BNB', label: 'BNB' },
  { sym: 'XRP', label: 'XRP' },
  { sym: 'ADA', label: 'Cardano' },
  { sym: 'AVAX', label: 'Avalanche' },
  { sym: 'DOT', label: 'Polkadot' },
  { sym: 'MATIC', label: 'Polygon' },
  { sym: 'LINK', label: 'Chainlink' },
  { sym: 'DOGE', label: 'Dogecoin' },
  { sym: 'SHIB', label: 'Shiba Inu' },
];

function getRSISignal(rsi) {
  if (rsi === null) return { label: 'N/A', color: '#71717a', desc: 'Données insuffisantes' };
  if (rsi >= 60 && rsi <= 64) return { label: 'Continuation haussiere', color: '#22c55e', desc: 'RSI(6) en zone 60-64 : signal de continuation de tendance haussiere. Forte probabilite de poursuite du mouvement.' };
  if (rsi > 80) return { label: 'Surachat extreme', color: '#ef4444', desc: 'RSI(6) > 80 : zone de surachat extreme. Risque de correction a court terme.' };
  if (rsi > 70) return { label: 'Surachat', color: '#f97316', desc: 'RSI(6) > 70 : zone de surachat. Mouvement haussier fort, mais attention a un retournement.' };
  if (rsi < 20) return { label: 'Survente extreme', color: '#22c55e', desc: 'RSI(6) < 20 : zone de survente extreme. Potentiel rebond technique eleve.' };
  if (rsi < 30) return { label: 'Survente', color: '#3b82f6', desc: 'RSI(6) < 30 : zone de survente. Opportunite d\'achat potentielle si le marche se stabilise.' };
  if (rsi >= 55 && rsi < 60) return { label: 'Pre-continuation', color: '#eab308', desc: 'RSI(6) proche de la zone 60-64. Surveiller pour un signal de continuation.' };
  return { label: 'Neutre', color: '#eab308', desc: 'RSI(6) en zone neutre. Pas de signal fort de direction.' };
}

function TradingViewWidget({ symbol }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}USDT`,
      interval: '240',
      timezone: 'Europe/Paris',
      theme: 'dark',
      style: '1',
      locale: 'fr',
      backgroundColor: 'rgba(11, 11, 20, 1)',
      gridColor: 'rgba(42, 42, 69, 0.3)',
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      studies: [
        { id: 'RSI@tv-basicstudies', inputs: { length: 6 } },
      ],
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'tradingview-widget-container__widget';
    wrapper.style.height = '100%';
    wrapper.style.width = '100%';

    containerRef.current.appendChild(wrapper);
    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: '500px', width: '100%' }} />
  );
}

export default function IndicatorPage({ oppScore, indicators, fgValue, cryptos }) {
  const [range, setRange] = useState('30d');
  const [settings, setSettings] = useState(getAlertSettings);
  const [testResult, setTestResult] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

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

  // RSI analysis for selected crypto
  const selectedCoin = (cryptos || []).find((co) => co.sym === selectedCrypto);
  const rsiValue = selectedCoin?.sparkline ? computeRSI(selectedCoin.sparkline, 6) : null;
  const rsiSignal = getRSISignal(rsiValue);

  const signal = oppScore >= settings.buyThreshold ? 'buy' : oppScore <= settings.sellThreshold ? 'sell' : 'neutral';
  const signalLabel = signal === 'buy' ? "ZONE D'ACHAT" : signal === 'sell' ? 'ZONE PRUDENCE' : 'NEUTRE';
  const signalColor = signal === 'buy' ? '#22c55e' : signal === 'sell' ? '#ef4444' : '#eab308';
  const signalBg = signal === 'buy' ? 'bg-emerald-500/10 border-emerald-500/30' : signal === 'sell' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30';

  return (
    <div className="animate-fadeInUp max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Indicateur Crypto Sentinel</h2>
        <p className="text-sm text-zinc-500">Signal d'achat/vente base sur l'algorithme proprietaire — 6 facteurs dont RSI(6), backtest 2 ans</p>
      </div>

      {/* Signal actuel */}
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

      {/* TradingView Chart + Crypto Selector */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-300">Graphique TradingView</h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="bg-[#111122] border border-[#222238] rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors"
            >
              {TOP_CRYPTOS.map((cr) => (
                <option key={cr.sym} value={cr.sym}>{cr.sym} — {cr.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-[#222238]/70">
          <TradingViewWidget symbol={selectedCrypto} />
        </div>
      </div>

      {/* RSI(6) Analysis Panel */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Analyse RSI(6) — {selectedCrypto}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RSI Value */}
          <div className="bg-[#111122] border border-[#222238]/70 rounded-xl p-4 text-center">
            <p className="text-[10px] text-zinc-600 uppercase mb-2">RSI(6) Actuel</p>
            <p className="text-3xl font-bold font-mono" style={{ color: rsiSignal.color }}>
              {rsiValue !== null ? rsiValue : '—'}
            </p>
            {selectedCoin && (
              <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                Prix: ${selectedCoin.price?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
          {/* Signal */}
          <div className="bg-[#111122] border border-[#222238]/70 rounded-xl p-4">
            <p className="text-[10px] text-zinc-600 uppercase mb-2">Signal</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rsiSignal.color }} />
              <span className="text-sm font-semibold" style={{ color: rsiSignal.color }}>{rsiSignal.label}</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">{rsiSignal.desc}</p>
          </div>
          {/* RSI Gauge */}
          <div className="bg-[#111122] border border-[#222238]/70 rounded-xl p-4">
            <p className="text-[10px] text-zinc-600 uppercase mb-2">Zone RSI</p>
            <div className="relative h-4 rounded-full overflow-hidden bg-[#0b0b14] mt-3">
              <div className="absolute inset-0 flex">
                <div className="h-full bg-emerald-500/30" style={{ width: '20%' }} />
                <div className="h-full bg-blue-500/20" style={{ width: '10%' }} />
                <div className="h-full bg-yellow-500/15" style={{ width: '26%' }} />
                <div className="h-full bg-emerald-500/40" style={{ width: '4%' }} title="Zone 60-64" />
                <div className="h-full bg-yellow-500/15" style={{ width: '6%' }} />
                <div className="h-full bg-orange-500/25" style={{ width: '14%' }} />
                <div className="h-full bg-red-500/30" style={{ width: '20%' }} />
              </div>
              {rsiValue !== null && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg shadow-white/50"
                  style={{ left: `${rsiValue}%` }}
                />
              )}
            </div>
            <div className="flex justify-between mt-1.5 text-[9px] font-mono text-zinc-700">
              <span>0</span>
              <span>30</span>
              <span>60</span>
              <span>64</span>
              <span>70</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historique du signal */}
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
                <rect x="0" y="0" width="94" height="30" fill="rgba(34,197,94,0.06)" />
                <rect x="0" y="70" width="94" height="30" fill="rgba(239,68,68,0.06)" />
                <line x1="0" y1="30" x2="94" y2="30" stroke="rgba(34,197,94,0.25)" strokeWidth="0.3" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="94" y2="50" stroke="rgba(63,63,70,0.3)" strokeWidth="0.2" />
                <line x1="0" y1="70" x2="94" y2="70" stroke="rgba(239,68,68,0.25)" strokeWidth="0.3" strokeDasharray="2,2" />
                <text x="1" y="28" fill="rgba(34,197,94,0.4)" fontSize="2.5" fontFamily="monospace">ACHAT</text>
                <text x="1" y="73" fill="rgba(239,68,68,0.4)" fontSize="2.5" fontFamily="monospace">PRUDENCE</text>
                <defs>
                  <linearGradient id="indFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={signalColor} stopOpacity="0.12" />
                    <stop offset="100%" stopColor={signalColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M 0,100 ${filtered.map((p, i) => `L ${(i / (filtered.length - 1)) * 94},${100 - p.score}`).join(' ')} L ${94},100 Z`} fill="url(#indFill)" />
                {filtered.map((p, i) => {
                  if (i === 0) return null;
                  const pr = filtered[i - 1];
                  const avg = (p.score + pr.score) / 2;
                  const col = avg >= 70 ? '#22c55e' : avg <= 30 ? '#ef4444' : '#eab308';
                  return <line key={i} x1={((i - 1) / (filtered.length - 1)) * 94} y1={100 - pr.score} x2={(i / (filtered.length - 1)) * 94} y2={100 - p.score} stroke={col} strokeWidth="0.7" opacity="0.85" />;
                })}
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

      {/* Facteurs detailles */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Decomposition du signal</h3>
        <div className="space-y-3">
          {(indicators || []).map((ind, i) => {
            const colors = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#a855f7', '#06b6d4'];
            const fc = colors[i] || '#3b82f6';
            const zone = ind.current >= 70 ? 'Positif' : ind.current <= 30 ? 'Negatif' : 'Neutre';
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
                {testResult === 'blocked' && <span className="text-red-400">Bloquees</span>}
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
            <p className="text-zinc-600 text-xs">Aucune alerte declenchee pour le moment.</p>
          )}
        </div>
      </div>

      {/* Legende */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">Comment lire l'indicateur</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-400">Score &gt; {settings.buyThreshold}</span>
            </div>
            <p className="text-[11px] text-zinc-500">Zone d'achat. Conditions favorables. L'algo detecte un alignement positif des 6 facteurs dont le RSI(6).</p>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs font-semibold text-yellow-400">{settings.sellThreshold} - {settings.buyThreshold}</span>
            </div>
            <p className="text-[11px] text-zinc-500">Zone neutre. Pas de signal clair. Attendre une confirmation avant d'agir.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-red-400">Score &lt; {settings.sellThreshold}</span>
            </div>
            <p className="text-[11px] text-zinc-500">Zone de prudence. Conditions defavorables. Renforcer la gestion du risque.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
