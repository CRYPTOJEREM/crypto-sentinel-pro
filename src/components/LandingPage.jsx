import ScrollReveal from './ScrollReveal';

export default function LandingPage({ onStart, onPricing, onLogin, onAccount, isLoggedIn }) {
  return (
    <div>

      {/* Floating nav — glassmorphism */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-white/[0.04]">
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
                <button onClick={onAccount} className="btn-apple px-4 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] rounded-xl text-sm text-white font-medium">
                  Mon compte
                </button>
              </>
            ) : (
              <button onClick={onLogin} className="btn-apple px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold text-white">
                Se connecter
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center py-24 px-4">
        <div className="animate-fadeInUp inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-medium text-blue-400">v3.0 disponible</span>
        </div>

        <h1 className="animate-fadeInUp text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6" style={{ animationDelay: '0.1s' }}>
          Crypto Sentinel<br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">Pro</span>
        </h1>

        <p className="animate-fadeInUp text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-4" style={{ animationDelay: '0.2s' }}>
          Gagnez du temps sur votre analyse. Cet outil vous aide à lire les phases de marché complexes en un coup d'œil, que vous soyez en trading ou en spot, débutant ou confirmé.
        </p>
        <p className="animate-fadeInUp text-sm text-zinc-600 mb-10 max-w-xl mx-auto" style={{ animationDelay: '0.25s' }}>
          Pas de signaux de trading. Pas d'indicateur magique. Juste un outil pour faciliter vos propres décisions.
        </p>

        <div className="animate-fadeInUp flex flex-col sm:flex-row items-center justify-center gap-4 mb-4" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={onStart}
            className="btn-apple px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto"
          >
            {isLoggedIn ? 'Accéder au Dashboard' : 'Essayer 7 jours gratuitement'}
          </button>
          <button
            onClick={onPricing}
            className="btn-apple px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-lg font-semibold rounded-2xl w-full sm:w-auto"
          >
            Voir les tarifs
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Gagnez du temps sur votre analyse</h2>
            <p className="text-base text-zinc-500 max-w-xl mx-auto">Un outil pour tous les niveaux. Que vous fassiez du spot ou du perpetual, débutant ou confirmé, simplifiez votre lecture de marché.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              ),
              title: 'Radar 210+ paires',
              desc: 'Visualisez en un clin d\'œil la phase de chaque crypto sur 210+ paires Bitunix. Fini les heures à analyser chart par chart, tout est regroupé ici.',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              ),
              title: 'Lecture de marché simplifiée',
              desc: 'Notre outil synthétise les conditions de marché en un score clair. Vous n\'avez plus besoin de croiser 10 sources différentes. Concentrez-vous sur vos décisions.',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              ),
              title: 'Alertes de phase',
              desc: 'Recevez une notification quand une crypto change de phase de marché. Vous restez informé sans rester collé à l\'écran. Navigateur + Telegram.',
            },
          ].map((f, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div
                className="card-hover rounded-3xl border border-white/[0.06] p-8 hover:border-white/[0.12] hover:bg-white/[0.02] h-full"
                style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.5) 0%, rgba(16,16,30,0.7) 100%)' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Comment ça marche</h2>
            <p className="text-base text-zinc-500">Un outil, pas une promesse. Vous gardez le contrôle de vos décisions.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Essayez gratuitement', desc: '7 jours d\'accès complet, sans engagement. Créez votre compte en 30 secondes et explorez tous les outils.' },
            { step: '02', title: 'Comprenez les phases', desc: 'Le Radar affiche la phase de chaque crypto en temps réel. Accumulation, tendance, surachat : tout est lisible instantanément, même pour un débutant.' },
            { step: '03', title: 'Prenez vos décisions', desc: 'Spot ou trading, c\'est vous qui décidez. L\'outil vous fait gagner du temps d\'analyse, il ne décide jamais à votre place.' },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 120}>
              <div className="relative text-center">
                <div className="text-6xl font-bold font-mono text-white/[0.04] mb-4">{s.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 text-zinc-700">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Chiffres clés */}
      <ScrollReveal>
        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="rounded-3xl border border-white/[0.06] p-12" style={{ background: 'linear-gradient(135deg, rgba(11,11,20,0.95) 0%, rgba(22,22,42,0.95) 100%)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '210+', label: 'Paires analysées', color: '#60a5fa' },
                { value: '24/7', label: 'Surveillance live', color: '#34d399' },
                { value: '2min', label: 'Rafraîchissement', color: '#fbbf24' },
                { value: '100%', label: 'Vous décidez', color: '#c084fc' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl sm:text-5xl font-bold font-mono mb-2" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-sm text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Ce que nous ne sommes PAS */}
      <ScrollReveal>
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="rounded-3xl border border-white/[0.06] p-10" style={{ background: 'linear-gradient(135deg, rgba(11,11,20,0.95) 0%, rgba(22,22,42,0.95) 100%)' }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3 text-center">Ce que Crypto Sentinel Pro n'est pas</h2>
            <p className="text-sm text-zinc-500 text-center mb-8 max-w-lg mx-auto">La transparence, c'est important. Voici ce que vous devez savoir avant de commencer.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { text: 'Pas un service de signaux de trading', detail: 'Nous ne vous disons jamais quand acheter ou vendre. C\'est votre décision.' },
                { text: 'Pas un indicateur magique', detail: 'Aucun outil ne prédit le marché. Le nôtre vous aide simplement à le lire plus vite.' },
                { text: 'Pas réservé aux experts', detail: 'L\'interface est pensée pour être lisible par tous, débutants comme confirmés.' },
                { text: 'Pas une garantie de gains', detail: 'Le trading comporte des risques. Cet outil facilite votre analyse, il ne remplace pas votre jugement.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.04]" style={{ background: 'rgba(255,255,255,0.015)' }}>
                  <svg className="w-5 h-5 text-red-400/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-zinc-300">{item.text}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA final */}
      <ScrollReveal>
        <section className="max-w-3xl mx-auto text-center px-4 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Simplifiez votre analyse. Gardez le contrôle.
          </h2>
          <p className="text-base text-zinc-500 mb-4 max-w-lg mx-auto">
            Un outil pour tous les niveaux qui vous fait gagner du temps, en spot comme en trading. Testez par vous-même.
          </p>
          <p className="text-sm text-zinc-600 mb-10">7 jours gratuits, sans engagement. Vous décidez ensuite.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="btn-apple px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto"
            >
              {isLoggedIn ? 'Accéder au Dashboard' : 'Essayer 7 jours gratuitement'}
            </button>
          </div>

          {!isLoggedIn && (
            <p className="text-sm text-zinc-600 mt-6">
              Déjà inscrit ?{' '}
              <button onClick={onStart} className="text-blue-400 hover:text-blue-300 transition-colors">
                Se connecter
              </button>
            </p>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}
