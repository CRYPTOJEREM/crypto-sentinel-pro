const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    period: '',
    features: [
      'Fear & Greed Index en temps réel',
      'Graphique historique F&G + BTC',
      'Données de marché basiques',
    ],
    locked: [
      'Indice d\'Opportunité',
      '200+ cryptos détaillées',
      'Filtres & tri avancés',
      'Scores sentiment par crypto',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '9.99€',
    period: '/mois',
    features: [
      'Tout le plan Gratuit',
      'Indice d\'Opportunité (backtest 2 ans)',
      '200+ cryptos avec sentiment',
      'Filtres & tri avancés',
      'Détails par crypto (24h, 7j, 30j)',
      'Market Cap & Volume',
      'Mises à jour prioritaires',
    ],
    locked: [],
  },
];

export default function PricingPage({ userRole, onLoginClick }) {
  const hasAccess = userRole === 'admin' || userRole === 'premium';

  return (
    <div className="animate-fadeInUp max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choisissez votre plan</h2>
        <p className="text-sm text-zinc-500">Débloquez toutes les fonctionnalités de Crypto Sentinel Pro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = (plan.id === 'free' && !hasAccess) || (plan.id === 'pro' && hasAccess);
          const isPro = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative bg-[#16162a] border rounded-2xl p-6 flex flex-col ${
                isPro ? 'border-blue-500/40' : 'border-[#2a2a45]/80'
              }`}
            >
              {isPro && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  Recommandé
                </span>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white font-mono">{plan.price}</span>
                  {plan.period && <span className="text-sm text-zinc-500">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
                {plan.locked.map((f, i) => (
                  <li key={`l-${i}`} className="flex items-start gap-2.5 text-sm">
                    <svg className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-zinc-600">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-[#111122] border border-[#2a2a45] text-zinc-400">
                  {hasAccess && isPro ? (userRole === 'admin' ? 'Admin' : 'Actif') : 'Plan actuel'}
                </div>
              ) : isPro ? (
                userRole ? (
                  <a
                    href="#"
                    className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-300 bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Passer à Pro
                  </a>
                ) : (
                  <button
                    onClick={onLoginClick}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Se connecter pour commencer
                  </button>
                )
              ) : (
                <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-[#111122] border border-[#2a2a45] text-zinc-500">
                  Inclus
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-zinc-600">Paiement sécurisé. Annulation possible à tout moment.</p>
      </div>
    </div>
  );
}
