const OPP_HISTORY_KEY = 'csp_opp_history';
const TWO_HOURS = 2 * 60 * 60 * 1000;
const MAX_ENTRIES = 365;

export function getOppHistory() {
  try {
    return JSON.parse(localStorage.getItem(OPP_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveOppScore(score) {
  const history = getOppHistory();
  const now = Date.now();

  // Deduplicate: skip if last entry is less than 2h old
  if (history.length > 0) {
    const last = history[history.length - 1];
    if (now - last.ts < TWO_HOURS) return;
  }

  history.push({
    score: Math.round(score),
    ts: now,
    date: new Date(now).toISOString().split('T')[0],
  });

  // Keep max entries
  if (history.length > MAX_ENTRIES) {
    history.splice(0, history.length - MAX_ENTRIES);
  }

  localStorage.setItem(OPP_HISTORY_KEY, JSON.stringify(history));
}
