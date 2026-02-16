export const getFactorInterpretation = (name, value) => {
  const v = value;
  if (name === 'Fear/Greed Contrarian') {
    if (v >= 75) return { text: 'Le marché est en panique. Historiquement, c\'est souvent une zone d\'accumulation pour les investisseurs patients.', signal: 'Fort' };
    if (v >= 55) return { text: 'Le sentiment est négatif. Les corrections de ce type ont souvent précédé des rebonds significatifs.', signal: 'Modéré' };
    if (v >= 40) return { text: 'Zone neutre. Le marché n\'envoie pas de signal contrarian clair dans un sens ou l\'autre.', signal: 'Neutre' };
    if (v >= 25) return { text: 'L\'optimisme domine. La prudence est conseillée : les phases d\'euphorie peuvent précéder des corrections.', signal: 'Faible' };
    return { text: 'Le marché est en euphorie extrême. Historiquement, ces niveaux ont souvent marqué des sommets locaux.', signal: 'Très faible' };
  }
  if (name === 'BTC vs ATH') {
    if (v >= 90) return { text: 'Bitcoin est très proche de son record historique. Signe de force majeure du marché et de confiance élevée.', signal: 'Fort' };
    if (v >= 70) return { text: 'Le marché évolue dans une zone haute. La tendance de fond reste haussière avec un potentiel de continuation.', signal: 'Bon' };
    if (v >= 50) return { text: 'Bitcoin est à mi-chemin de son ATH. Le marché est en phase de construction ou de consolidation.', signal: 'Neutre' };
    if (v >= 30) return { text: 'Le marché est significativement sous son ATH. Zone potentielle d\'accumulation pour le long terme.', signal: 'Opportunité' };
    return { text: 'Bitcoin est loin de son record. Le marché traverse une phase de forte correction. Territoire de conviction.', signal: 'Contrarian' };
  }
  if (name === 'Market Breadth') {
    if (v >= 75) return { text: 'Large participation haussière pondérée par capitalisation. Les poids lourds du marché tirent l\'ensemble vers le haut.', signal: 'Fort' };
    if (v >= 55) return { text: 'La majorité du marché (en valeur) est en hausse. Tendance positive soutenue par les grandes capitalisations.', signal: 'Bon' };
    if (v >= 40) return { text: 'Marché partagé : participation équilibrée entre hausses et baisses. Phase d\'indécision ou de rotation.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Peu de capitalisations participent à la hausse. La faiblesse est généralisée sur les actifs majeurs.', signal: 'Faible' };
    return { text: 'Marché en détresse : les grandes capitalisations sont en baisse. Signal de capitulation possible.', signal: 'Alerte' };
  }
  if (name === 'Volatilité') {
    if (v >= 70) return { text: 'Volatilité modérée et constructive. Les mouvements sont ordonnés. Conditions idéales pour du trading directionnel.', signal: 'Optimal' };
    if (v >= 50) return { text: 'Volatilité dans une fourchette acceptable. Le marché oscille normalement avec des opportunités régulières.', signal: 'Bon' };
    if (v >= 35) return { text: 'Très faible volatilité. Le marché est en compression. Un mouvement explosif pourrait se préparer.', signal: 'Attention' };
    return { text: 'Volatilité extrême. Les mouvements sont brutaux et imprévisibles. Risque maximal, favoriser la réduction d\'exposition.', signal: 'Danger' };
  }
  if (name === 'Momentum 7j+30j') {
    if (v >= 75) return { text: 'Fort momentum haussier sur les deux horizons (7j et 30j). La tendance est clairement établie en faveur des acheteurs.', signal: 'Fort' };
    if (v >= 55) return { text: 'Momentum positif, soutenu à court et moyen terme. Le marché progresse de manière saine.', signal: 'Bon' };
    if (v >= 40) return { text: 'Momentum neutre. Pas de direction claire sur les horizons combinés. Phase d\'attente.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Momentum négatif. La tendance est baissière à court et moyen terme. La pression vendeuse domine.', signal: 'Faible' };
    return { text: 'Fort momentum baissier sur les deux horizons. Phase de correction active. La pression vendeuse est intense.', signal: 'Très faible' };
  }
  if (name === 'RSI(14) Market') {
    if (v >= 70) return { text: 'Beaucoup d\'actifs majeurs sont en zone de continuation haussière (RSI 55-70). Tendance saine et durable.', signal: 'Fort' };
    if (v >= 50) return { text: 'Le RSI du marché indique une dynamique positive modérée. Les acheteurs gardent le contrôle.', signal: 'Bon' };
    if (v >= 35) return { text: 'RSI neutre. Le marché ne montre ni excès d\'achat ni de vente. Équilibre entre forces.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Plusieurs actifs en zone survendue. Signal contrarian potentiel pour les investisseurs patients.', signal: 'Opportunité' };
    return { text: 'RSI très bas sur de nombreux actifs. Zone de survente extrême. Historiquement, ces niveaux précèdent souvent des rebonds.', signal: 'Contrarian' };
  }
  if (name === 'Volume Surge') {
    if (v >= 70) return { text: 'Volume élevé sur des actifs en hausse. L\'intérêt acheteur est fort et soutenu par le volume. Signal de conviction.', signal: 'Fort' };
    if (v >= 55) return { text: 'Activité de volume modérée et constructive. Les mouvements sont accompagnés de volumes corrects.', signal: 'Bon' };
    if (v >= 40) return { text: 'Volume normal. Pas de signal particulier lié à l\'activité de trading. Phase standard.', signal: 'Neutre' };
    if (v >= 25) return { text: 'Volume faible. Les mouvements manquent de conviction. Les hausses sans volume sont fragiles.', signal: 'Faible' };
    return { text: 'Très faible volume ou volume concentré sur les baisses. L\'intérêt du marché est bas ou orienté vendeur.', signal: 'Alerte' };
  }
  if (name === 'BTC Dominance') {
    if (v >= 70) return { text: 'La dominance BTC est basse. Les capitaux se dirigent vers les altcoins. Signal d\'alt season favorable.', signal: 'Fort' };
    if (v >= 55) return { text: 'Dominance modérée. L\'argent circule de manière équilibrée entre BTC et les altcoins.', signal: 'Bon' };
    if (v >= 40) return { text: 'Dominance BTC dans la moyenne. Pas de signal clair de rotation vers ou depuis les alts.', signal: 'Neutre' };
    if (v >= 25) return { text: 'Dominance BTC élevée. Les investisseurs se réfugient sur BTC. Prudence sur les altcoins.', signal: 'Faible' };
    return { text: 'Dominance BTC très élevée. Mode risk-off activé. Les altcoins sous-performent significativement.', signal: 'Alerte' };
  }
  // Fallback
  if (v >= 70) return { text: 'Signal positif fort. Les conditions sont favorables sur cet indicateur.', signal: 'Fort' };
  if (v >= 50) return { text: 'Signal modérément positif. Conditions normales avec une légère opportunité.', signal: 'Bon' };
  if (v >= 35) return { text: 'Signal neutre. Pas de déviation significative sur cet indicateur.', signal: 'Neutre' };
  return { text: 'Signal négatif. La prudence est recommandée sur cet aspect du marché.', signal: 'Prudence' };
};

export const getSignalColor = (signal) => {
  const map = {
    Fort: '#16c784', Bon: '#93d900', Optimal: '#16c784', Modéré: '#93d900',
    Neutre: '#c9b003', Attention: '#ea8c00', Opportunité: '#3b82f6', Contrarian: '#a855f7',
    Faible: '#ea8c00', 'Très faible': '#ea3943', Alerte: '#ea3943', Danger: '#ea3943', Prudence: '#ea8c00',
  };
  return map[signal] || '#c9b003';
};
