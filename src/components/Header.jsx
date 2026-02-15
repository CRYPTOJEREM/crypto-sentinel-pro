export default function Header({ isLive, time, stats, lastUpdate, activeTab, setActiveTab, user, onLoginClick, onLogout }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'updates', label: 'Mises à jour' },
    { id: 'guide', label: 'Guide' },
  ];

  return (
    <header className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white">CS</div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Crypto Sentinel Pro</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`flex items-center gap-1.5 text-xs ${isLive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                {isLive ? 'Live' : 'Chargement...'}
              </span>
              <span className="text-xs text-zinc-500 font-mono">{time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-5">
            {[
              { color: 'bg-emerald-500', value: stats.bull, label: 'bull' },
              { color: 'bg-yellow-500', value: stats.neut, label: 'neutre' },
              { color: 'bg-red-500', value: stats.bear, label: 'bear' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-sm font-bold font-mono text-white">{s.value}</span>
                <span className="text-xs text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 hidden sm:block">{user.length > 20 ? user.slice(0, 20) + '...' : user}</span>
              <button onClick={onLogout} className="px-3 py-1.5 bg-[#111122] border border-[#2a2a45] rounded-xl text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
                Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition-all">
              Se connecter
            </button>
          )}
        </div>
      </div>

      <nav className="flex gap-1 mt-3 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative rounded-t-lg ${
              activeTab === tab.id
                ? 'text-white bg-[#16162a]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#16162a]/50'
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
