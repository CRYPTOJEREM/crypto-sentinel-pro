export default function LandingPage({ onStart, onPricing, onLogin, onAccount, isLoggedIn }) {
  return (
    <div className="animate-fadeInUp">

      {/* Floating nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.04]" style={{ background: 'rgba(11,11,20,0.85)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">CS</div>
            <span className="text-sm font-bold text-white tracking-tight">Crypto Sentinel Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onPricing} className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Tarifs</button>
            {isLoggedIn ? (
              <>
                <button onClick={onStart} className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Dashboard</button>
                <button onClick={onAccount} className="px-4 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] rounded-xl text-sm text-white font-medium transition-all">
                  Mon compte
                </button>
              </>
            ) : (
              <button onClick={onLogin} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold text-white transition-all">
                Se connecter
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center py-24 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-medium text-blue-400">v2.8 — Mise a jour disponible</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
          Crypto Sentinel<br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">Pro</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Algorithme proprietaire a 6 facteurs pour detecter les meilleures opportunites crypto en temps reel. Scanner, signaux, alertes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 w-full sm:w-auto"
          >
            {isLoggedIn ? 'Acceder au Dashboard' : 'Commencer gratuitement'}
          </button>
          <button
            onClick={onPricing}
            className="px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-lg font-semibold rounded-2xl transition-all duration-300 w-full sm:w-auto"
          >
            Voir les tarifs
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-base text-zinc-500 max-w-lg mx-auto">Des outils professionnels pour prendre de meilleures decisions sur le marche crypto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              ),
              title: 'Radar intelligent',
              desc: 'Scanner en temps reel de 210+ paires Bitunix Perpetual. Signaux de continuation, surachat, survente et rebond detectes automatiquement.',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              ),
              title: 'Algorithme 6 facteurs',
              desc: 'Fear & Greed contrarian, BTC vs ATH, Market Breadth, Volatilite, Momentum 30j et signal de continuation combines en un seul score.',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              ),
              title: 'Alertes temps reel',
              desc: 'Notifications navigateur automatiques quand le score franchit vos seuils. Configurables et activees par defaut.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/[0.06] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.02]"
              style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.5) 0%, rgba(16,16,30,0.7) 100%)', animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 mb-5">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ca marche */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Comment ca marche</h2>
          <p className="text-base text-zinc-500">Trois etapes pour commencer a detecter les opportunites.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Creez votre compte', desc: 'Inscription gratuite en 30 secondes. Renseignez votre UID Bitunix pour un suivi personnalise.' },
            { step: '02', title: 'Consultez le Radar', desc: 'Explorez le scanner avec les signaux de toutes les paires. Filtrez par signal, sentiment ou variation.' },
            { step: '03', title: 'Agissez sur les signaux', desc: 'Recevez les alertes en temps reel et prenez position sur Bitunix quand les conditions sont reunies.' },
          ].map((s, i) => (
            <div key={i} className="relative text-center">
              <div className="text-6xl font-bold font-mono text-white/[0.04] mb-4">{s.step}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 text-zinc-700">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Chiffres cles */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="rounded-3xl border border-white/[0.06] p-12" style={{ background: 'linear-gradient(135deg, rgba(11,11,20,0.95) 0%, rgba(22,22,42,0.95) 100%)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '210+', label: 'Paires Bitunix', color: '#60a5fa' },
              { value: '6', label: 'Facteurs algo', color: '#34d399' },
              { value: '24/7', label: 'Surveillance', color: '#fbbf24' },
              { value: '2min', label: 'Rafraichissement', color: '#c084fc' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold font-mono mb-2" style={{ color: s.color }}>{s.value}</p>
                <p className="text-sm text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto text-center px-4 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
          Pret a detecter la prochaine opportunite ?
        </h2>
        <p className="text-base text-zinc-500 mb-10 max-w-lg mx-auto">
          Rejoignez les traders qui utilisent Crypto Sentinel Pro pour optimiser leurs entrees sur le marche.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 w-full sm:w-auto"
          >
            {isLoggedIn ? 'Acceder au Dashboard' : 'Commencer maintenant'}
          </button>
        </div>

        {!isLoggedIn && (
          <p className="text-sm text-zinc-600 mt-6">
            Deja inscrit ?{' '}
            <button onClick={onStart} className="text-blue-400 hover:text-blue-300 transition-colors">
              Se connecter
            </button>
          </p>
        )}
      </section>
    </div>
  );
}
