export const runBacktestOptimization = (fgHistory, btcHistory) => {
  if (!fgHistory || fgHistory.length < 90 || !btcHistory || btcHistory.length < 90) {
    return { weights: [14, 16, 14, 10, 16, 10, 10, 10], accuracy: 0, tested: 0 };
  }

  const btcMap = {};
  btcHistory.forEach((b) => { btcMap[Math.floor(b.ts / 86400)] = b.price; });

  const aligned = fgHistory
    .map((fg) => {
      const dayKey = Math.floor(fg.ts / 86400);
      return { fg: fg.value, price: btcMap[dayKey] || btcMap[dayKey - 1] || btcMap[dayKey + 1] || 0 };
    })
    .filter((d) => d.price > 0);

  if (aligned.length < 60) return { weights: [14, 16, 14, 10, 16, 10, 10, 10], accuracy: 0, tested: 0 };

  // Smooth interpolation (matches sentiment.js)
  const smooth = (value, minIn, maxIn, minOut = 0, maxOut = 100) => {
    if (value <= minIn) return minOut;
    if (value >= maxIn) return maxOut;
    return minOut + ((value - minIn) / (maxIn - minIn)) * (maxOut - minOut);
  };

  // Build signal array with all 8 factors (simulated from BTC+FG data)
  const signals = [];
  for (let i = 30; i < aligned.length - 21; i++) {
    const fg = aligned[i].fg;
    const price = aligned[i].price;
    const price30ago = aligned[i - 30].price;
    const price7ago = aligned[i - 7].price;

    // S1: Fear/Greed Contrarian (smooth)
    const s1 = Math.round(smooth(fg, 0, 100, 100, 0));

    // S2: BTC momentum 30j
    const mom30 = ((price - price30ago) / price30ago) * 100;
    const s2 = Math.max(0, Math.min(100, 50 + mom30 * 2.5));

    // S3: Market breadth proxy (momentum direction)
    const mom7 = ((price - price7ago) / price7ago) * 100;
    const s3 = Math.max(0, Math.min(100, 50 + mom7 * 5));

    // S4: Volatility (smooth)
    const window = aligned.slice(i - 7, i).map((d) => d.price);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / window.length;
    const volatility = (Math.sqrt(variance) / mean) * 100;
    const s4 = Math.round(
      volatility < 3
        ? smooth(volatility, 0, 3, 30, 85)
        : smooth(volatility, 3, 10, 85, 15)
    );

    // S5: Combined momentum (7j 60% + 30j 40%)
    const combined = mom7 * 0.6 + mom30 * 0.4;
    const s5 = Math.max(0, Math.min(100, Math.round(50 + combined * 3.3)));

    // S6: RSI proxy (momentum-based)
    const prices14 = aligned.slice(Math.max(0, i - 14), i + 1).map((d) => d.price);
    let gains = 0, losses = 0, cnt = 0;
    for (let j = 1; j < prices14.length; j++) {
      const diff = prices14[j] - prices14[j - 1];
      if (diff > 0) gains += diff; else losses += Math.abs(diff);
      cnt++;
    }
    const avgG = gains / (cnt || 1), avgL = losses / (cnt || 1);
    const rsi = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
    const s6 = rsi >= 55 && rsi <= 70 ? 75 : rsi < 30 ? 80 : rsi > 70 ? 25 : 50;

    // S7: Volume proxy (volatility-based activity)
    const s7 = Math.max(0, Math.min(100, 50 + volatility * 5));

    // S8: Dominance proxy (inverse of altcoin momentum vs BTC)
    const avg30 = aligned.slice(i - 30, i).reduce((s, d) => s + d.price, 0) / 30;
    const deviation = ((price - avg30) / avg30) * 100;
    const s8 = Math.round(smooth(Math.abs(deviation), 0, 15, 60, 30));

    // Test multiple horizons (7j, 14j, 21j) and average
    const future7 = aligned[i + 7]?.price || price;
    const future14 = aligned[i + 14]?.price || price;
    const future21 = aligned[i + 21]?.price || price;
    const ret7 = ((future7 - price) / price) * 100;
    const ret14 = ((future14 - price) / price) * 100;
    const ret21 = ((future21 - price) / price) * 100;
    const futureReturn = ret7 * 0.3 + ret14 * 0.4 + ret21 * 0.3;

    signals.push({ s1, s2, s3, s4, s5, s6, s7, s8, futureReturn });
  }

  if (signals.length < 30) return { weights: [14, 16, 14, 10, 16, 10, 10, 10], accuracy: 0, tested: 0 };

  // Walk-forward: optimize on 70%, validate on 30%
  const trainSize = Math.floor(signals.length * 0.7);
  const trainSignals = signals.slice(0, trainSize);
  const validSignals = signals.slice(trainSize);

  const defaultWeights = [14, 16, 14, 10, 16, 10, 10, 10];
  let bestWeights = [...defaultWeights];
  let bestCorrelation = -Infinity;
  let tested = 0;
  const step = 3;

  // Optimize on training set
  const computeCorrelation = (sigs, w1, w2, w3, w4, w5, w6, w7, w8) => {
    let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0;
    const n = sigs.length;
    for (const sig of sigs) {
      const composite = (sig.s1 * w1 + sig.s2 * w2 + sig.s3 * w3 + sig.s4 * w4 +
        sig.s5 * w5 + sig.s6 * w6 + sig.s7 * w7 + sig.s8 * w8) / 100;
      const ret = sig.futureReturn;
      sumXY += composite * ret;
      sumX += composite;
      sumY += ret;
      sumX2 += composite * composite;
      sumY2 += ret * ret;
    }
    const denom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    return denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  };

  // Grid search with 8 weights (constrained to reduce search space)
  // Fix some weights near defaults, vary key ones
  for (let w1 = 8; w1 <= 24; w1 += step) {
    for (let w2 = 10; w2 <= 26; w2 += step) {
      for (let w3 = 8; w3 <= 22; w3 += step) {
        for (let w5 = 10; w5 <= 24; w5 += step) {
          const remaining = 100 - w1 - w2 - w3 - w5;
          if (remaining < 16 || remaining > 52) continue;

          // Distribute remaining among w4, w6, w7, w8
          const w4 = Math.round(remaining * 0.25);
          const w6 = Math.round(remaining * 0.25);
          const w7 = Math.round(remaining * 0.25);
          const w8 = remaining - w4 - w6 - w7;

          if (w4 < 4 || w6 < 4 || w7 < 4 || w8 < 4) continue;
          tested++;

          const trainCorr = computeCorrelation(trainSignals, w1, w2, w3, w4, w5, w6, w7, w8);

          // Shrinkage: penalize distance from defaults to avoid overfitting
          const dist = Math.sqrt(
            [w1, w2, w3, w4, w5, w6, w7, w8].reduce((s, w, i) => s + Math.pow(w - defaultWeights[i], 2), 0)
          );
          const shrinkagePenalty = dist * 0.003;
          const adjustedCorr = trainCorr - shrinkagePenalty;

          if (adjustedCorr > bestCorrelation) {
            bestCorrelation = adjustedCorr;
            bestWeights = [w1, w2, w3, w4, w5, w6, w7, w8];
          }
        }
      }
    }
  }

  // Validate on out-of-sample data
  const validCorrelation = validSignals.length > 10
    ? computeCorrelation(validSignals, ...bestWeights)
    : bestCorrelation;

  // If validation is much worse, fall back to defaults (overfitting detected)
  if (validCorrelation < bestCorrelation * 0.3 && validCorrelation < 0.1) {
    bestWeights = [...defaultWeights];
    bestCorrelation = computeCorrelation(signals, ...defaultWeights);
  }

  const finalCorrelation = (bestCorrelation + validCorrelation) / 2;
  const accuracy = Math.round(Math.max(0, Math.min(100, (finalCorrelation + 1) * 50)));
  return { weights: bestWeights, accuracy, tested, correlation: Math.round(finalCorrelation * 100) / 100 };
};
