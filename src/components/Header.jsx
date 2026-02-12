import StatChip from './StatChip';

export default function Header({ isLive, time, stats, lastUpdate }) {
  return (
    <header className="mb-8 animate-fadeInUp">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-lg font-black text-white shadow-lg shadow-blue-600/20">
              CS
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gradient">CRYPTO SENTINEL PRO</h1>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isLive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`}
                    style={isLive ? { boxShadow: '0 0 6px #22c55e' } : {}}
                  />
                  {isLive ? 'LIVE' : 'CHARGEMENT...'}
                </span>
                <span className="text-xs text-gray-500 font-mono">{time}</span>
                {lastUpdate && <span className="text-[10px] text-gray-600">MAJ: {lastUpdate}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <StatChip label="Bull" value={stats.bull} color="#22c55e" />
          <StatChip label="Neut" value={stats.neut} color="#eab308" />
          <StatChip label="Bear" value={stats.bear} color="#ef4444" />
        </div>
      </div>
    </header>
  );
}
