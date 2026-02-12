export const getFearGreedClass = (v) => {
  if (v <= 24) return { label: 'Extreme Fear', color: '#ea3943', bg: 'rgba(234,57,67,0.12)', emoji: '😱', desc: 'Capitulation - Opportunité contrarian' };
  if (v <= 44) return { label: 'Fear', color: '#ea8c00', bg: 'rgba(234,140,0,0.12)', emoji: '😰', desc: 'Sentiment négatif dominant' };
  if (v <= 55) return { label: 'Neutral', color: '#c9b003', bg: 'rgba(201,176,3,0.12)', emoji: '😐', desc: 'Marché indécis' };
  if (v <= 74) return { label: 'Greed', color: '#93d900', bg: 'rgba(147,217,0,0.12)', emoji: '😊', desc: 'Optimisme & FOMO' };
  return { label: 'Extreme Greed', color: '#16c784', bg: 'rgba(22,199,132,0.12)', emoji: '🤑', desc: 'Euphorie - Correction probable' };
};

export const getOppClass = (v) => {
  if (v <= 20) return { label: 'ÉVITER', color: '#ea3943', emoji: '🚫', desc: 'Conditions défavorables' };
  if (v <= 40) return { label: 'PRUDENCE', color: '#ea8c00', emoji: '⚠️', desc: 'Attendre de meilleures conditions' };
  if (v <= 60) return { label: 'NEUTRE', color: '#c9b003', emoji: '😐', desc: 'Conditions moyennes' };
  if (v <= 80) return { label: 'FAVORABLE', color: '#93d900', emoji: '✅', desc: 'Bonnes conditions d\'entrée' };
  return { label: 'EXCELLENT', color: '#16c784', emoji: '🎯', desc: 'Conditions optimales' };
};

export const getSentimentStyle = (v) => {
  if (v <= 30) return { color: '#ea3943', label: 'BEARISH' };
  if (v <= 50) return { color: '#ea8c00', label: 'NEUTRE' };
  if (v <= 70) return { color: '#93d900', label: 'BULLISH' };
  return { color: '#16c784', label: 'V.BULLISH' };
};
