export default function Filters({ filter, setFilter, search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-5 p-4 bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
      <div className="relative w-full lg:w-64">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111122] border border-[#2a2a45] rounded-lg pl-9 pr-3 py-2 text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex bg-[#111122] rounded-lg p-0.5 border border-[#2a2a45]">
          {[
            { k: 'ALL', l: 'Tous' },
            { k: 'BULLISH', l: 'Bullish' },
            { k: 'NEUTRAL', l: 'Neutre' },
            { k: 'BEARISH', l: 'Bearish' },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f.k
                  ? 'bg-[#2a2a45] text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 bg-[#111122] border border-[#2a2a45] rounded-lg text-zinc-300 text-xs font-medium focus:outline-none focus:border-zinc-500 cursor-pointer"
        >
          <option value="rank">Par rang</option>
          <option value="sentiment">Sentiment</option>
          <option value="change24h">24h</option>
          <option value="volume">Volume</option>
        </select>
      </div>
    </div>
  );
}
