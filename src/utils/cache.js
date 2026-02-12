import { CONFIG } from './config';

export const saveCache = (key, data) => {
  try {
    localStorage.setItem(CONFIG.CACHE_KEY + '_' + key, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) {
    console.warn('Cache save failed:', e);
  }
};

export const loadCache = (key) => {
  try {
    const raw = localStorage.getItem(CONFIG.CACHE_KEY + '_' + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data;
  } catch (e) {
    return null;
  }
};
