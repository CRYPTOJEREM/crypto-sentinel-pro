export default function Header({ isLive, time, stats, lastUpdate }) {
  return (
    <header className="mb-8 animate-fadeInUp">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Crypto Sentinel Pro</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`flex items-center gap-1.5 text-xs ${isLive ? 'text-emerald-400' : 'text-zinc-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
              {isLive ? 'Live' : 'Chargement...'}
            </span>
            <span className="text-xs text-zinc-600 font-mono">{time}</span>
            {lastUpdate && lastUpdate !== 'cache' && (
              <span className="text-xs text-zinc-600">MAJ {lastUpdate}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <span className="text-sm font-semibold font-mono text-zinc-300">{stats.bull}</span>
            <span className="text-xs text-zinc-600">bull</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="text-sm font-semibold font-mono text-zinc-300">{stats.neut}</span>
            <span className="text-xs text-zinc-600">neutre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="text-sm font-semibold font-mono text-zinc-300">{stats.bear}</span>
            <span className="text-xs text-zinc-600">bear</span>
          </div>
        </div>
      </div>
    </header>
  );
}
