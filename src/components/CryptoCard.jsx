import { useState, memo } from 'react';
import { getSentimentStyle } from '../utils/classifications';
import { computeSentiment, computeFlow } from '../utils/sentiment';
import MiniSparkline from './MiniSparkline';

const CryptoCard = memo(function CryptoCard({ crypto: cr, rank, index }) {
  const [exp, setExp] = useState(false);
  const sent = computeSentiment(cr);
  const st = getSentimentStyle(sent);
  const flow = computeFlow(cr);

  return (
    <div
      className="card card-hover cursor-pointer p-4 animate-fadeInUp"
      style={{ animationDelay: `${Math.min(index * 0.02, 0.4)}s` }}
      onClick={() => setExp(!exp)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono text-zinc-600 w-5 text-right">#{rank}</span>
          {cr.image ? (
            <img src={cr.image} alt={cr.sym} className="w-6 h-6 rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-zinc-400">
              {cr.sym.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-semibold text-zinc-100 text-sm">{cr.sym}</div>
            <div className="text-[10px] text-zinc-600 truncate max-w-[80px]">{cr.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold font-mono text-zinc-100">
            $
            {cr.price < 0.01
              ? cr.price.toFixed(6)
              : cr.price < 1
                ? cr.price.toFixed(4)
                : cr.price < 1000
                  ? cr.price.toFixed(2)
                  : cr.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className={`text-xs font-medium font-mono ${cr.c24 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {cr.c24 >= 0 ? '+' : ''}
            {(cr.c24 || 0).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-zinc-500">Sentiment</span>
          <div className="flex items-center gap-2">
            <MiniSparkline data={cr.sparkline} />
            <span className="font-semibold font-mono" style={{ color: st.color }}>{sent}</span>
          </div>
        </div>
        <div className="relative h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="absolute h-full rounded-full transition-all duration-700" style={{ width: `${sent}%`, backgroundColor: st.color, opacity: 0.7 }} />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-xs font-medium" style={{ color: st.color }}>{st.label}</span>
          {cr.athChange !== 0 && <span className="text-[10px] text-zinc-600 font-mono">ATH: {(cr.athChange || 0).toFixed(0)}%</span>}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs px-3 py-2 bg-zinc-800/50 rounded-lg">
        <span className="text-zinc-500">Trend 7j</span>
        <span className={`font-medium font-mono ${flow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {flow >= 0 ? '+ Hausse' : '- Baisse'} ({flow > 0 ? '+' : ''}{flow}%)
        </span>
      </div>

      {exp && (
        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2 animate-fadeInUp">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{ l: '24H', v: cr.c24 }, { l: '7J', v: cr.c7 }, { l: '30J', v: cr.c30 }].map((x, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-2">
                <div className="text-[9px] text-zinc-600 font-medium uppercase">{x.l}</div>
                <div className={`text-xs font-semibold font-mono ${(x.v || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {(x.v || 0) >= 0 ? '+' : ''}{(x.v || 0).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-zinc-800/50 rounded-lg p-2">
              <div className="text-[9px] text-zinc-600 font-medium uppercase">Market Cap</div>
              <div className="text-zinc-200 font-semibold font-mono">
                ${cr.marketCap > 1e9 ? (cr.marketCap / 1e9).toFixed(1) + 'B' : (cr.marketCap / 1e6).toFixed(0) + 'M'}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-2">
              <div className="text-[9px] text-zinc-600 font-medium uppercase">Volume 24h</div>
              <div className="text-zinc-200 font-semibold font-mono">
                ${cr.volume24h > 1e9 ? (cr.volume24h / 1e9).toFixed(1) + 'B' : (cr.volume24h / 1e6).toFixed(0) + 'M'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CryptoCard;
