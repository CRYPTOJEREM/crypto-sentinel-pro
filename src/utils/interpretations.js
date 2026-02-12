export const getFactorInterpretation = (name, value) => {
  const v = value;
  if (name === 'Fear/Greed Contrarian') {
    if (v >= 75) return { text: 'Le marché est en panique — historiquement, c\'est souvent une zone d\'accumulation pour les investisseurs patients.', signal: 'Fort' };
    if (v >= 55) return { text: 'Le sentiment est négatif. Les corrections de ce type ont souvent précédé des rebonds significatifs.', signal: 'Modéré' };
    if (v >= 40) return { text: 'Zone neutre — le marché n\'envoie pas de signal contrarian clair dans un sens ou l\'autre.', signal: 'Neutre' };
    if (v >= 25) return { text: 'L\'optimisme domine. La prudence est conseillée : les phases d\'euphorie peuvent précéder des corrections.', signal: 'Faible' };
    return { text: 'Le marché est en euphorie extrême. Historiquement, ces niveaux ont souvent marqué des sommets locaux.', signal: 'Très faible' };
  }
  if (name === 'BTC vs ATH') {
    if (v >= 90) return { text: 'Bitcoin est très proche de son record historique — signe de force majeure du marché et de confiance élevée.', signal: 'Fort' };
    if (v >= 70) return { text: 'Le marché évolue dans une zone haute. La tendance de fond reste haussière avec un potentiel de continuation.', signal: 'Bon' };
    if (v >= 50) return { text: 'Bitcoin est à mi-chemin de son ATH. Le marché est en phase de construction ou de consolidation.', signal: 'Neutre' };
    if (v >= 30) return { text: 'Le marché est significativement sous son ATH. Zone potentielle d\'accumulation pour le long terme.', signal: 'Opportunité' };
    return { text: 'Bitcoin est loin de son record. Le marché traverse une phase de forte correction — territoire de conviction.', signal: 'Contrarian' };
  }
  if (name === 'Market Breadth') {
    if (v >= 75) return { text: 'Large participation haussière : la majorité des actifs progressent. Signe d\'un marché sain et en tendance.', signal: 'Fort' };
    if (v >= 55) return { text: 'La majorité du marché est en hausse. La tendance est positive mais quelques divergences apparaissent.', signal: 'Bon' };
    if (v >= 40) return { text: 'Marché partagé : autant de gagnants que de perdants. Phase d\'indécision ou de rotation sectorielle.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Peu d\'actifs participent à la hausse. La faiblesse est généralisée — méfiance recommandée.', signal: 'Faible' };
    return { text: 'Marché en détresse : quasi aucun actif ne progresse. Capitulation possible ou fin de cycle baissier.', signal: 'Alerte' };
  }
  if (name === 'Volatilité') {
    if (v >= 70) return { text: 'La volatilité est modérée et constructive. Les mouvements sont ordonnés — conditions idéales pour du trading directionnel.', signal: 'Optimal' };
    if (v >= 50) return { text: 'Volatilité dans une fourchette acceptable. Le marché oscille normalement avec des opportunités régulières.', signal: 'Bon' };
    if (v >= 35) return { text: 'Très faible volatilité. Le marché est en compression — un mouvement explosif pourrait se préparer dans un sens ou l\'autre.', signal: 'Attention' };
    return { text: 'Volatilité extrême. Les mouvements sont brutaux et imprévisibles — le risque est maximal, favoriser la réduction d\'exposition.', signal: 'Danger' };
  }
  if (name === 'Momentum 30j') {
    if (v >= 75) return { text: 'Fort momentum haussier sur 30 jours. La tendance est clairement établie en faveur des acheteurs.', signal: 'Fort' };
    if (v >= 55) return { text: 'Momentum modérément positif. Le marché est en légère progression — tendance favorable mais sans excès.', signal: 'Bon' };
    if (v >= 40) return { text: 'Momentum neutre. Le marché évolue sans direction claire sur le mois écoulé. Phase d\'attente.', signal: 'Neutre' };
    if (v >= 20) return { text: 'Momentum négatif. La tendance mensuelle est baissière — le marché perd du terrain progressivement.', signal: 'Faible' };
    return { text: 'Fort momentum baissier. La pression vendeuse domine largement sur le mois — phase de correction active.', signal: 'Très faible' };
  }
  if (v >= 70) return { text: 'Le marché est fortement survendu par rapport à sa moyenne. Les retours vers la moyenne favorisent un rebond.', signal: 'Fort' };
  if (v >= 50) return { text: 'Légèrement en dessous de la moyenne. Conditions normales avec une légère opportunité statistique.', signal: 'Bon' };
  if (v >= 35) return { text: 'Le marché évolue proche de sa moyenne. Pas de signal de déviation significatif.', signal: 'Neutre' };
  return { text: 'Le marché est en surchauffe par rapport à sa moyenne. Une correction vers la moyenne est statistiquement probable.', signal: 'Prudence' };
};

export const getSignalColor = (signal) => {
  const map = {
    Fort: '#16c784', Bon: '#93d900', Optimal: '#16c784', Modéré: '#93d900',
    Neutre: '#c9b003', Attention: '#ea8c00', Opportunité: '#3b82f6', Contrarian: '#a855f7',
    Faible: '#ea8c00', 'Très faible': '#ea3943', Alerte: '#ea3943', Danger: '#ea3943', Prudence: '#ea8c00',
  };
  return map[signal] || '#c9b003';
};
