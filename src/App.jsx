import { useState, useEffect, useMemo, useCallback } from 'react';
import { CONFIG } from './utils/config';
import { loadCache } from './utils/cache';
import { loadAllData } from './utils/api';
import { computeSentiment, computeOpportunityIndex } from './utils/sentiment';
import { runBacktestOptimization } from './utils/backtest';

import Header from './components/Header';
import FearGreedIndex from './components/FearGreedIndex';
import OpportunityIndex from './components/OpportunityIndex';
import CryptoCard from './components/CryptoCard';
import Filters from './components/Filters';
import Disclaimer from './components/Disclaimer';
import Loader from './components/Loader';
import ErrorBanner from './components/ErrorBanner';

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('fr-FR'));
  const [cryptos, setCryptos] = useState([]);
  const [fgHist, setFgHist] = useState([]);
  const [btcHist, setBtcHist] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rank');
  const [showDet, setShowDet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [prevOppScore, setPrevOppScore] = useState(null);
  const [optResult, setOptResult] = useState(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const fgVal = fgHist.length > 0 ? fgHist[fgHist.length - 1].value : 0;
  const btcCoin = cryptos.find((c) => c.sym === 'BTC');
  const btcPrice = btcCoin?.price || 0;
  const btcAth = btcCoin?.ath || 0;
  const optWeights = optResult?.weights || null;
  const oppData =
    cryptos.length > 0
      ? computeOpportunityIndex(fgVal, cryptos, btcPrice, btcAth, optWeights)
      : { score: 0, indicators: [] };

  const stats = useMemo(
    () => ({
      bull: cryptos.filter((c) => computeSentiment(c) > 60).length,
      neut: cryptos.filter((c) => { const s = computeSentiment(c); return s >= 40 && s <= 60; }).length,
      bear: cryptos.filter((c) => computeSentiment(c) < 40).length,
    }),
    [cryptos]
  );

  useEffect(() => {
    const cachedFg = loadCache('fg');
    const cachedBtc = loadCache('btc');
    const cachedCryptos = loadCache('cryptos');
    if (cachedFg) setFgHist(cachedFg);
    if (cachedBtc) setBtcHist(cachedBtc);
    if (cachedCryptos) setCryptos(cachedCryptos);
    if (cachedFg || cachedCryptos) {
      setLoading(false);
      setLastUpdate('cache');
    }
  }, []);

  const fetchAll = useCallback(async (isFirstLoad = false) => {
    const newErrors = [];
    const { fgData, cryptoData, btcData } = await loadAllData(isFirstLoad, setCryptos);

    if (fgData) setFgHist(fgData);
    else if (!loadCache('fg')) newErrors.push('Fear & Greed Index indisponible');

    if (cryptoData) setCryptos(cryptoData);
    else if (!loadCache('cryptos')) newErrors.push('Données marché indisponibles');

    if (btcData) setBtcHist(btcData);
    else if (!loadCache('btc')) newErrors.push('Historique BTC indisponible');

    setErrors(newErrors);
    setLoading(false);
    setLastUpdate(new Date().toLocaleTimeString('fr-FR'));

    const finalFg = fgData || loadCache('fg');
    const finalBtc = btcData || loadCache('btc');
    if (finalFg && finalBtc) {
      const opt = runBacktestOptimization(finalFg, finalBtc);
      setOptResult(opt);
    }

    const finalCryptos = cryptoData || loadCache('cryptos');
    if (finalCryptos && finalFg) {
      const currentFg = finalFg[finalFg.length - 1]?.value || 0;
      const btc = finalCryptos.find((c) => c.sym === 'BTC');
      const opp = computeOpportunityIndex(currentFg, finalCryptos, btc?.price || 0, btc?.ath || 0, null);
      setPrevOppScore((prev) => (prev === null ? opp.score : prev));
    }
  }, []);

  useEffect(() => {
    fetchAll(true);
    const interval = setInterval(() => fetchAll(false), CONFIG.REFRESH_RATE);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    const clockInt = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000);
    return () => clearInterval(clockInt);
  }, []);

  const filtered = useMemo(() => {
    return cryptos
      .filter((c) => {
        if (search && !c.sym.toLowerCase().includes(search.toLowerCase()) && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        const sent = computeSentiment(c);
        if (filter === 'BULLISH') return sent > 60;
        if (filter === 'NEUTRAL') return sent >= 40 && sent <= 60;
        if (filter === 'BEARISH') return sent < 40;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'sentiment') return computeSentiment(b) - computeSentiment(a);
        if (sort === 'change24h') return (b.c24 || 0) - (a.c24 || 0);
        if (sort === 'volume') return (b.volume24h || 0) - (a.volume24h || 0);
        return a.id - b.id;
      });
  }, [cryptos, search, filter, sort]);

  const isLive = !loading && errors.length === 0 && lastUpdate !== 'cache';

  return (
    <div className="min-h-screen bg-dark-900 text-white noise-bg bg-grid">
      {!disclaimerAccepted && <Disclaimer onAccept={() => setDisclaimerAccepted(true)} />}
      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <Header isLive={isLive} time={time} stats={stats} lastUpdate={lastUpdate} />

        {errors.length > 0 && errors.map((err, i) => <ErrorBanner key={i} message={err} onRetry={() => fetchAll(false)} />)}

        {loading ? (
          <Loader text="Connexion aux APIs (Alternative.me + CoinCap)..." />
        ) : (
          <>
            <div className="mb-6">
              <FearGreedIndex value={fgVal} history={fgHist} btcHistory={btcHist} />
            </div>
            <div className="mb-6">
              <OpportunityIndex score={oppData.score} prevScore={prevOppScore} indicators={oppData.indicators} showDetails={showDet} setShowDetails={setShowDet} optResult={optResult} />
            </div>
            <Filters filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="text-gray-500 font-medium">
                <strong className="text-white font-bold font-mono">{filtered.length}</strong> cryptos sur {cryptos.length}
              </span>
              <span className="text-gray-600 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Cliquez pour les détails • Actualisation toutes les 60s
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filtered.map((c, i) => <CryptoCard key={c.cgId || c.id} crypto={c} rank={c.id} index={i} />)}
            </div>
          </>
        )}

        <footer className="mt-10 pt-6 border-t border-white/5 text-center space-y-2">
          <p className="text-xs text-gray-600 font-medium">CRYPTO SENTINEL PRO <span className="text-gray-700">•</span> Données réelles via Alternative.me & CoinCap</p>
          <p className="text-[10px] text-gray-700">⚠️ Ce site ne constitue pas un conseil en investissement. Les cryptomonnaies sont des actifs à haut risque.</p>
        </footer>
      </div>
    </div>
  );
}
