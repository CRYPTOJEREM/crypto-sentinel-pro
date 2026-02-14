export default function Header({ isLive, time, stats, lastUpdate, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'updates', label: 'Mises à jour' },
    { id: 'guide', label: 'Guide' },
  ];

  return (
    <header className="animate-fadeInUp">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">CS</div>
          <div>
            <h1 className="text-base font-semibold text-white">Crypto Sentinel Pro</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`flex items-center gap-1 text-[11px] ${isLive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                {isLive ? 'Live' : 'Chargement...'}
              </span>
              <span className="text-[11px] text-zinc-600 font-mono">{time}</span>
              {lastUpdate && lastUpdate !== 'cache' && (
                <span className="text-[11px] text-zinc-700">MAJ {lastUpdate}</span>
              )}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold font-mono text-zinc-300">{stats.bull}</span>
            <span className="text-[11px] text-zinc-600">bull</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span className="text-xs font-semibold font-mono text-zinc-300">{stats.neut}</span>
            <span className="text-[11px] text-zinc-600">neutre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold font-mono text-zinc-300">{stats.bear}</span>
            <span className="text-[11px] text-zinc-600">bear</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex gap-1 border-b border-zinc-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
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
