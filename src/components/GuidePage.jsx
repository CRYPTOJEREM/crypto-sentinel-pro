const SECTIONS = [
  {
    title: 'Fear & Greed Index',
    icon: '1',
    content: [
      { q: "C'est quoi ?", a: "L'indice Fear & Greed mesure le sentiment global du marché crypto sur une échelle de 0 (peur extrême) à 100 (avidité extrême). Il est calculé par Alternative.me à partir de plusieurs sources : volatilité, momentum, réseaux sociaux, sondages, dominance BTC." },
      { q: 'Comment le lire ?', a: "Un score bas (0-25) indique une peur extrême : le marché panique, c'est historiquement un bon moment pour acheter. Un score élevé (75-100) signale l'euphorie : prudence, les corrections suivent souvent." },
      { q: 'Le graphique', a: "La courbe orange montre l'évolution du Fear & Greed dans le temps. La ligne grise superpose le prix du BTC pour visualiser la corrélation. Vous pouvez changer la période (30j, 1 an, Tout)." },
    ],
  },
  {
    title: "Indice d'Opportunité",
    icon: '2',
    content: [
      { q: "C'est quoi ?", a: "Un score composite propriétaire (0-100) qui agrège 5 facteurs pour estimer les conditions d'investissement actuelles. Les poids de chaque facteur sont optimisés par backtest sur 2 ans de données historiques." },
      { q: 'Les 5 facteurs', a: "Fear/Greed Contrarian : inverse du F&G (peur = opportunité). BTC vs ATH : distance au record historique. Market Breadth : pourcentage de cryptos en hausse. Volatilité : stabilité du marché. Momentum 30j : tendance sur le dernier mois." },
      { q: 'Comment utiliser', a: "Score > 70 = conditions favorables. Score 40-70 = neutre, pas de signal clair. Score < 40 = conditions défavorables. Cliquez sur chaque facteur pour une analyse détaillée en temps réel." },
    ],
  },
  {
    title: 'Cartes Crypto',
    icon: '3',
    content: [
      { q: 'Le score Sentiment', a: "Chaque crypto a un score de sentiment (0-100) calculé à partir de ses variations de prix (24h, 7j, 30j), sa distance au ATH et son volume. Bullish (>60), Neutre (40-60), Bearish (<40)." },
      { q: 'Trend 7j', a: "Indique la tendance sur 7 jours : hausse ou baisse avec le pourcentage de variation." },
      { q: 'Détails', a: "Cliquez sur une carte pour voir les variations détaillées (24h, 7j, 30j), le market cap et le volume 24h." },
    ],
  },
  {
    title: 'Filtres & Recherche',
    icon: '4',
    content: [
      { q: 'Recherche', a: "Tapez un nom ou symbole (BTC, Ethereum...) pour trouver une crypto rapidement." },
      { q: 'Filtres', a: "Filtrez par sentiment : Tous, Bullish, Neutre, Bearish. Seules les cryptos correspondant au filtre sont affichées." },
      { q: 'Tri', a: "Triez par rang (capitalisation), sentiment, variation 24h ou volume pour identifier les opportunités." },
    ],
  },
  {
    title: 'Sources & Limites',
    icon: '5',
    content: [
      { q: 'Sources de données', a: "Fear & Greed : Alternative.me (données réelles, mise à jour quotidienne). Marché : CoinCap.io (prix, volumes, variations en temps réel, 200 req/min)." },
      { q: 'Actualisation', a: "Les données sont rafraîchies automatiquement toutes les 2 minutes. Un cache local conserve les dernières données en cas d'erreur réseau." },
      { q: 'Avertissement', a: "Cet outil est informatif uniquement. Les scores et indicateurs sont des estimations algorithmiques, pas des conseils financiers. Le marché crypto est extrêmement volatil." },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="animate-fadeInUp max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-1">Guide d'utilisation</h2>
        <p className="text-sm text-zinc-500">Tout ce qu'il faut savoir pour utiliser Crypto Sentinel Pro.</p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-400 font-mono">{section.icon}</span>
              <h3 className="text-base font-semibold text-zinc-100">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.content.map((item, j) => (
                <div key={j}>
                  <h4 className="text-sm font-medium text-zinc-300 mb-1">{item.q}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
