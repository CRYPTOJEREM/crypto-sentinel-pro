export default function StatChip({ label, value, color }) {
  return (
    <div
      className="px-4 py-2.5 rounded-xl text-center transition-all"
      style={{ backgroundColor: `${color}08`, border: `1px solid ${color}15` }}
    >
      <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color }}>{label}</div>
      <div className="text-2xl font-black text-white mt-0.5 font-mono">{value}</div>
    </div>
  );
}
