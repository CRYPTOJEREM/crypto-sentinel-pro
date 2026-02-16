import { useEffect } from 'react';

export default function AlertBanner({ alert, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!alert) return null;

  const isPhase = alert.type === 'phase_up' || alert.type === 'phase_down';
  const isPositive = alert.type === 'buy' || alert.type === 'phase_up';

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-fadeInUp ${
      isPositive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
    } border rounded-2xl p-4 backdrop-blur-md`}>
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">{isPositive ? '↗' : '↘'}</span>
        <div className="flex-1">
          {isPhase ? (
            <>
              <p className="text-sm font-semibold text-white">
                {alert.sym} — {alert.to}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Passe de <span className="font-semibold">{alert.from}</span> a <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{alert.to}</span>
              </p>
              {alert.count > 1 && (
                <p className="text-[10px] text-zinc-500 mt-1">+{alert.count - 1} autre{alert.count > 2 ? 's' : ''} changement{alert.count > 2 ? 's' : ''}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-white">
                {isPositive ? "Zone d'achat detectee" : 'Zone de prudence'}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Indice d'Opportunite : <span className={`font-mono font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{alert.score}</span>/100
              </p>
            </>
          )}
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none shrink-0">
          &times;
        </button>
      </div>
    </div>
  );
}
