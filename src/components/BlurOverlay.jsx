export default function BlurOverlay({ locked, isLoggedIn, onClickUnlock, onClickPricing, children }) {
  if (!locked) return children;

  const isFreeUser = isLoggedIn && locked;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)' }}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={isFreeUser ? onClickPricing : onClickUnlock}
          className="bg-[#16162a]/90 border border-[#2a2a45] rounded-2xl px-8 py-5 text-center backdrop-blur-sm hover:border-blue-500/40 transition-all cursor-pointer"
        >
          <svg className="w-8 h-8 text-zinc-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isFreeUser ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            )}
          </svg>
          <p className="text-white font-semibold text-sm mb-1">
            {isFreeUser ? 'Fonctionnalité Pro' : 'Contenu réservé'}
          </p>
          <p className="text-zinc-400 text-xs mb-3">
            {isFreeUser ? 'Passez à Pro pour débloquer toutes les données' : 'Connectez-vous pour commencer'}
          </p>
          <span className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors">
            {isFreeUser ? 'Voir les tarifs' : 'Se connecter'}
          </span>
        </button>
      </div>
    </div>
  );
}
