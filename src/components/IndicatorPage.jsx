import { useState, useMemo } from 'react';
import { getOppHistory } from '../utils/oppHistory';
import { getAlertHistory, getAlertSettings, saveAlertSettings, testNotification } from '../utils/alerts';
import { getTelegramConfig, saveTelegramConfig, testTelegramBot } from '../utils/telegram';
import { getOppClass } from '../utils/classifications';
import { computeRSI, computeSentiment } from '../utils/sentiment';
import { isBitunixPerp } from '../utils/bitunixPairs';

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
  const [tgConfig, setTgConfig] = useState(getTelegramConfig);
  const [tgTestResult, setTgTestResult] = useState(null);
  const [showTgConfig, setShowTgConfig] = useState(false);

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

  const updateTgConfig = (key, value) => {
    const next = { ...tgConfig, [key]: value };
    setTgConfig(next);
    saveTelegramConfig(next);
  };

  const handleTgTest = async () => {
    setTgTestResult('loading');
    const ok = await testTelegramBot();
    setTgTestResult(ok ? 'ok' : 'error');
    setTimeout(() => setTgTestResult(null), 4000);
  };

  const getDateLabels = () => {
    if (filtered.length < 2) return [];
    const fmt = (ts) => new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const step = Math.floor(filtered.length / 4);
    return [0, step, step * 2, step * 3, filtered.length - 1]
      .map((i) => filtered[i] ? fmt(filtered[i].ts) : '')
      .filter(Boolean);
  };

  // Only show coins available on Bitunix perpetual futures
  const scannerData = useMemo(() => {
    if (!cryptos || cryptos.length === 0) return [];
    return cryptos
      .filter((coin) => isBitunixPerp(coin.sym))
      .map((coin) => {
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

  // Signal counts for summary cards
  const signalCounts = useMemo(() => {
    const counts = { achatFort: 0, achat: 0, bullish: 0, rebond: 0, neutre: 0, prudence: 0, bearish: 0 };
    scannerData.forEach((c) => {
      const lbl = c.globalSignal.label;
      if (lbl === 'ACHAT FORT') counts.achatFort++;
      else if (lbl === 'ACHAT') counts.achat++;
      else if (lbl === 'BULLISH') counts.bullish++;
      else if (lbl === 'REBOND') counts.rebond++;
      else if (lbl === 'PRUDENCE') counts.prudence++;
      else if (lbl === 'BEARISH') counts.bearish++;
      else counts.neutre++;
    });
    return counts;
  }, [scannerData]);

  const continuationCount = scannerData.filter((c) => c.rsi !== null && c.rsi >= 60 && c.rsi <= 64).length;

  const signal = oppScore >= settings.buyThreshold ? 'buy' : oppScore <= settings.sellThreshold ? 'sell' : 'neutral';
  const signalColor = signal === 'buy' ? '#34d399' : signal === 'sell' ? '#f87171' : '#fbbf24';

  return (
    <div className="animate-fadeInUp max-w-7xl mx-auto space-y-8">

      {/* Hero section */}
      <div className="text-center pt-6 pb-2">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Radar Crypto Sentinel</h2>
        <p className="text-base text-zinc-500 max-w-xl mx-auto leading-relaxed">
          Analysez les phases de marché en un coup d'œil. Un outil pour simplifier vos décisions.
        </p>
      </div>

      {/* Signal hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] p-10" style={{ background: 'linear-gradient(135deg, rgba(11,11,20,0.95) 0%, rgba(22,22,42,0.95) 100%)' }}>
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 30% 50%, ${signalColor}15 0%, transparent 60%)` }} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ backgroundColor: signalColor + '12', border: `1px solid ${signalColor}25` }}>
                <span className="text-4xl font-bold font-mono" style={{ color: signalColor }}>{oppScore}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0b0b14]" style={{ backgroundColor: signalColor }} />
            </div>
            <div>
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-1">Signal global</p>
              <p className="text-2xl font-bold tracking-tight" style={{ color: signalColor }}>
                {signal === 'buy' ? "Zone d'achat" : signal === 'sell' ? 'Zone prudence' : 'Neutre'}
              </p>
              <p className="text-sm text-zinc-500 mt-1">{c.desc}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-10">
            <div className="text-center">
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-1">Fear & Greed</p>
              <p className="text-3xl font-bold font-mono text-zinc-300">{fgValue}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-1">En continuation</p>
              <p className="text-3xl font-bold font-mono text-emerald-400">{continuationCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signal summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { label: 'Achat Fort', count: signalCounts.achatFort, color: '#34d399', bg: 'rgba(52,211,153,0.06)' },
          { label: 'Achat', count: signalCounts.achat, color: '#6ee7b7', bg: 'rgba(110,231,183,0.05)' },
          { label: 'Bullish', count: signalCounts.bullish, color: '#4ade80', bg: 'rgba(74,222,128,0.05)' },
          { label: 'Rebond', count: signalCounts.rebond, color: '#60a5fa', bg: 'rgba(96,165,250,0.06)' },
          { label: 'Neutre', count: signalCounts.neutre, color: '#fbbf24', bg: 'rgba(251,191,36,0.05)' },
          { label: 'Prudence', count: signalCounts.prudence, color: '#fb923c', bg: 'rgba(251,146,60,0.06)' },
          { label: 'Bearish', count: signalCounts.bearish, color: '#f87171', bg: 'rgba(248,113,113,0.05)' },
        ].map((card) => (
          <div key={card.label} className="card-hover rounded-2xl border border-white/[0.05] p-4 text-center hover:border-white/[0.1]" style={{ background: card.bg }}>
            <p className="text-3xl font-bold font-mono mb-1" style={{ color: card.color }}>{card.count}</p>
            <p className="text-xs font-medium" style={{ color: card.color, opacity: 0.8 }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Notifications + Telegram — compact card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Historique notifs */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] p-5" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <span className="text-[10px] text-zinc-600 font-mono">{alertHistory.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleTest} className="text-[10px] text-zinc-600 hover:text-white transition-colors px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                Tester {testResult === 'ok' ? '✓' : testResult === 'blocked' ? '✗' : ''}
              </button>
              <button
                onClick={() => updateSetting('enabled', !settings.enabled)}
                className={`relative w-9 h-5 rounded-full transition-all duration-300 ${settings.enabled ? 'bg-emerald-500/80' : 'bg-white/[0.06]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${settings.enabled ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {settings.enabled && (
            <div className="flex items-center gap-5 mb-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600">Achat ≥</span>
                <input type="range" min="50" max="90" value={settings.buyThreshold} onChange={(e) => updateSetting('buyThreshold', parseInt(e.target.value))} className="w-16 accent-emerald-500 h-1" />
                <span className="font-mono text-emerald-400 font-bold w-4">{settings.buyThreshold}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600">Prudence ≤</span>
                <input type="range" min="10" max="50" value={settings.sellThreshold} onChange={(e) => updateSetting('sellThreshold', parseInt(e.target.value))} className="w-16 accent-red-500 h-1" />
                <span className="font-mono text-red-400 font-bold w-4">{settings.sellThreshold}</span>
              </div>
            </div>
          )}

          {alertHistory.length > 0 ? (
            <div className="space-y-0 max-h-[200px] overflow-y-auto rounded-xl border border-white/[0.04] bg-white/[0.01]">
              {alertHistory.slice(0, 30).map((a, i) => {
                const isPhase = a.type === 'phase_up' || a.type === 'phase_down';
                const isPositive = a.type === 'buy' || a.type === 'phase_up';
                return (
                  <div key={i} className="flex items-center justify-between py-2 px-4 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{isPositive ? '↗' : '↘'}</span>
                      {isPhase ? (
                        <>
                          <span className="text-xs font-semibold text-zinc-200">{a.sym}</span>
                          <span className="text-[10px] text-zinc-600">{a.from} → </span>
                          <span className="text-[10px] font-semibold" style={{ color: isPositive ? '#34d399' : '#f87171' }}>{a.to}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-zinc-400">{a.type === 'buy' ? "Achat" : 'Prudence'}</span>
                          <span className="text-xs font-mono font-bold" style={{ color: isPositive ? '#34d399' : '#f87171' }}>{a.score}</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-700 font-mono">
                      {new Date(a.ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} {new Date(a.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-16 rounded-xl border border-white/[0.04] bg-white/[0.01]">
              <p className="text-zinc-700 text-xs">Aucune notification</p>
            </div>
          )}
        </div>

        {/* Telegram bot config */}
        <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <svg className="w-4.5 h-4.5 text-[#26A5E4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              <h3 className="text-sm font-semibold text-white">Telegram Bot</h3>
            </div>
            <button
              onClick={() => updateTgConfig('enabled', !tgConfig.enabled)}
              className={`relative w-9 h-5 rounded-full transition-all duration-300 ${tgConfig.enabled ? 'bg-[#26A5E4]/80' : 'bg-white/[0.06]'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${tgConfig.enabled ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </div>

          {showTgConfig || tgConfig.enabled ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1 block">Bot Token</label>
                <input
                  type="password"
                  value={tgConfig.botToken}
                  onChange={(e) => updateTgConfig('botToken', e.target.value)}
                  placeholder="123456:ABC-DEF..."
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-white/[0.12] placeholder-zinc-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1 block">Chat ID</label>
                <input
                  type="text"
                  value={tgConfig.chatId}
                  onChange={(e) => updateTgConfig('chatId', e.target.value)}
                  placeholder="-100123456789"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-white/[0.12] placeholder-zinc-700 font-mono"
                />
              </div>
              <button
                onClick={handleTgTest}
                disabled={!tgConfig.botToken || !tgConfig.chatId}
                className="w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 bg-[#26A5E4]/10 border border-[#26A5E4]/20 text-[#26A5E4] hover:bg-[#26A5E4]/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {tgTestResult === 'loading' ? 'Envoi...' : tgTestResult === 'ok' ? 'Envoyé !' : tgTestResult === 'error' ? 'Erreur, vérifiez les infos' : 'Tester le bot'}
              </button>
              <p className="text-[10px] text-zinc-700 leading-relaxed">
                Créez un bot via <span className="text-zinc-500">@BotFather</span> sur Telegram, récupérez le token et le Chat ID de votre canal/groupe.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-16">
              <button onClick={() => setShowTgConfig(true)} className="text-xs text-zinc-600 hover:text-[#26A5E4] transition-colors">
                Configurer le bot Telegram
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scanner */}
      <div className="rounded-3xl border border-white/[0.06] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <div className="px-8 pt-8 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">Scanner Bitunix Perpetual</h3>
              <p className="text-sm text-zinc-600 mt-1">
                <span className="text-emerald-400 font-semibold font-mono">{continuationCount}</span> crypto{continuationCount > 1 ? 's' : ''} en zone de continuation sur <span className="text-zinc-500 font-mono">{scannerData.length}</span> paires disponibles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={scanSearch}
                  onChange={(e) => setScanSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-300 w-48 focus:outline-none focus:border-white/[0.12] transition-colors placeholder-zinc-700"
                />
              </div>
              <select
                value={scanSort}
                onChange={(e) => setScanSort(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-white/[0.12] transition-colors appearance-none cursor-pointer"
              >
                <option value="continuation">Zone continuation</option>
                <option value="sentiment">Sentiment</option>
                <option value="change">Variation 24h</option>
                <option value="rank">Rang</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-b border-white/[0.04] text-zinc-600 uppercase text-[11px] tracking-wider">
                <th className="text-left py-4 px-8 font-medium">#</th>
                <th className="text-left py-4 px-4 font-medium">Crypto</th>
                <th className="text-right py-4 px-4 font-medium">Prix</th>
                <th className="text-right py-4 px-4 font-medium">24h</th>
                <th className="text-center py-4 px-4 font-medium">Signal</th>
                <th className="text-right py-4 px-4 font-medium">Sentiment</th>
                <th className="text-center py-4 px-8 font-medium">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {filteredScanner.slice(0, 100).map((coin) => {
                const inZone = coin.rsi !== null && coin.rsi >= 60 && coin.rsi <= 64;
                return (
                  <tr key={coin.cgId || coin.id} className={`border-b border-white/[0.03] transition-all duration-200 hover:bg-white/[0.02] ${inZone ? 'bg-emerald-500/[0.03]' : ''}`}>
                    <td className="py-4 px-8 text-zinc-600 font-mono text-sm">{coin.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {coin.image && <img src={coin.image} alt="" className="w-7 h-7 rounded-full" />}
                        <div>
                          <span className="text-sm font-semibold text-zinc-200">{coin.sym}</span>
                          <span className="text-sm text-zinc-600 ml-2 hidden sm:inline">{coin.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-sm text-zinc-300">
                      ${coin.price < 1 ? coin.price?.toFixed(4) : coin.price?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-4 px-4 text-right font-mono font-semibold text-sm ${(coin.c24 || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(coin.c24 || 0) >= 0 ? '+' : ''}{(coin.c24 || 0).toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className="inline-block px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{ color: coin.rsiSignal.color, backgroundColor: coin.rsiSignal.color + '12' }}
                      >
                        {coin.rsiSignal.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-16 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${coin.sentiment}%`,
                              backgroundColor: coin.sentiment > 60 ? '#34d399' : coin.sentiment < 40 ? '#f87171' : '#fbbf24',
                              opacity: 0.7,
                            }}
                          />
                        </div>
                        <span className="font-mono font-bold w-6 text-right text-sm" style={{
                          color: coin.sentiment > 60 ? '#34d399' : coin.sentiment < 40 ? '#f87171' : '#fbbf24',
                        }}>
                          {coin.sentiment}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-8 text-center">
                      <span
                        className="inline-block px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide"
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
          <p className="text-xs text-zinc-700 py-4 text-center border-t border-white/[0.03]">Affichage limité à 100 cryptos</p>
        )}
      </div>

      {/* Historique du signal */}
      <div className="rounded-3xl border border-white/[0.06] p-8" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white tracking-tight">Historique du signal</h3>
          <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
            {['7d', '30d', 'All'].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${range === r ? 'bg-white/[0.08] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}>{r}</button>
            ))}
          </div>
        </div>

        {filtered.length > 1 ? (
          <>
            <div className="relative h-[220px] bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.04]">
              <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-between py-4 text-[10px] font-mono z-10 text-zinc-700">
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
            <div className="flex justify-between mt-3 text-[10px] text-zinc-700 font-mono px-1">
              {getDateLabels().map((lbl, i) => <span key={i}>{lbl}</span>)}
            </div>
          </>
        ) : (
          <div className="h-[220px] bg-white/[0.02] rounded-2xl border border-white/[0.04] flex items-center justify-center">
            <p className="text-zinc-600 text-sm">L'historique se construit au fil des visites (1 point / 2h)</p>
          </div>
        )}
      </div>

      {/* Décomposition du signal */}
      <div className="rounded-3xl border border-white/[0.06] p-8" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <h3 className="text-lg font-semibold text-white tracking-tight mb-6">Décomposition du signal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(indicators || []).map((ind, i) => {
            const colors = ['#60a5fa', '#34d399', '#fbbf24', '#fb923c', '#c084fc', '#22d3ee'];
            const fc = colors[i] || '#60a5fa';
            const zone = ind.current >= 70 ? 'Positif' : ind.current <= 30 ? 'Négatif' : 'Neutre';
            const zoneColor = ind.current >= 70 ? '#34d399' : ind.current <= 30 ? '#f87171' : '#fbbf24';
            return (
              <div key={i} className="card-hover rounded-2xl border border-white/[0.04] p-5 hover:border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fc }} />
                    <span className="text-sm font-medium text-zinc-300">{ind.name || `Facteur ${i + 1}`}</span>
                  </div>
                  <span className="text-lg font-bold font-mono" style={{ color: fc }}>{ind.current}</span>
                </div>
                <div className="relative h-2 bg-white/[0.04] rounded-full overflow-hidden mb-3">
                  <div className="absolute h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${ind.current}%`, backgroundColor: fc, opacity: 0.6 }} />
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-xs font-semibold" style={{ color: zoneColor }}>{zone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legende */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6">
        <div className="rounded-2xl border border-emerald-500/10 p-6" style={{ background: 'rgba(52,211,153,0.03)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Achat fort</span>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">Zone de continuation confirmée par un sentiment positif. Signal haussier fort.</p>
        </div>
        <div className="rounded-2xl border border-yellow-500/10 p-6" style={{ background: 'rgba(251,191,36,0.02)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">Neutre</span>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">Pas de signal clair. Sentiment mitigé. Attendre confirmation.</p>
        </div>
        <div className="rounded-2xl border border-red-500/10 p-6" style={{ background: 'rgba(248,113,113,0.02)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-sm font-semibold text-red-400">Prudence</span>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">Surachat ou conditions défavorables. Renforcer la gestion du risque.</p>
        </div>
      </div>
    </div>
  );
}
