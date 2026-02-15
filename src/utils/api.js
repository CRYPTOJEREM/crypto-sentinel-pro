import { CONFIG } from './config';
import { saveCache } from './cache';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (fetchFn, retries = 2, delay = 4000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await fetchFn();
    if (result !== null) return result;
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, delay * attempt));
    }
  }
  return null;
};

// Fear & Greed — Alternative.me (fiable, pas de limite)
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

// BTC History — CoinGecko
export const fetchBtcHistory = async () => {
  try {
    const res = await fetch(`${CONFIG.COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=730&interval=daily`);
    if (!res.ok) throw new Error(`BTC history error: ${res.status}`);
    const json = await res.json();
    const data = json.prices.map(([ts, price]) => ({ ts: Math.floor(ts / 1000), price }));
    saveCache('btc', data);
    return data;
  } catch (err) {
    console.error('BTC history fetch error:', err);
    return null;
  }
};

// Top cryptos — CoinGecko (250 max, filtré par market cap > 50M$)
export const fetchCryptos = async () => {
  try {
    const url = `${CONFIG.COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${CONFIG.CRYPTO_COUNT}&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Markets error: ${res.status}`);
    const coins = await res.json();
    if (!Array.isArray(coins)) throw new Error('Invalid format');
    const data = coins
      .filter((coin) => (coin.market_cap || 0) >= CONFIG.MIN_MARKET_CAP)
      .map((coin, i) => ({
        id: i + 1,
        cgId: coin.id,
        sym: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        price: coin.current_price || 0,
        marketCap: coin.market_cap || 0,
        volume24h: coin.total_volume || 0,
        c1h: coin.price_change_percentage_1h_in_currency || 0,
        c24: coin.price_change_percentage_24h || 0,
        c7: coin.price_change_percentage_7d_in_currency || 0,
        c30: coin.price_change_percentage_30d_in_currency || 0,
        ath: coin.ath || 0,
        athChange: coin.ath_change_percentage || 0,
        sparkline: coin.sparkline_in_7d?.price || [],
        vwap24Hr: 0,
      }));
    saveCache('cryptos', data);
    return data;
  } catch (err) {
    console.error('Crypto fetch error:', err);
    return null;
  }
};

// Sequential loading — staggers CoinGecko calls to avoid rate limit
export const loadAllData = async (isFirstLoad, setCryptos) => {
  const fgData = await fetchWithRetry(fetchFearGreedData);
  await wait(1500);
  const cryptoData = await fetchWithRetry(fetchCryptos);
  await wait(2000);
  const btcData = await fetchWithRetry(fetchBtcHistory);
  return { fgData, cryptoData, btcData };
};
