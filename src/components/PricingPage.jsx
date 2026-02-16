const PLANS = [
  {
    id: 'free',
    name: 'Decouverte',
    price: '0€',
    period: '',
    desc: 'Pour explorer le marche crypto.',
    features: [
      'Fear & Greed Index en temps reel',
      'Graphique historique F&G + BTC',
      'Donnees de marche basiques',
    ],
    locked: [
      'Indice d\'Opportunite',
      'Scanner Radar (210+ paires)',
      'Alertes & notifications',
      'Scores sentiment par crypto',
      'Support prioritaire',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: '14.99€',
    period: '/mois',
    desc: 'Le choix ideal pour les traders actifs.',
    features: [
      'Tout le plan Decouverte',
      'Indice d\'Opportunite (backtest 2 ans)',
      '200+ cryptos avec sentiment',
      'Scanner Radar Bitunix (210+ paires)',
      'Alertes changement de phase crypto',
      'Notifications navigateur temps reel',
      'Filtres & tri avances',
      'Details par crypto (24h, 7j, 30j)',
      'Market Cap & Volume',
    ],
    locked: [
      'Support prioritaire',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '9.99€',
    period: '/mois',
    desc: 'Acces aux outils essentiels.',
    features: [
      'Tout le plan Decouverte',
      'Indice d\'Opportunite (backtest 2 ans)',
      '200+ cryptos avec sentiment',
      'Filtres & tri avances',
      'Details par crypto (24h, 7j, 30j)',
      'Market Cap & Volume',
    ],
    locked: [
      'Scanner Radar Bitunix',
      'Alertes changement de phase',
      'Support prioritaire',
    ],
  },
];

export default function PricingPage({ userRole, onLoginClick }) {
  const hasAccess = userRole === 'admin' || userRole === 'premium';

  return (
    <div className="animate-fadeInUp max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Choisissez votre plan</h2>
        <p className="text-base text-zinc-500">Debloquez toutes les fonctionnalites de Crypto Sentinel Pro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan) => {
          const isCurrent = (plan.id === 'free' && !hasAccess) || ((plan.id === 'pro' || plan.id === 'business') && hasAccess);
          const isBusiness = plan.id === 'business';

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 flex flex-col border transition-all duration-300 ${
                isBusiness
                  ? 'border-blue-500/40 bg-gradient-to-b from-blue-500/[0.06] to-[#16162a] scale-[1.03] shadow-xl shadow-blue-500/5'
                  : 'border-[#2a2a45]/80 bg-[#16162a]'
              }`}
            >
              {isBusiness && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Recommande
                </span>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-1 ${isBusiness ? 'text-blue-400' : 'text-white'}`}>{plan.name}</h3>
                <p className="text-xs text-zinc-500 mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold font-mono ${isBusiness ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                  {plan.period && <span className="text-sm text-zinc-500">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
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
                    <svg className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-zinc-700">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-3 rounded-xl text-sm font-semibold text-center bg-[#111122] border border-[#2a2a45] text-zinc-400">
                  {hasAccess ? (userRole === 'admin' ? 'Admin' : 'Actif') : 'Plan actuel'}
                </div>
              ) : plan.id === 'free' ? (
                <div className="w-full py-3 rounded-xl text-sm font-semibold text-center bg-[#111122] border border-[#2a2a45] text-zinc-500">
                  Inclus
                </div>
              ) : userRole ? (
                <a
                  href="#"
                  className={`block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300 ${
                    isBusiness
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] text-zinc-300'
                  }`}
                >
                  {isBusiness ? 'Passer a Business' : 'Passer a Pro'}
                </a>
              ) : (
                <button
                  onClick={onLoginClick}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isBusiness
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] text-zinc-300'
                  }`}
                >
                  Se connecter
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-blue-400/60">Le plan Business est le plus populaire aupres de nos traders.</p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-zinc-600">Paiement securise. Annulation possible a tout moment.</p>
      </div>
    </div>
  );
}
