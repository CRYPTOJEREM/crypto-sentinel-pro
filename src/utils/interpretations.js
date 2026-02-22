export const getFactorInterpretation = (name, value) => {
  const v = value;
  if (name === 'Sentiment') {
    if (v >= 75) return { text: 'Le marché est en panique. Historiquement, c\'est souvent une zone d\'accumulation pour les investisseurs patients.', signal: 'Fort' };
    if (v >= 55) return { text: 'Le sentiment est négatif. Les corrections de ce type ont souvent précédé des rebonds significatifs.', signal: 'Modéré' };
    if (v >= 40) return { text: 'Zone neutre. Le marché n\'envoie pas de signal clair dans un sens ou l\'autre.', signal: 'Neutre' };
    if (v >= 25) return { text: 'L\'optimisme domine. La prudence est conseillée : les phases d\'euphorie peuvent précéder des corrections.', signal: 'Faible' };
    return { text: 'Le marché est en euphorie extrême. Historiquement, ces niveaux ont souvent marqué des sommets locaux.', signal: 'Très faible' };
  }
  if (name === 'Tendance') {
    if (v >= 90) return { text: 'Le marché évolue dans une zone de force majeure. Confiance élevée des participants.', signal: 'Fort' };
    if (v >= 70) return { text: 'Tendance de fond haussière avec un potentiel de continuation.', signal: 'Bon' };
    if (v >= 50) return { text: 'Le marché est en phase de construction ou de consolidation.', signal: 'Neutre' };
    if (v >= 30) return { text: 'Zone potentielle d\'accumulation pour le long terme.', signal: 'Opportunité' };
    return { text: 'Le marché traverse une phase de forte correction. Territoire de conviction.', signal: 'Contrarian' };
  }
  if (name === 'Marché') {
    if (v >= 75) return { text: 'Large participation haussière. Les acteurs majeurs du marché tirent l\'ensemble vers le haut.', signal: 'Fort' };
    if (v >= 55) return { text: 'La majorité du marché est en hausse. Tendance positive bien soutenue.', signal: 'Bon' };
    if (v >= 40) return { text: 'Marché partagé. Phase d\'indécision ou de rotation sectorielle.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Peu d\'actifs participent à la hausse. Faiblesse généralisée.', signal: 'Faible' };
    return { text: 'Marché en détresse. Signal de capitulation possible.', signal: 'Alerte' };
  }
  if (name === 'Stabilité') {
    if (v >= 70) return { text: 'Conditions ordonnées et constructives. Environnement idéal pour le trading directionnel.', signal: 'Optimal' };
    if (v >= 50) return { text: 'Conditions dans une fourchette acceptable. Opportunités régulières.', signal: 'Bon' };
    if (v >= 35) return { text: 'Marché très calme, en compression. Un mouvement pourrait se préparer.', signal: 'Attention' };
    return { text: 'Mouvements brutaux et imprévisibles. Risque maximal, favoriser la réduction d\'exposition.', signal: 'Danger' };
  }
  if (name === 'Dynamique') {
    if (v >= 75) return { text: 'Fort momentum haussier. La tendance est clairement établie en faveur des acheteurs.', signal: 'Fort' };
    if (v >= 55) return { text: 'Momentum positif et soutenu. Le marché progresse de manière saine.', signal: 'Bon' };
    if (v >= 40) return { text: 'Momentum neutre. Pas de direction claire. Phase d\'attente.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Momentum négatif. La pression vendeuse domine.', signal: 'Faible' };
    return { text: 'Fort momentum baissier. Phase de correction active.', signal: 'Très faible' };
  }
  if (name === 'Technique') {
    if (v >= 70) return { text: 'Beaucoup d\'actifs montrent une dynamique technique saine et durable.', signal: 'Fort' };
    if (v >= 50) return { text: 'Dynamique technique positive modérée. Les acheteurs gardent le contrôle.', signal: 'Bon' };
    if (v >= 35) return { text: 'Indicateurs techniques neutres. Équilibre entre forces acheteuses et vendeuses.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Plusieurs actifs en zone de survente. Signal contrarian potentiel.', signal: 'Opportunité' };
    return { text: 'Zone de survente généralisée. Historiquement, ces niveaux précèdent souvent des rebonds.', signal: 'Contrarian' };
  }
  if (name === 'Activité') {
    if (v >= 70) return { text: 'Forte activité sur les actifs en hausse. L\'intérêt acheteur est soutenu. Signal de conviction.', signal: 'Fort' };
    if (v >= 55) return { text: 'Activité modérée et constructive. Les mouvements sont bien accompagnés.', signal: 'Bon' };
    if (v >= 40) return { text: 'Activité normale. Pas de signal particulier. Phase standard.', signal: 'Neutre' };
    if (v >= 25) return { text: 'Faible activité. Les mouvements manquent de conviction.', signal: 'Faible' };
    return { text: 'Très faible activité ou orientée à la baisse. Intérêt du marché bas.', signal: 'Alerte' };
  }
  if (name === 'Flux') {
    if (v >= 70) return { text: 'Les capitaux circulent largement dans le marché. Signal favorable pour l\'ensemble des actifs.', signal: 'Fort' };
    if (v >= 55) return { text: 'Circulation des capitaux équilibrée. Environnement sain.', signal: 'Bon' };
    if (v >= 40) return { text: 'Pas de signal clair de rotation des capitaux.', signal: 'Neutre' };
    if (v >= 25) return { text: 'Les investisseurs se concentrent sur les actifs refuges. Prudence recommandée.', signal: 'Faible' };
    return { text: 'Mode risk-off activé. Les actifs secondaires sous-performent significativement.', signal: 'Alerte' };
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
