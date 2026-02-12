export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="glass rounded-xl p-4 mb-4 border-l-4 border-red-500 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-red-400 text-lg">⚠️</span>
        <span className="text-sm text-gray-300">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600/30 transition-all"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
