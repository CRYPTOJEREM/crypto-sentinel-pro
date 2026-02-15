import { useState, useMemo } from 'react';
import { getOppHistory } from '../utils/oppHistory';
import { getAlertHistory, getAlertSettings, saveAlertSettings, testNotification } from '../utils/alerts';
import { getOppClass } from '../utils/classifications';
import { computeRSI, computeSentiment } from '../utils/sentiment';

function getRSISignal(rsi) {
  if (rsi === null) return { label: 'N/A', color: '#71717a', short: '—' };
  if (rsi >= 60 && rsi <= 64) return { label: 'Continuation', color: '#22c55e', short: 'UP' };
  if (rsi > 80) return { label: 'Surachat++', color: '#ef4444', short: 'OB++' };
  if (rsi > 70) return { label: 'Surachat', color: '#f97316', short: 'OB' };
  if (rsi < 20) return { label: 'Survente++', color: '#22c55e', short: 'OS++' };
  if (rsi < 30) return { label: 'Survente', color: '#3b82f6', short: 'OS' };
  if (rsi >= 55 && rsi < 60) return { label: 'Pre-continuation', color: '#a3e635', short: 'PRE' };
  return { label: 'Neutre', color: '#eab308', short: '—' };
}

function getGlobalSignal(rsi, sentiment) {
  if (rsi !== null && rsi >= 60 && rsi <= 64 && sentiment > 55) return { label: 'ACHAT FORT', color: '#22c55e' };
  if (rsi !== null && rsi >= 60 && rsi <= 64) return { label: 'ACHAT', color: '#4ade80' };
  if (rsi !== null && rsi < 20 && sentiment > 40) return { label: 'REBOND', color: '#3b82f6' };
  if (sentiment > 65) return { label: 'BULLISH', color: '#22c55e' };
  if (rsi !== null && rsi > 80) return { label: 'PRUDENCE', color: '#ef4444' };
  if (sentiment < 35) return { label: 'BEARISH', color: '#ef4444' };
  return { label: 'NEUTRE', color: '#eab308' };
}

export default function IndicatorPage({ oppScore, indicators, fgValue, cryptos }) {
  const [range, setRange] = useState('30d');
  const [settings, setSettings] = useState(getAlertSettings);
  const [testResult, setTestResult] = useState(null);
  const [scanSearch, setScanSearch] = useState('');
  const [scanSort, setScanSort] = useState('continuation');

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

  // Scanner data: compute RSI + sentiment for each crypto
  const scannerData = useMemo(() => {
    if (!cryptos || cryptos.length === 0) return [];
    return cryptos.map((coin) => {
      const rsi = coin.sparkline && coin.sparkline.length >= 7 ? computeRSI(coin.sparkline, 6) : null;
      const sentiment = computeSentiment(coin);
      const rsiSignal = getRSISignal(rsi);
      const globalSignal = getGlobalSignal(rsi, sentiment);
      return { ...coin, rsi, sentiment, rsiSignal, globalSignal };
    });
  }, [cryptos]);

  const filteredScanner = useMemo(() => {
    let data = scannerData;
    if (scanSearch) {
      const q = scanSearch.toLowerCase();
      data = data.filter((c) => c.sym.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }
    return data.sort((a, b) => {
      if (scanSort === 'continuation') {
        const aInZone = a.rsi !== null && a.rsi >= 60 && a.rsi <= 64 ? 1 : 0;
        const bInZone = b.rsi !== null && b.rsi >= 60 && b.rsi <= 64 ? 1 : 0;
        if (bInZone !== aInZone) return bInZone - aInZone;
        return (b.sentiment || 0) - (a.sentiment || 0);
      }
      if (scanSort === 'rsi') return (b.rsi || 0) - (a.rsi || 0);
      if (scanSort === 'sentiment') return (b.sentiment || 0) - (a.sentiment || 0);
      if (scanSort === 'change') return (b.c24 || 0) - (a.c24 || 0);
      return a.id - b.id;
    });
  }, [scannerData, scanSearch, scanSort]);

  const continuationCount = scannerData.filter((c) => c.rsi !== null && c.rsi >= 60 && c.rsi <= 64).length;

  const signal = oppScore >= settings.buyThreshold ? 'buy' : oppScore <= settings.sellThreshold ? 'sell' : 'neutral';
  const signalLabel = signal === 'buy' ? "ZONE D'ACHAT" : signal === 'sell' ? 'ZONE PRUDENCE' : 'NEUTRE';
  const signalColor = signal === 'buy' ? '#22c55e' : signal === 'sell' ? '#ef4444' : '#eab308';
  const signalBg = signal === 'buy' ? 'bg-emerald-500/10 border-emerald-500/30' : signal === 'sell' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30';

  return (
    <div className="animate-fadeInUp max-w-6xl mx-auto space-y-6">
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

      {/* Scanner RSI(6) + Sentiment */}
      <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-300">Scanner RSI(6) + Sentiment</h3>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              <span className="text-emerald-400 font-semibold font-mono">{continuationCount}</span> crypto{continuationCount > 1 ? 's' : ''} en zone de continuation (RSI 60-64)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={scanSearch}
              onChange={(e) => setScanSearch(e.target.value)}
              placeholder="Rechercher..."
              className="bg-[#111122] border border-[#222238] rounded-lg px-3 py-1.5 text-xs text-zinc-300 w-36 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-700"
            />
            <select
              value={scanSort}
              onChange={(e) => setScanSort(e.target.value)}
              className="bg-[#111122] border border-[#222238] rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="continuation">Zone continuation</option>
              <option value="rsi">RSI(6)</option>
              <option value="sentiment">Sentiment</option>
              <option value="change">Variation 24h</option>
              <option value="rank">Rang</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#222238]/70 text-zinc-600 uppercase text-[10px]">
                <th className="text-left py-2 px-2 font-medium">#</th>
                <th className="text-left py-2 px-2 font-medium">Crypto</th>
                <th className="text-right py-2 px-2 font-medium">Prix</th>
                <th className="text-right py-2 px-2 font-medium">24h</th>
                <th className="text-right py-2 px-2 font-medium">RSI(6)</th>
                <th className="text-center py-2 px-2 font-medium">Signal RSI</th>
                <th className="text-right py-2 px-2 font-medium">Sentiment</th>
                <th className="text-center py-2 px-2 font-medium">Signal</th>
              </tr>
            </thead>
            <tbody>
              {filteredScanner.slice(0, 100).map((coin) => {
                const inZone = coin.rsi !== null && coin.rsi >= 60 && coin.rsi <= 64;
                const rowBg = inZone ? 'bg-emerald-500/5' : '';
                return (
                  <tr key={coin.cgId || coin.id} className={`border-b border-[#222238]/30 hover:bg-[#111122]/80 transition-colors ${rowBg}`}>
                    <td className="py-2 px-2 text-zinc-600 font-mono">{coin.id}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        {coin.image && <img src={coin.image} alt="" className="w-4 h-4 rounded-full" />}
                        <span className="text-zinc-200 font-medium">{coin.sym}</span>
                        <span className="text-zinc-600 hidden sm:inline">{coin.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-zinc-300">
                      ${coin.price < 1 ? coin.price?.toFixed(4) : coin.price?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-2 px-2 text-right font-mono font-semibold ${(coin.c24 || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(coin.c24 || 0) >= 0 ? '+' : ''}{(coin.c24 || 0).toFixed(1)}%
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-semibold" style={{ color: coin.rsiSignal.color }}>
                      {coin.rsi !== null ? coin.rsi : '—'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{ color: coin.rsiSignal.color, backgroundColor: coin.rsiSignal.color + '15' }}
                      >
                        {coin.rsiSignal.label}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-12 h-1.5 bg-[#0b0b14] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${coin.sentiment}%`,
                              backgroundColor: coin.sentiment > 60 ? '#22c55e' : coin.sentiment < 40 ? '#ef4444' : '#eab308',
                            }}
                          />
                        </div>
                        <span className="font-mono font-semibold w-6 text-right" style={{
                          color: coin.sentiment > 60 ? '#22c55e' : coin.sentiment < 40 ? '#ef4444' : '#eab308',
                        }}>
                          {coin.sentiment}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ color: coin.globalSignal.color, backgroundColor: coin.globalSignal.color + '15' }}
                      >
                        {coin.globalSignal.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredScanner.length > 100 && (
          <p className="text-[10px] text-zinc-700 mt-2 text-center">Affichage limite a 100 cryptos</p>
        )}
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
              <span className="text-xs font-semibold text-emerald-400">RSI 60-64 + Sentiment &gt; 55</span>
            </div>
            <p className="text-[11px] text-zinc-500">Signal ACHAT FORT. RSI en zone de continuation haussiere confirme par un sentiment positif des 6 facteurs.</p>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs font-semibold text-yellow-400">Zone neutre</span>
            </div>
            <p className="text-[11px] text-zinc-500">Pas de signal clair. RSI hors zone et/ou sentiment mitige. Attendre une confirmation.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-red-400">RSI &gt; 80 ou Sentiment &lt; 35</span>
            </div>
            <p className="text-[11px] text-zinc-500">Signal PRUDENCE. Surachat extreme ou conditions defavorables. Gestion du risque renforcee.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
