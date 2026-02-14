export default function Badge({ children, color }) {
  return (
    <span className="text-xs font-medium" style={{ color }}>
      {children}
    </span>
  );
}
