export default function Loader({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-[#3f3f46] border-t-zinc-400 rounded-full animate-spin" />
      <p className="text-zinc-500 text-sm">{text || 'Chargement...'}</p>
    </div>
  );
}
