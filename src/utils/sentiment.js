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

export const computeRSI = (prices, period = 6) => {
  if (!prices || prices.length < period + 1) return null;
  let gainSum = 0;
  let lossSum = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gainSum += diff;
    else lossSum += Math.abs(diff);
  }
  const avgGain = gainSum / period;
  const avgLoss = lossSum / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round((100 - 100 / (1 + rs)) * 10) / 10;
};

export const computeRSI6Signal = (cryptos) => {
  if (!cryptos || cryptos.length === 0) return 50;
  let totalWithRSI = 0;
  let continuationCount = 0;
  let weightedBonus = 0;

  cryptos.forEach((coin) => {
    if (!coin.sparkline || coin.sparkline.length < 7) return;
    const rsi = computeRSI(coin.sparkline, 6);
    if (rsi === null) return;
    totalWithRSI++;
    if (rsi >= 60 && rsi <= 64) {
      continuationCount++;
      if (coin.id <= 10) weightedBonus += 3;
      else if (coin.id <= 30) weightedBonus += 1.5;
      else weightedBonus += 0.5;
    }
  });

  if (totalWithRSI === 0) return 50;
  const ratio = continuationCount / totalWithRSI;
  const baseScore = Math.min(100, ratio * 500 + weightedBonus * 3);
  return Math.max(0, Math.min(100, Math.round(baseScore)));
};

export const computeOpportunityIndex = (fgValue, cryptos, btcPrice, btcAth, optWeights) => {
  const w = optWeights || [16, 22, 18, 14, 18, 12];
  const fgScore = fgValue <= 25 ? 85 : fgValue <= 40 ? 70 : fgValue <= 55 ? 50 : fgValue <= 75 ? 35 : 15;
  const mcScore = btcAth > 0 ? Math.round(Math.min(100, (btcPrice / btcAth) * 100)) : 50;
  const bullCount = cryptos.filter((c) => (c.c7 || c.c24 || 0) > 0).length;
  const breadthScore = Math.round((bullCount / Math.max(1, cryptos.length)) * 100);
  const avgVol = cryptos.reduce((sum, c) => sum + Math.abs(c.c24 || 0), 0) / Math.max(1, cryptos.length);
  const volScore = avgVol < 1.5 ? 40 : avgVol < 3 ? 80 : avgVol < 6 ? 60 : 20;
  const avg30d = cryptos.reduce((sum, c) => sum + (c.c30 || c.c24 || 0), 0) / Math.max(1, cryptos.length);
  const momScore = Math.max(0, Math.min(100, 50 + avg30d * 2));
  const rsi6Score = computeRSI6Signal(cryptos);

  const indicators = [
    { name: 'Fear/Greed Contrarian', current: fgScore, weight: w[0] },
    { name: 'BTC vs ATH', current: mcScore, weight: w[1] },
    { name: 'Market Breadth', current: breadthScore, weight: w[2] },
    { name: 'Volatilité', current: volScore, weight: w[3] },
    { name: 'Momentum 30j', current: Math.round(momScore), weight: w[4] },
    { name: 'RSI(6) Continuation', current: rsi6Score, weight: w[5] || 12 },
  ];

  const totalScore = Math.round(indicators.reduce((sum, ind) => sum + ind.current * (ind.weight / 100), 0));
  return { score: Math.max(0, Math.min(100, totalScore)), indicators };
};
