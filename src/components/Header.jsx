export default function Header({ isLive, time, stats, lastUpdate, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'updates', label: 'Mises à jour' },
    { id: 'guide', label: 'Guide' },
  ];

  return (
    <header className="py-4">
      <div className="flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-600/20">CS</div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Crypto Sentinel Pro</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className={`flex items-center gap-1.5 text-xs ${isLive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                {isLive ? 'Live' : 'Chargement...'}
              </span>
              <span className="text-xs text-zinc-500 font-mono">{time}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { color: 'bg-emerald-500', value: stats.bull, label: 'bull' },
            { color: 'bg-yellow-500', value: stats.neut, label: 'neutre' },
            { color: 'bg-red-500', value: stats.bear, label: 'bear' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              <span className="text-base font-bold font-mono text-white">{s.value}</span>
              <span className="text-xs text-zinc-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex gap-1 mt-4 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-all relative rounded-t-lg ${
              activeTab === tab.id
                ? 'text-white bg-card/50'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-card/30'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}
