export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="card p-3 mb-4 flex items-center justify-between border-l-2 border-red-500">
      <span className="text-sm text-zinc-400">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-700 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
