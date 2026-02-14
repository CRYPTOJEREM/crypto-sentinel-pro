export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-3 mb-4 flex items-center justify-between border-l-2 border-red-500">
      <span className="text-sm text-zinc-400">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-surface text-zinc-300 rounded-lg text-xs font-medium hover:bg-card-border transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
