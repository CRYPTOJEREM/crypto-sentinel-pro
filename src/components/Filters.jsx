export default function Filters({ filter, setFilter, search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5 p-4 glass rounded-xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
      <div className="relative w-full lg:w-72">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Rechercher un token..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#070d1a]/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {[
          { k: 'ALL', l: 'Tous' },
          { k: 'BULLISH', l: 'Bullish' },
          { k: 'NEUTRAL', l: 'Neutre' },
          { k: 'BEARISH', l: 'Bearish' },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f.k
                ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-600/15'
                : 'glass-light text-gray-500 hover:text-gray-300'
            }`}
          >
            {f.l}
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 bg-[#070d1a]/60 border border-white/5 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-blue-500/50 cursor-pointer"
        >
          <option value="rank">Par rang</option>
          <option value="sentiment">Sentiment ↓</option>
          <option value="change24h">24h ↓</option>
          <option value="volume">Volume ↓</option>
        </select>
      </div>
    </div>
  );
}
