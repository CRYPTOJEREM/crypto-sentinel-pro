export const computeSentiment = (coin) => {
  const c24Contrib = Math.max(0, Math.min(100, 50 + (coin.c24 || 0) * 5));
  const has7d = coin.c7 !== 0;
  const c7Contrib = has7d ? Math.max(0, Math.min(100, 50 + coin.c7 * 3)) : c24Contrib;
  const has30d = coin.c30 !== 0;
  const c30Contrib = has30d ? Math.max(0, Math.min(100, 50 + coin.c30 * 1.5)) : c24Contrib;
  const vwapSignal =
    coin.vwap24Hr > 0 && coin.price > 0
      ? Math.max(0, Math.min(100, 50 + ((coin.price - coin.vwap24Hr) / coin.vwap24Hr) * 200))
      : coin.c24 >= 0
        ? 60
        : 40;
  const rankSignal = coin.id <= 10 ? 55 : coin.id <= 30 ? 50 : 45;

  const w24 = 0.35;
  const w7 = has7d ? 0.25 : 0.1;
  const w30 = has30d ? 0.15 : 0.05;
  const wVwap = 0.15;
  const wRank = 1 - w24 - w7 - w30 - wVwap;

  const score = Math.round(
    c24Contrib * w24 + c7Contrib * w7 + c30Contrib * w30 + vwapSignal * wVwap + rankSignal * wRank
  );
  return Math.max(0, Math.min(100, score));
};

export const computeFlow = (coin) => {
  if (coin.sparkline && coin.sparkline.length >= 4) {
    const recent = coin.sparkline.slice(-3);
    const older = coin.sparkline.slice(0, 3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    if (olderAvg === 0) return 0;
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 1000) / 10;
  }
  return Math.round((coin.c24 || 0) * 10) / 10;
};

// Smooth linear interpolation (replaces step functions)
const smooth = (value, minIn, maxIn, minOut = 0, maxOut = 100) => {
  if (value <= minIn) return minOut;
  if (value >= maxIn) return maxOut;
  return minOut + ((value - minIn) / (maxIn - minIn)) * (maxOut - minOut);
};

// RSI-14 calculation (more stable than RSI-6)
export const computeRSI = (prices, period = 14) => {
  if (!prices || prices.length < period + 1) return null;
  let gainSum = 0;
  let lossSum = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gainSum += diff;
    else lossSum += Math.abs(diff);
  }
  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  // Use Wilder's smoothing for remaining data
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? Math.abs(diff) : 0)) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round((100 - 100 / (1 + rs)) * 10) / 10;
};

// RSI-14 Market Signal with enlarged zones
export const computeRSI14Signal = (cryptos) => {
  if (!cryptos || cryptos.length === 0) return 50;
  let totalWithRSI = 0;
  let continuationCount = 0;
  let oversoldCount = 0;
  let totalMcap = 0;
  let weightedContinuation = 0;
  let weightedOversold = 0;

  cryptos.forEach((coin) => {
    if (!coin.sparkline || coin.sparkline.length < 15) return;
    const rsi = computeRSI(coin.sparkline, 14);
    if (rsi === null) return;
    totalWithRSI++;
    const mcap = coin.marketCap || 1;
    totalMcap += mcap;

    // Zone continuation haussiere: RSI 55-70
    if (rsi >= 55 && rsi <= 70) {
      continuationCount++;
      weightedContinuation += mcap;
    }
    // Zone survendu (signal contrarian fort): RSI < 30
    if (rsi < 30) {
      oversoldCount++;
      weightedOversold += mcap;
    }
  });

  if (totalWithRSI === 0 || totalMcap === 0) return 50;

  const continuationRatio = weightedContinuation / totalMcap;
  const oversoldRatio = weightedOversold / totalMcap;

  // Continuation = marché en tendance saine (score monte)
  // Survendu = signal contrarian fort (bonus)
  const baseScore = continuationRatio * 80 + oversoldRatio * 120;
  return Math.max(0, Math.min(100, Math.round(baseScore * 100)));
};

// Market Breadth pondéré par market cap
const computeWeightedBreadth = (cryptos) => {
  if (!cryptos || cryptos.length === 0) return 50;
  let totalMcap = 0;
  let bullMcap = 0;

  cryptos.forEach((c) => {
    const mcap = c.marketCap || 1;
    totalMcap += mcap;
    if ((c.c7 || c.c24 || 0) > 0) {
      bullMcap += mcap;
    }
  });

  if (totalMcap === 0) return 50;
  return Math.round((bullMcap / totalMcap) * 100);
};

// Volume Surge detection (volume/marketcap ratio normalisé)
const computeVolumeSurge = (cryptos) => {
  if (!cryptos || cryptos.length === 0) return 50;

  const ratios = cryptos
    .filter((c) => c.marketCap > 0 && c.volume24h > 0)
    .map((c) => ({
      ratio: c.volume24h / c.marketCap,
      mcap: c.marketCap,
      bullish: (c.c24 || 0) > 0,
    }));

  if (ratios.length === 0) return 50;

  // Median volume/mcap ratio
  const sorted = ratios.map((r) => r.ratio).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  // Count coins with above-median volume weighted by direction
  let totalMcap = 0;
  let bullishSurgeMcap = 0;

  ratios.forEach((r) => {
    totalMcap += r.mcap;
    if (r.ratio > median * 1.5 && r.bullish) {
      bullishSurgeMcap += r.mcap;
    }
  });

  if (totalMcap === 0) return 50;

  // High volume on green candles = bullish signal
  const surgeRatio = bullishSurgeMcap / totalMcap;
  return Math.max(0, Math.min(100, Math.round(50 + surgeRatio * 200)));
};

// Combined Momentum (7j 60% + 30j 40%)
const computeCombinedMomentum = (cryptos) => {
  if (!cryptos || cryptos.length === 0) return 50;

  let totalMcap = 0;
  let weighted7d = 0;
  let weighted30d = 0;

  cryptos.forEach((c) => {
    const mcap = c.marketCap || 1;
    totalMcap += mcap;
    weighted7d += (c.c7 || c.c24 || 0) * mcap;
    weighted30d += (c.c30 || c.c24 || 0) * mcap;
  });

  if (totalMcap === 0) return 50;

  const avg7d = weighted7d / totalMcap;
  const avg30d = weighted30d / totalMcap;

  // Combine: 60% short-term (7j) + 40% long-term (30j)
  const combined = avg7d * 0.6 + avg30d * 0.4;

  // Map to 0-100 score: -15% = 0, +15% = 100
  return Math.max(0, Math.min(100, Math.round(50 + combined * 3.3)));
};

// BTC Dominance signal
const computeBtcDominanceSignal = (btcDominance) => {
  if (!btcDominance || btcDominance <= 0) return 50;
  // Dominance haute (>60%) = risk-off = plutot bearish pour alts
  // Dominance basse (<40%) = alt season = signal favorable
  // Inversion: dominance basse = score haut
  return Math.round(smooth(btcDominance, 35, 65, 100, 0));
};

export const computeOpportunityIndex = (fgValue, cryptos, btcPrice, btcAth, optWeights, globalData) => {
  const w = optWeights || [14, 16, 14, 10, 16, 10, 10, 10];

  // 1. Fear/Greed Contrarian (sigmoid smooth)
  const fgScore = Math.round(smooth(fgValue, 0, 100, 100, 0));

  // 2. BTC vs ATH
  const mcScore = btcAth > 0 ? Math.round(Math.min(100, (btcPrice / btcAth) * 100)) : 50;

  // 3. Market Breadth (pondéré par market cap)
  const breadthScore = computeWeightedBreadth(cryptos);

  // 4. Volatilité (sigmoid smooth)
  const avgVol = cryptos.reduce((sum, c) => sum + Math.abs(c.c24 || 0), 0) / Math.max(1, cryptos.length);
  const volScore = Math.round(
    avgVol < 3
      ? smooth(avgVol, 0, 3, 30, 85)   // Low to moderate vol = increasingly good
      : smooth(avgVol, 3, 10, 85, 15)   // High vol = decreasingly good
  );

  // 5. Momentum combiné (7j + 30j)
  const momScore = computeCombinedMomentum(cryptos);

  // 6. RSI-14 Market
  const rsiScore = computeRSI14Signal(cryptos);

  // 7. Volume Surge
  const volumeScore = computeVolumeSurge(cryptos);

  // 8. BTC Dominance
  const btcDom = globalData?.btcDominance || 0;
  const domScore = computeBtcDominanceSignal(btcDom);

  const indicators = [
    { name: 'Sentiment', current: fgScore, weight: w[0] },
    { name: 'Tendance', current: mcScore, weight: w[1] },
    { name: 'Marché', current: breadthScore, weight: w[2] },
    { name: 'Stabilité', current: volScore, weight: w[3] },
    { name: 'Dynamique', current: momScore, weight: w[4] },
    { name: 'Technique', current: rsiScore, weight: w[5] },
    { name: 'Activité', current: volumeScore, weight: w[6] },
    { name: 'Flux', current: domScore, weight: w[7] },
  ];

  const totalScore = Math.round(indicators.reduce((sum, ind) => sum + ind.current * (ind.weight / 100), 0));
  return { score: Math.max(0, Math.min(100, totalScore)), indicators };
};
