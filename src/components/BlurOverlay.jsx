export default function BlurOverlay({ locked, onClickUnlock, children }) {
  if (!locked) return children;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)' }}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={onClickUnlock}
          className="bg-[#16162a]/90 border border-[#2a2a45] rounded-2xl px-8 py-5 text-center backdrop-blur-sm hover:border-blue-500/40 transition-all cursor-pointer"
        >
          <svg className="w-8 h-8 text-zinc-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-white font-semibold text-sm mb-1">Contenu réservé</p>
          <p className="text-zinc-400 text-xs mb-3">Connectez-vous pour accéder à toutes les données</p>
          <span className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors">
            Se connecter
          </span>
        </button>
      </div>
    </div>
  );
}
