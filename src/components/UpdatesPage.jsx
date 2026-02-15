const UPDATES = [
  {
    version: '2.5.0',
    date: '15 Fev 2025',
    title: 'RSI(6) & TradingView',
    changes: [
      'Nouvel onglet Indicateur avec graphique TradingView interactif',
      'RSI(6) comme 6eme facteur de l\'algorithme (zone 60-64 = continuation haussiere)',
      'Selecteur de crypto avec analyse RSI en temps reel',
      'Jauge RSI visuelle avec zones colorees (surachat, survente, continuation)',
      'Widget TradingView avec RSI(6) pre-charge en interval 4H',
    ],
  },
  {
    version: '2.4.0',
    date: '15 Fév 2025',
    title: 'Alertes & Historique Opportunité',
    changes: [
      'Alertes browser : notification quand le score franchit un seuil (achat/prudence)',
      'Configuration des seuils d\'alerte (par défaut 70/30)',
      'Historique graphique de l\'Indice d\'Opportunité avec zones colorées',
      'Sélecteur de période historique (7j, 30j, Tout)',
      'Toast in-app pour les alertes en temps réel',
    ],
  },
  {
    version: '2.3.0',
    date: '15 Fév 2025',
    title: 'Admin & Tarifs',
    changes: [
      'Système de rôles (Admin, Pro, Free)',
      'Page Tarifs avec plans Gratuit et Pro (9.99€/mois)',
      'Badge rôle dans le header',
      'BlurOverlay intelligent selon le rôle',
    ],
  },
  {
    version: '2.2.0',
    date: '15 Fév 2025',
    title: 'Comptes & 200+ cryptos',
    changes: [
      'Système de comptes utilisateurs (inscription / connexion)',
      'Contenu protégé : Fear & Greed visible, reste flouté sans compte',
      'Passage à 200+ cryptos (market cap > 50M$)',
      'Design Apple : coins plus arrondis, bordures subtiles, transitions fluides',
    ],
  },
  {
    version: '2.1.0',
    date: '14 Fév 2025',
    title: 'Redesign minimaliste',
    changes: [
      'Nouvelle interface clean et minimaliste',
      'Navigation par onglets (Dashboard, Mises à jour, Guide)',
      'Palette zinc/dark plus sobre et professionnelle',
      'Suppression des effets glassmorphism au profit d\'un design flat',
      'CSS optimisé (-30% de taille)',
    ],
  },
  {
    version: '2.0.0',
    date: '13 Fév 2025',
    title: 'Migration React + Vite',
    changes: [
      'Migration complète vers React 19 + Vite 7',
      'Architecture modulaire en composants',
      'Tailwind CSS v4 pour le styling',
      'Indice d\'Opportunité avec backtest automatique',
      'Système de cache intelligent pour les données',
    ],
  },
  {
    version: '1.5.0',
    date: '12 Fév 2025',
    title: 'Switch API CoinCap',
    changes: [
      'Remplacement de CoinGecko par CoinCap API (plus fiable)',
      'Support de 100 cryptomonnaies',
      'Sparklines par token',
      'Filtres et tri avancés',
    ],
  },
  {
    version: '1.0.0',
    date: '11 Fév 2025',
    title: 'Lancement initial',
    changes: [
      'Fear & Greed Index en temps réel',
      'Graphique historique Fear & Greed + BTC',
      'Sentiment par cryptomonnaie',
      'Déploiement GitHub Pages',
    ],
  },
];

export default function UpdatesPage() {
  return (
    <div className="animate-fadeInUp max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-1">Mises à jour</h2>
        <p className="text-sm text-zinc-500">Historique des versions et changements.</p>
      </div>

      <div className="space-y-6">
        {UPDATES.map((update, i) => (
          <div key={i} className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-600/15 text-blue-400">v{update.version}</span>
                  {i === 0 && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">Dernière</span>}
                </div>
                <h3 className="text-base font-semibold text-zinc-100">{update.title}</h3>
              </div>
              <span className="text-xs text-zinc-600 font-mono">{update.date}</span>
            </div>
            <ul className="space-y-1.5">
              {update.changes.map((change, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="text-zinc-600 mt-1 text-xs">-</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
