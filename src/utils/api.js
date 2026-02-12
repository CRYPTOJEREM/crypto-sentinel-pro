import { CONFIG } from './config';
import { saveCache } from './cache';

const fetchWithRetry = async (fetchFn, retries = 2, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await fetchFn();
    if (result !== null) return result;
    if (attempt < retries) {
      console.warn(`Tentative ${attempt}/${retries} échouée, retry dans ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay * attempt));
    }
  }
  return null;
};

export const fetchFearGreedData = async () => {
  try {
    const res = await fetch(`${CONFIG.FNG_API}?limit=731&format=json&date_format=world`);
    if (!res.ok) throw new Error(`FNG API error: ${res.status}`);
    const json = await res.json();
    const data = json.data.reverse().map((d) => ({
      ts: parseInt(d.timestamp),
      value: parseInt(d.value),
      classification: d.value_classification,
      date: new Date(parseInt(d.timestamp) * 1000).toISOString().split('T')[0],
    }));
    saveCache('fg', data);
    return data;
  } catch (err) {
    console.error('Fear & Greed fetch error:', err);
    return null;
  }
};

export const fetchBtcHistory = async () => {
  try {
    const end = Date.now();
    const start = end - 730 * 24 * 60 * 60 * 1000;
    const res = await fetch(`${CONFIG.COINCAP_API}/assets/bitcoin/history?interval=d1&start=${start}&end=${end}`);
    if (!res.ok) throw new Error(`CoinCap BTC history error: ${res.status}`);
    const json = await res.json();
    const data = json.data.map((d) => ({
      ts: Math.floor(d.time / 1000),
      price: parseFloat(d.priceUsd),
    }));
    saveCache('btc', data);
    return data;
  } catch (err) {
    console.error('BTC history fetch error:', err);
    return null;
  }
};

export const fetchCryptos = async () => {
  try {
    const res = await fetch(`${CONFIG.COINCAP_API}/assets?limit=100`);
    if (!res.ok) throw new Error(`CoinCap assets error: ${res.status}`);
    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) throw new Error('Invalid response format');
    const data = json.data.map((coin, i) => ({
      id: i + 1,
      cgId: coin.id,
      sym: coin.symbol,
      name: coin.name,
      image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
      price: parseFloat(coin.priceUsd) || 0,
      marketCap: parseFloat(coin.marketCapUsd) || 0,
      volume24h: parseFloat(coin.volumeUsd24Hr) || 0,
      c24: parseFloat(coin.changePercent24Hr) || 0,
      c7: 0,
      c30: 0,
      c1h: 0,
      ath: 0,
      athChange: 0,
      sparkline: [],
      vwap24Hr: parseFloat(coin.vwap24Hr) || 0,
      supply: parseFloat(coin.supply) || 0,
      maxSupply: parseFloat(coin.maxSupply) || 0,
    }));
    saveCache('cryptos', data);
    return data;
  } catch (err) {
    console.error('Crypto fetch error:', err);
    return null;
  }
};

export const enrichCryptosWithHistory = async (cryptos) => {
  if (!cryptos || cryptos.length === 0) return cryptos;
  const end = Date.now();
  const start30d = end - 30 * 24 * 60 * 60 * 1000;
  const topIds = cryptos.slice(0, 20).map((c) => c.cgId);
  const enriched = [...cryptos];

  for (let idx = 0; idx < topIds.length; idx++) {
    try {
      const res = await fetch(`${CONFIG.COINCAP_API}/assets/${topIds[idx]}/history?interval=d1&start=${start30d}&end=${end}`);
      if (!res.ok) continue;
      const json = await res.json();
      if (!json.data || json.data.length < 2) continue;

      const prices = json.data.map((d) => parseFloat(d.priceUsd));
      const currentPrice = prices[prices.length - 1];
      const price7dAgo = prices.length >= 7 ? prices[prices.length - 7] : prices[0];
      const price30dAgo = prices[0];

      enriched[idx].c7 = ((currentPrice - price7dAgo) / price7dAgo) * 100;
      enriched[idx].c30 = ((currentPrice - price30dAgo) / price30dAgo) * 100;
      enriched[idx].sparkline = prices.slice(-7);

      const maxPrice = Math.max(...prices);
      enriched[idx].ath = maxPrice;
      enriched[idx].athChange = ((currentPrice - maxPrice) / maxPrice) * 100;
    } catch (e) {
      /* skip */
    }
  }

  saveCache('cryptos', enriched);
  return enriched;
};

export const loadAllData = async (isFirstLoad, setCryptos) => {
  const [fgData, cryptoData, btcData] = await Promise.all([
    fetchWithRetry(fetchFearGreedData),
    fetchWithRetry(fetchCryptos),
    fetchWithRetry(fetchBtcHistory),
  ]);

  if (cryptoData && isFirstLoad && setCryptos) {
    enrichCryptosWithHistory(cryptoData).then((enriched) => {
      if (enriched) setCryptos(enriched);
    });
  }

  return { fgData, cryptoData, btcData };
};
