const ALERTS_KEY = 'csp_alerts';
const ALERT_SETTINGS_KEY = 'csp_alert_settings';

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

function addAlert(type, score) {
  const history = getAlertHistory();
  history.push({ type, score, ts: Date.now() });
  if (history.length > 50) history.splice(0, history.length - 50);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(history));
}

async function requestPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function sendBrowserNotif(title, body, icon) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: icon || '📊', badge: '📊' });
  }
}

export async function checkAndNotify(score, prevScore) {
  if (prevScore === null || prevScore === undefined) return null;
  const settings = getAlertSettings();
  if (!settings.enabled) return null;

  const { buyThreshold, sellThreshold } = settings;

  // Score crosses above buy threshold
  if (score >= buyThreshold && prevScore < buyThreshold) {
    await requestPermission();
    const msg = `Zone d'achat détectée ! Score: ${score}/100`;
    sendBrowserNotif('🟢 Crypto Sentinel Pro', msg);
    addAlert('buy', score);
    return { type: 'buy', score, message: msg };
  }

  // Score crosses below sell threshold
  if (score <= sellThreshold && prevScore > sellThreshold) {
    await requestPermission();
    const msg = `Zone de prudence ! Score: ${score}/100`;
    sendBrowserNotif('🔴 Crypto Sentinel Pro', msg);
    addAlert('sell', score);
    return { type: 'sell', score, message: msg };
  }

  return null;
}

export async function testNotification() {
  const granted = await requestPermission();
  if (granted) {
    sendBrowserNotif('🔔 Crypto Sentinel Pro', 'Les notifications fonctionnent !');
    return true;
  }
  return false;
}
