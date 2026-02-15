export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-[#16162a] border border-[#2a2a45]/80 rounded-2xl p-3 mb-4 flex items-center justify-between border-l-2 border-l-red-500">
      <span className="text-sm text-zinc-400">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-[#111122] text-zinc-300 rounded-lg text-xs font-medium hover:bg-[#2a2a45] transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
