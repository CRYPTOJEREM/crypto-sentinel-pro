export default function Disclaimer({ onAccept }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="glass rounded-2xl max-w-lg w-full p-8 animate-fadeInUp shadow-2xl"
        style={{ border: '1px solid rgba(59,130,246,0.2)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg">
            ⚠️
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Avertissement</h2>
            <p className="text-xs text-gray-500 font-medium">Veuillez lire attentivement avant de continuer</p>
          </div>
        </div>

        <div className="space-y-4 mb-6 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-amber-400">Ce site ne constitue en aucun cas un conseil en investissement.</strong>{' '}
            Les informations présentées sur Crypto Sentinel Pro sont fournies à titre purement informatif et éducatif.
          </p>
          <p>
            Les données affichées (indices de sentiment, scores d'opportunité, classements) sont générées à partir
            d'algorithmes propriétaires basés sur des données de marché publiques.{' '}
            <strong className="text-white">Aucune garantie de précision, d'exhaustivité ou de fiabilité</strong> n'est
            offerte.
          </p>
          <p>
            Le marché des cryptomonnaies est{' '}
            <strong className="text-red-400">extrêmement volatil et risqué</strong>. Vous pouvez perdre la totalité de
            votre investissement. Ne prenez jamais de décision financière basée uniquement sur les informations de ce
            site.
          </p>
          <p className="text-xs text-gray-500">
            En poursuivant, vous reconnaissez avoir lu et compris cet avertissement et acceptez que les créateurs de
            Crypto Sentinel Pro ne peuvent être tenus responsables de toute perte financière.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: 'white',
            boxShadow: '0 4px 24px rgba(59,130,246,0.3)',
          }}
        >
          J'AI LU ET J'ACCEPTE LES CONDITIONS
        </button>

        <p className="text-center text-[10px] text-gray-600 mt-3">
          Ce message s'affiche à chaque visite pour votre protection.
        </p>
      </div>
    </div>
  );
}
