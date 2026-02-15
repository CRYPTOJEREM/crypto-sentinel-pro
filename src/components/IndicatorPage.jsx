import { useState, useMemo } from 'react';
import { getOppHistory } from '../utils/oppHistory';
import { getAlertHistory, getAlertSettings, saveAlertSettings, testNotification } from '../utils/alerts';
import { getOppClass } from '../utils/classifications';
import { computeRSI, computeSentiment } from '../utils/sentiment';

function getRSISignal(rsi) {
  if (rsi === null) return { label: 'N/A', color: '#71717a' };
  if (rsi >= 60 && rsi <= 64) return { label: 'Continuation', color: '#34d399' };
  if (rsi > 80) return { label: 'Surachat++', color: '#f87171' };
  if (rsi > 70) return { label: 'Surachat', color: '#fb923c' };
  if (rsi < 20) return { label: 'Survente++', color: '#34d399' };
  if (rsi < 30) return { label: 'Survente', color: '#60a5fa' };
  if (rsi >= 55 && rsi < 60) return { label: 'Pre-signal', color: '#a3e635' };
  return { label: 'Neutre', color: '#fbbf24' };
}

function getGlobalSignal(rsi, sentiment) {
  if (rsi !== null && rsi >= 60 && rsi <= 64 && sentiment > 55) return { label: 'ACHAT FORT', color: '#34d399', bg: 'rgba(52,211,153,0.1)' };
  if (rsi !== null && rsi >= 60 && rsi <= 64) return { label: 'ACHAT', color: '#6ee7b7', bg: 'rgba(110,231,183,0.08)' };
  if (rsi !== null && rsi < 20 && sentiment > 40) return { label: 'REBOND', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' };
  if (sentiment > 65) return { label: 'BULLISH', color: '#34d399', bg: 'rgba(52,211,153,0.08)' };
  if (rsi !== null && rsi > 80) return { label: 'PRUDENCE', color: '#f87171', bg: 'rgba(248,113,113,0.1)' };
  if (sentiment < 35) return { label: 'BEARISH', color: '#f87171', bg: 'rgba(248,113,113,0.08)' };
  return { label: 'NEUTRE', color: '#fbbf24', bg: 'rgba(251,191,36,0.06)' };
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
  const signalColor = signal === 'buy' ? '#34d399' : signal === 'sell' ? '#f87171' : '#fbbf24';

  return (
    <div className="animate-fadeInUp max-w-6xl mx-auto space-y-8">

      {/* Hero section */}
      <div className="text-center pt-4 pb-2">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Radar Crypto Sentinel</h2>
        <p className="text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Algorithme proprietaire a 6 facteurs combine avec le RSI(6) pour detecter les meilleures opportunites en temps reel.
        </p>
      </div>

      {/* Signal hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] p-8" style={{ background: 'linear-gradient(135deg, rgba(11,11,20,0.95) 0%, rgba(22,22,42,0.95) 100%)' }}>
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 30% 50%, ${signalColor}15 0%, transparent 60%)` }} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: signalColor + '12', border: `1px solid ${signalColor}25` }}>
                <span className="text-3xl font-bold font-mono" style={{ color: signalColor }}>{oppScore}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0b0b14]" style={{ backgroundColor: signalColor }} />
            </div>
            <div>
              <p className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider mb-1">Signal global</p>
              <p className="text-xl font-bold tracking-tight" style={{ color: signalColor }}>
                {signal === 'buy' ? "Zone d'achat" : signal === 'sell' ? 'Zone prudence' : 'Neutre'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{c.desc}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Fear & Greed</p>
              <p className="text-2xl font-bold font-mono text-zinc-300">{fgValue}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">En continuation</p>
              <p className="text-2xl font-bold font-mono text-emerald-400">{continuationCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner */}
      <div className="rounded-3xl border border-white/[0.06] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">Scanner RSI(6) + Sentiment</h3>
              <p className="text-xs text-zinc-600 mt-1">
                <span className="text-emerald-400 font-semibold font-mono">{continuationCount}</span> crypto{continuationCount > 1 ? 's' : ''} en zone de continuation haussiere
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={scanSearch}
                  onChange={(e) => setScanSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-300 w-40 focus:outline-none focus:border-white/[0.12] transition-colors placeholder-zinc-700"
                />
              </div>
              <select
                value={scanSort}
                onChange={(e) => setScanSort(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-white/[0.12] transition-colors appearance-none cursor-pointer"
              >
                <option value="continuation">Zone continuation</option>
                <option value="rsi">RSI(6)</option>
                <option value="sentiment">Sentiment</option>
                <option value="change">Variation 24h</option>
                <option value="rank">Rang</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-t border-b border-white/[0.04] text-zinc-600 uppercase text-[10px] tracking-wider">
                <th className="text-left py-3 px-6 font-medium">#</th>
                <th className="text-left py-3 px-3 font-medium">Crypto</th>
                <th className="text-right py-3 px-3 font-medium">Prix</th>
                <th className="text-right py-3 px-3 font-medium">24h</th>
                <th className="text-right py-3 px-3 font-medium">RSI(6)</th>
                <th className="text-center py-3 px-3 font-medium">Signal RSI</th>
                <th className="text-right py-3 px-3 font-medium">Sentiment</th>
                <th className="text-center py-3 px-6 font-medium">Signal</th>
              </tr>
            </thead>
            <tbody>
              {filteredScanner.slice(0, 100).map((coin) => {
                const inZone = coin.rsi !== null && coin.rsi >= 60 && coin.rsi <= 64;
                return (
                  <tr key={coin.cgId || coin.id} className={`border-b border-white/[0.03] transition-all duration-200 hover:bg-white/[0.02] ${inZone ? 'bg-emerald-500/[0.03]' : ''}`}>
                    <td className="py-3 px-6 text-zinc-600 font-mono text-[11px]">{coin.id}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {coin.image && <img src={coin.image} alt="" className="w-5 h-5 rounded-full" />}
                        <div>
                          <span className="text-zinc-200 font-medium text-[12px]">{coin.sym}</span>
                          <span className="text-zinc-600 text-[11px] ml-2 hidden sm:inline">{coin.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-300 text-[12px]">
                      ${coin.price < 1 ? coin.price?.toFixed(4) : coin.price?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-medium text-[12px] ${(coin.c24 || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(coin.c24 || 0) >= 0 ? '+' : ''}{(coin.c24 || 0).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-[12px]" style={{ color: coin.rsiSignal.color }}>
                      {coin.rsi !== null ? coin.rsi : '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-semibold"
                        style={{ color: coin.rsiSignal.color, backgroundColor: coin.rsiSignal.color + '10' }}
                      >
                        {coin.rsiSignal.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-14 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${coin.sentiment}%`,
                              backgroundColor: coin.sentiment > 60 ? '#34d399' : coin.sentiment < 40 ? '#f87171' : '#fbbf24',
                              opacity: 0.7,
                            }}
                          />
                        </div>
                        <span className="font-mono font-semibold w-5 text-right text-[11px]" style={{
                          color: coin.sentiment > 60 ? '#34d399' : coin.sentiment < 40 ? '#f87171' : '#fbbf24',
                        }}>
                          {coin.sentiment}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide"
                        style={{ color: coin.globalSignal.color, backgroundColor: coin.globalSignal.bg }}
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
          <p className="text-[10px] text-zinc-700 py-3 text-center border-t border-white/[0.03]">Affichage limite a 100 cryptos</p>
        )}
      </div>

      {/* Historique du signal */}
      <div className="rounded-3xl border border-white/[0.06] p-6" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white tracking-tight">Historique du signal</h3>
          <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
            {['7d', '30d', 'All'].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${range === r ? 'bg-white/[0.08] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>{r}</button>
            ))}
          </div>
        </div>

        {filtered.length > 1 ? (
          <>
            <div className="relative h-[200px] bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.04]">
              <div className="absolute right-3 top-0 bottom-0 flex flex-col justify-between py-3 text-[9px] font-mono z-10 text-zinc-700">
                <span>100</span><span>70</span><span>50</span><span>30</span><span>0</span>
              </div>
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <rect x="0" y="0" width="94" height="30" fill="rgba(52,211,153,0.04)" />
                <rect x="0" y="70" width="94" height="30" fill="rgba(248,113,113,0.04)" />
                <line x1="0" y1="30" x2="94" y2="30" stroke="rgba(52,211,153,0.15)" strokeWidth="0.3" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="94" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
                <line x1="0" y1="70" x2="94" y2="70" stroke="rgba(248,113,113,0.15)" strokeWidth="0.3" strokeDasharray="2,2" />
                <defs>
                  <linearGradient id="indFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={signalColor} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={signalColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M 0,100 ${filtered.map((p, i) => `L ${(i / (filtered.length - 1)) * 94},${100 - p.score}`).join(' ')} L ${94},100 Z`} fill="url(#indFill)" />
                {filtered.map((p, i) => {
                  if (i === 0) return null;
                  const pr = filtered[i - 1];
                  const avg = (p.score + pr.score) / 2;
                  const col = avg >= 70 ? '#34d399' : avg <= 30 ? '#f87171' : '#fbbf24';
                  return <line key={i} x1={((i - 1) / (filtered.length - 1)) * 94} y1={100 - pr.score} x2={(i / (filtered.length - 1)) * 94} y2={100 - p.score} stroke={col} strokeWidth="0.6" opacity="0.7" />;
                })}
                {filtered.map((p, i) => {
                  if (i === 0) return null;
                  const pr = filtered[i - 1];
                  const crossed = (p.score >= 70 && pr.score < 70) || (p.score <= 30 && pr.score > 30);
                  if (!crossed) return null;
                  const cx = (i / (filtered.length - 1)) * 94;
                  const cy = 100 - p.score;
                  const col = p.score >= 70 ? '#34d399' : '#f87171';
                  return <circle key={`dot-${i}`} cx={cx} cy={cy} r="1" fill={col} opacity="0.8" />;
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-zinc-700 font-mono px-1">
              {getDateLabels().map((lbl, i) => <span key={i}>{lbl}</span>)}
            </div>
          </>
        ) : (
          <div className="h-[200px] bg-white/[0.02] rounded-2xl border border-white/[0.04] flex items-center justify-center">
            <p className="text-zinc-600 text-sm">L'historique se construit au fil des visites (1 point / 2h)</p>
          </div>
        )}
      </div>

      {/* Decomposition — 6 facteurs */}
      <div className="rounded-3xl border border-white/[0.06] p-6" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <h3 className="text-base font-semibold text-white tracking-tight mb-5">Decomposition du signal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(indicators || []).map((ind, i) => {
            const colors = ['#60a5fa', '#34d399', '#fbbf24', '#fb923c', '#c084fc', '#22d3ee'];
            const fc = colors[i] || '#60a5fa';
            const zone = ind.current >= 70 ? 'Positif' : ind.current <= 30 ? 'Negatif' : 'Neutre';
            const zoneColor = ind.current >= 70 ? '#34d399' : ind.current <= 30 ? '#f87171' : '#fbbf24';
            return (
              <div key={i} className="rounded-2xl border border-white/[0.04] p-4 transition-all duration-200 hover:border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: fc }} />
                    <span className="text-[12px] font-medium text-zinc-300">{ind.name}</span>
                  </div>
                  <span className="text-sm font-bold font-mono" style={{ color: fc }}>{ind.current}</span>
                </div>
                <div className="relative h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-2">
                  <div className="absolute h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${ind.current}%`, backgroundColor: fc, opacity: 0.6 }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600 font-mono">Poids {ind.weight}%</span>
                  <span className="text-[10px] font-semibold" style={{ color: zoneColor }}>{zone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertes — 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Config alertes */}
        <div className="rounded-3xl border border-white/[0.06] p-6" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white tracking-tight">Alertes</h3>
            <button
              onClick={() => updateSetting('enabled', !settings.enabled)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                settings.enabled ? 'bg-emerald-500/80' : 'bg-white/[0.06]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                settings.enabled ? 'left-[24px]' : 'left-1'
              }`} />
            </button>
          </div>

          {settings.enabled && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-500">Seuil zone d'achat</span>
                  <span className="font-mono text-emerald-400 font-semibold text-[13px]">{settings.buyThreshold}</span>
                </div>
                <input type="range" min="50" max="90" value={settings.buyThreshold} onChange={(e) => updateSetting('buyThreshold', parseInt(e.target.value))} className="w-full accent-emerald-500 h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-500">Seuil zone prudence</span>
                  <span className="font-mono text-red-400 font-semibold text-[13px]">{settings.sellThreshold}</span>
                </div>
                <input type="range" min="10" max="50" value={settings.sellThreshold} onChange={(e) => updateSetting('sellThreshold', parseInt(e.target.value))} className="w-full accent-red-500 h-1" />
              </div>
              <button onClick={handleTest} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-all duration-200 mt-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Tester
                {testResult === 'ok' && <span className="text-emerald-400 font-medium">OK</span>}
                {testResult === 'blocked' && <span className="text-red-400 font-medium">Bloquees</span>}
              </button>
            </div>
          )}
        </div>

        {/* Historique alertes */}
        <div className="rounded-3xl border border-white/[0.06] p-6" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
          <h3 className="text-base font-semibold text-white tracking-tight mb-5">Historique alertes</h3>
          {alertHistory.length > 0 ? (
            <div className="space-y-1 max-h-[220px] overflow-y-auto">
              {alertHistory.slice(0, 20).map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.03] last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${a.type === 'buy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-[12px] text-zinc-400">{a.type === 'buy' ? "Achat" : 'Prudence'}</span>
                    <span className="text-[12px] font-mono font-semibold" style={{ color: a.type === 'buy' ? '#34d399' : '#f87171' }}>{a.score}</span>
                  </div>
                  <span className="text-[10px] text-zinc-700 font-mono">
                    {new Date(a.ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-20">
              <p className="text-zinc-700 text-xs">Aucune alerte pour le moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Legende */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
        <div className="rounded-2xl border border-emerald-500/10 p-5" style={{ background: 'rgba(52,211,153,0.03)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">Achat fort</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">RSI(6) en zone 60-64 confirme par un sentiment positif. Signal de continuation haussiere.</p>
        </div>
        <div className="rounded-2xl border border-yellow-500/10 p-5" style={{ background: 'rgba(251,191,36,0.02)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">Neutre</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">Pas de signal clair. RSI hors zone et/ou sentiment mitige. Attendre confirmation.</p>
        </div>
        <div className="rounded-2xl border border-red-500/10 p-5" style={{ background: 'rgba(248,113,113,0.02)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs font-semibold text-red-400">Prudence</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">Surachat ou conditions defavorables. Renforcer la gestion du risque.</p>
        </div>
      </div>
    </div>
  );
}
