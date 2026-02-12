export default function Badge({ children, color, glow }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all"
      style={{
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}25`,
        boxShadow: glow ? `0 0 12px ${color}20` : 'none',
      }}
    >
      {children}
    </span>
  );
}
