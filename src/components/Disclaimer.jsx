export default function Disclaimer({ onAccept }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
    >
      <div className="bg-card border border-card-border rounded-xl max-w-lg w-full p-8 animate-fadeInUp">
        <h2 className="text-lg font-semibold text-white mb-1">Avertissement</h2>
        <p className="text-xs text-zinc-500 mb-5">Veuillez lire attentivement avant de continuer</p>

        <div className="space-y-3 mb-6 text-sm text-zinc-400 leading-relaxed">
          <p>
            <strong className="text-amber-400">Ce site ne constitue en aucun cas un conseil en investissement.</strong>{' '}
            Les informations sont fournies à titre informatif et éducatif.
          </p>
          <p>
            Les données affichées sont générées à partir d'algorithmes basés sur des données de marché publiques.{' '}
            <strong className="text-zinc-200">Aucune garantie de précision</strong> n'est offerte.
          </p>
          <p>
            Le marché des cryptomonnaies est{' '}
            <strong className="text-red-400">extrêmement volatil et risqué</strong>. Vous pouvez perdre la totalité de
            votre investissement.
          </p>
          <p className="text-xs text-zinc-600">
            En poursuivant, vous reconnaissez avoir lu et compris cet avertissement.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="w-full py-3 rounded-lg font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-500 text-white"
        >
          J'accepte et je continue
        </button>
      </div>
    </div>
  );
}
