const TG_CONFIG_KEY = 'csp_telegram_config';

export function getTelegramConfig() {
  try {
    const raw = localStorage.getItem(TG_CONFIG_KEY);
    if (!raw) return { enabled: false, botToken: '', chatId: '' };
    return { enabled: false, botToken: '', chatId: '', ...JSON.parse(raw) };
  } catch {
    return { enabled: false, botToken: '', chatId: '' };
  }
}

export function saveTelegramConfig(config) {
  localStorage.setItem(TG_CONFIG_KEY, JSON.stringify(config));
}

export async function sendTelegramMessage(text) {
  const config = getTelegramConfig();
  if (!config.enabled || !config.botToken || !config.chatId) return false;
  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function testTelegramBot() {
  const config = getTelegramConfig();
  if (!config.botToken || !config.chatId) return false;
  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: '✅ <b>Crypto Sentinel Pro</b> — Bot connecte avec succes !',
        parse_mode: 'HTML',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function formatPhaseAlert(alert) {
  const arrow = alert.type === 'phase_up' ? '🟢' : '🔴';
  return `${arrow} <b>${alert.sym}</b> — ${alert.to}\n${alert.from} → ${alert.to}`;
}

export function formatScoreAlert(alert) {
  const icon = alert.type === 'buy' ? '🟢' : '🔴';
  const label = alert.type === 'buy' ? "Zone d'achat" : 'Zone prudence';
  return `${icon} <b>${label}</b>\nIndice d'Opportunite : ${alert.score}/100`;
}
