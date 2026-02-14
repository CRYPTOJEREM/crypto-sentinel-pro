export default function Header({ isLive, time, stats, lastUpdate, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'updates', label: 'Mises à jour' },
    { id: 'guide', label: 'Guide' },
  ];

  return (
    <header className="py-3">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white">CS</div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Crypto Sentinel Pro</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`flex items-center gap-1.5 text-xs ${isLive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                {isLive ? 'Live' : 'Chargement...'}
              </span>
              <span className="text-xs text-zinc-600 font-mono">{time}</span>
              {lastUpdate && lastUpdate !== 'cache' && (
                <span className="text-xs text-zinc-700">MAJ {lastUpdate}</span>
              )}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold font-mono text-zinc-200">{stats.bull}</span>
            <span className="text-xs text-zinc-500">bull</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-sm font-semibold font-mono text-zinc-200">{stats.neut}</span>
            <span className="text-xs text-zinc-500">neutre</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-semibold font-mono text-zinc-200">{stats.bear}</span>
            <span className="text-xs text-zinc-500">bear</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}
