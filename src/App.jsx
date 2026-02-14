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
import UpdatesPage from './components/UpdatesPage';
import GuidePage from './components/GuidePage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {!disclaimerAccepted && <Disclaimer onAccept={() => setDisclaimerAccepted(true)} />}

      <div className="w-full max-w-[1400px] mx-auto px-4 py-6 md:px-8 lg:px-12">
        <Header isLive={isLive} time={time} stats={stats} lastUpdate={lastUpdate} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'dashboard' && (
          <>
            {errors.length > 0 && errors.map((err, i) => <ErrorBanner key={i} message={err} onRetry={() => fetchAll(false)} />)}

            {loading ? (
              <Loader text="Connexion aux APIs..." />
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  <FearGreedIndex value={fgVal} history={fgHist} btcHistory={btcHist} />
                  <OpportunityIndex score={oppData.score} prevScore={prevOppScore} indicators={oppData.indicators} showDetails={showDet} setShowDetails={setShowDet} optResult={optResult} />
                </div>

                <Filters filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />

                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-zinc-500">
                    <span className="text-zinc-200 font-semibold font-mono">{filtered.length}</span> cryptos sur {cryptos.length}
                  </span>
                  <span className="text-zinc-600 text-xs">Actualisation toutes les 120s</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                  {filtered.map((c, i) => <CryptoCard key={c.cgId || c.id} crypto={c} rank={c.id} index={i} />)}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'updates' && <UpdatesPage />}
        {activeTab === 'guide' && <GuidePage />}

        <footer className="mt-12 pt-6 border-t border-[#3f3f46] text-center space-y-1">
          <p className="text-xs text-zinc-600">Crypto Sentinel Pro v2.1 &mdash; Donn&eacute;es via Alternative.me &amp; CoinCap</p>
          <p className="text-[10px] text-zinc-700">Ce site ne constitue pas un conseil en investissement.</p>
        </footer>
      </div>
    </div>
  );
}
