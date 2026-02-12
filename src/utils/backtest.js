export const runBacktestOptimization = (fgHistory, btcHistory) => {
  if (!fgHistory || fgHistory.length < 90 || !btcHistory || btcHistory.length < 90) {
    return { weights: [18, 24, 20, 16, 22], accuracy: 0, tested: 0 };
  }

  const btcMap = {};
  btcHistory.forEach((b) => { btcMap[Math.floor(b.ts / 86400)] = b.price; });

  const aligned = fgHistory
    .map((fg) => {
      const dayKey = Math.floor(fg.ts / 86400);
      return { fg: fg.value, price: btcMap[dayKey] || btcMap[dayKey - 1] || btcMap[dayKey + 1] || 0 };
    })
    .filter((d) => d.price > 0);

  if (aligned.length < 60) return { weights: [18, 24, 20, 16, 22], accuracy: 0, tested: 0 };

  const signals = [];
  for (let i = 30; i < aligned.length - 14; i++) {
    const fg = aligned[i].fg;
    const price = aligned[i].price;
    const price30ago = aligned[i - 30].price;
    const price7ago = aligned[i - 7].price;

    const s1 = fg <= 25 ? 85 : fg <= 40 ? 70 : fg <= 55 ? 50 : fg <= 75 ? 35 : 15;
    const mom30 = ((price - price30ago) / price30ago) * 100;
    const s2 = Math.max(0, Math.min(100, 50 + mom30 * 2.5));
    const mom7 = ((price - price7ago) / price7ago) * 100;
    const s3 = Math.max(0, Math.min(100, 50 + mom7 * 5));

    const window = aligned.slice(i - 7, i).map((d) => d.price);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / window.length;
    const volatility = (Math.sqrt(variance) / mean) * 100;
    const s4 = volatility < 1.5 ? 40 : volatility < 3 ? 80 : volatility < 6 ? 60 : 20;

    const avg30 = aligned.slice(i - 30, i).reduce((s, d) => s + d.price, 0) / 30;
    const deviation = ((price - avg30) / avg30) * 100;
    const s5 = deviation < -10 ? 85 : deviation < -3 ? 65 : deviation < 3 ? 50 : deviation < 10 ? 35 : 15;

    const futurePrice = aligned[i + 14].price;
    const futureReturn = ((futurePrice - price) / price) * 100;
    signals.push({ s1, s2, s3, s4, s5, futureReturn });
  }

  if (signals.length < 30) return { weights: [18, 24, 20, 16, 22], accuracy: 0, tested: 0 };

  let bestWeights = [20, 20, 20, 20, 20];
  let bestCorrelation = -Infinity;
  let tested = 0;
  const step = 4;

  for (let w1 = 8; w1 <= 36; w1 += step) {
    for (let w2 = 8; w2 <= 36; w2 += step) {
      for (let w3 = 8; w3 <= 36; w3 += step) {
        for (let w4 = 8; w4 <= 36; w4 += step) {
          const w5 = 100 - w1 - w2 - w3 - w4;
          if (w5 < 4 || w5 > 40) continue;
          tested++;

          let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0;
          const n = signals.length;
          for (const sig of signals) {
            const composite = (sig.s1 * w1 + sig.s2 * w2 + sig.s3 * w3 + sig.s4 * w4 + sig.s5 * w5) / 100;
            const ret = sig.futureReturn;
            sumXY += composite * ret;
            sumX += composite;
            sumY += ret;
            sumX2 += composite * composite;
            sumY2 += ret * ret;
          }

          const correlation =
            (n * sumXY - sumX * sumY) /
            (Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)) || 1);

          if (correlation > bestCorrelation) {
            bestCorrelation = correlation;
            bestWeights = [w1, w2, w3, w4, w5];
          }
        }
      }
    }
  }

  const accuracy = Math.round(Math.max(0, Math.min(100, (bestCorrelation + 1) * 50)));
  return { weights: bestWeights, accuracy, tested, correlation: Math.round(bestCorrelation * 100) / 100 };
};
