import { useEffect } from 'react';

export default function AlertBanner({ alert, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!alert) return null;

  const isBuy = alert.type === 'buy';

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-fadeInUp ${
      isBuy ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
    } border rounded-2xl p-4 backdrop-blur-md`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{isBuy ? '🟢' : '🔴'}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">
            {isBuy ? "Zone d'achat détectée" : 'Zone de prudence'}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">
            Indice d'Opportunité : <span className={`font-mono font-semibold ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>{alert.score}</span>/100
          </p>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none shrink-0">
          &times;
        </button>
      </div>
    </div>
  );
}
