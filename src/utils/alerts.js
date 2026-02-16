import { sendTelegramMessage, formatScoreAlert, formatPhaseAlert } from './telegram';

const ALERTS_KEY = 'csp_alerts';
const ALERT_SETTINGS_KEY = 'csp_alert_settings';
const CRYPTO_SIGNALS_KEY = 'csp_crypto_signals';

const DEFAULT_SETTINGS = { enabled: true, buyThreshold: 70, sellThreshold: 30 };

export function getAlertSettings() {
  try {
    const raw = localStorage.getItem(ALERT_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveAlertSettings(settings) {
  localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(settings));
}

export function getAlertHistory() {
  try {
    return JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function addAlert(type, score, extra = null) {
  const history = getAlertHistory();
  const entry = { type, score, ts: Date.now() };
  if (extra) Object.assign(entry, extra);
  history.push(entry);
  if (history.length > 100) history.splice(0, history.length - 100);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(history));
}

async function requestPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function sendBrowserNotif(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

export async function checkAndNotify(score, prevScore) {
  if (prevScore === null || prevScore === undefined) return null;
  const settings = getAlertSettings();
  if (!settings.enabled) return null;

  const { buyThreshold, sellThreshold } = settings;

  if (score >= buyThreshold && prevScore < buyThreshold) {
    await requestPermission();
    const msg = `Zone d'achat detectee ! Score: ${score}/100`;
    sendBrowserNotif('Crypto Sentinel Pro', msg);
    addAlert('buy', score);
    const alert = { type: 'buy', score, message: msg };
    sendTelegramMessage(formatScoreAlert(alert));
    return alert;
  }

  if (score <= sellThreshold && prevScore > sellThreshold) {
    await requestPermission();
    const msg = `Zone de prudence ! Score: ${score}/100`;
    sendBrowserNotif('Crypto Sentinel Pro', msg);
    addAlert('sell', score);
    const alert = { type: 'sell', score, message: msg };
    sendTelegramMessage(formatScoreAlert(alert));
    return alert;
  }

  return null;
}

// --- Crypto phase change detection ---

function getSignalLabel(rsi, sentiment) {
  if (rsi !== null && rsi >= 60 && rsi <= 64 && sentiment > 55) return 'ACHAT FORT';
  if (rsi !== null && rsi >= 60 && rsi <= 64) return 'ACHAT';
  if (rsi !== null && rsi < 20 && sentiment > 40) return 'REBOND';
  if (sentiment > 65) return 'BULLISH';
  if (rsi !== null && rsi > 80) return 'PRUDENCE';
  if (sentiment < 35) return 'BEARISH';
  return 'NEUTRE';
}

function getSavedSignals() {
  try {
    return JSON.parse(localStorage.getItem(CRYPTO_SIGNALS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveSignals(signals) {
  localStorage.setItem(CRYPTO_SIGNALS_KEY, JSON.stringify(signals));
}

const POSITIVE_TRANSITIONS = new Set([
  'NEUTRE->ACHAT', 'NEUTRE->ACHAT FORT', 'NEUTRE->BULLISH',
  'BEARISH->NEUTRE', 'BEARISH->ACHAT', 'BEARISH->BULLISH',
  'ACHAT->ACHAT FORT', 'PRUDENCE->NEUTRE', 'PRUDENCE->ACHAT',
]);

const NEGATIVE_TRANSITIONS = new Set([
  'NEUTRE->BEARISH', 'NEUTRE->PRUDENCE',
  'BULLISH->NEUTRE', 'BULLISH->BEARISH', 'BULLISH->PRUDENCE',
  'ACHAT->NEUTRE', 'ACHAT->BEARISH', 'ACHAT FORT->NEUTRE',
  'ACHAT FORT->BEARISH', 'ACHAT FORT->PRUDENCE',
]);

function computeRSILocal(prices, period = 6) {
  if (!prices || prices.length < period + 1) return null;
  let gainSum = 0, lossSum = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gainSum += diff; else lossSum += Math.abs(diff);
  }
  const avgGain = gainSum / period;
  const avgLoss = lossSum / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round((100 - 100 / (1 + rs)) * 10) / 10;
}

export async function checkCryptoPhaseChanges(cryptos, computeSentiment) {
  const settings = getAlertSettings();
  if (!settings.enabled) return [];
  if (!cryptos || cryptos.length === 0) return [];

  const prevSignals = getSavedSignals();
  const newSignals = {};
  const alerts = [];

  for (const coin of cryptos) {
    const rsi = coin.sparkline && coin.sparkline.length >= 7
      ? computeRSILocal(coin.sparkline, 6)
      : null;
    const sentiment = computeSentiment(coin);
    const signal = getSignalLabel(rsi, sentiment);
    newSignals[coin.sym] = signal;

    const prev = prevSignals[coin.sym];
    if (!prev || prev === signal) continue;

    const transition = `${prev}->${signal}`;
    const isPositive = POSITIVE_TRANSITIONS.has(transition);
    const isNegative = NEGATIVE_TRANSITIONS.has(transition);

    if (isPositive || isNegative) {
      alerts.push({
        type: isPositive ? 'phase_up' : 'phase_down',
        sym: coin.sym,
        name: coin.name,
        from: prev,
        to: signal,
        score: sentiment,
      });

      addAlert(isPositive ? 'phase_up' : 'phase_down', sentiment, {
        sym: coin.sym,
        from: prev,
        to: signal,
      });
    }
  }

  saveSignals(newSignals);

  // Browser notif for top 3 changes to avoid spam
  const important = alerts.slice(0, 3);
  if (important.length > 0) {
    await requestPermission();
    for (const a of important) {
      const arrow = a.type === 'phase_up' ? '↗' : '↘';
      sendBrowserNotif(
        `${arrow} ${a.sym} — ${a.to}`,
        `${a.name} passe de ${a.from} a ${a.to}`
      );
    }
  }

  // Telegram: send all phase changes in one message
  if (alerts.length > 0) {
    const lines = alerts.map((a) => formatPhaseAlert(a));
    sendTelegramMessage(`📊 <b>Changements de phase</b>\n\n${lines.join('\n\n')}`);
  }

  return alerts;
}

export async function testNotification() {
  const granted = await requestPermission();
  if (granted) {
    sendBrowserNotif('Crypto Sentinel Pro', 'Les notifications fonctionnent !');
    return true;
  }
  return false;
}
