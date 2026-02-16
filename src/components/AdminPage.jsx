import { useState, useMemo } from 'react';
import { getAllUsers, setUserRole } from '../utils/auth';

const ROLE_COLORS = {
  admin: { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  premium: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  free: { color: '#a1a1aa', bg: 'rgba(161,161,170,0.08)' },
};

export default function AdminPage() {
  const [users, setUsers] = useState(getAllUsers);
  const [search, setSearch] = useState('');
  const [roleChanged, setRoleChanged] = useState(null);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.email.toLowerCase().includes(q) || u.bitunixUid.toLowerCase().includes(q));
  }, [users, search]);

  const stats = useMemo(() => ({
    total: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    premium: users.filter((u) => u.role === 'premium').length,
    free: users.filter((u) => u.role === 'free').length,
    withUid: users.filter((u) => u.bitunixUid).length,
  }), [users]);

  const handleRoleChange = (email, newRole) => {
    setUserRole(email, newRole);
    setUsers(getAllUsers());
    setRoleChanged(email);
    setTimeout(() => setRoleChanged(null), 2000);
  };

  return (
    <div className="animate-fadeInUp max-w-6xl mx-auto space-y-8">

      <div className="text-center pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs font-medium text-red-400">Admin uniquement</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard Admin</h2>
        <p className="text-base text-zinc-500">Gestion des utilisateurs et statistiques.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: '#60a5fa' },
          { label: 'Admin', value: stats.admin, color: '#f87171' },
          { label: 'Premium', value: stats.premium, color: '#60a5fa' },
          { label: 'Free', value: stats.free, color: '#a1a1aa' },
          { label: 'Avec UID', value: stats.withUid, color: '#34d399' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.05] p-5 text-center" style={{ background: 'rgba(22,22,42,0.5)' }}>
            <p className="text-3xl font-bold font-mono mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="rounded-3xl border border-white/[0.06] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <div className="px-8 pt-8 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-white">Utilisateurs ({filteredUsers.length})</h3>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher email ou UID..."
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-300 w-64 focus:outline-none focus:border-white/[0.12] transition-colors placeholder-zinc-700"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-b border-white/[0.04] text-zinc-600 uppercase text-[11px] tracking-wider">
                <th className="text-left py-4 px-8 font-medium">Email</th>
                <th className="text-center py-4 px-4 font-medium">Role</th>
                <th className="text-left py-4 px-4 font-medium">Bitunix UID</th>
                <th className="text-left py-4 px-4 font-medium">Inscription</th>
                <th className="text-center py-4 px-8 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const rc = ROLE_COLORS[u.role] || ROLE_COLORS.free;
                return (
                  <tr key={u.email} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-8">
                      <span className="text-sm text-zinc-200 font-mono">{u.email}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold" style={{ color: rc.color, backgroundColor: rc.bg }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-mono text-zinc-400">
                        {u.bitunixUid || <span className="text-zinc-700">—</span>}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-zinc-500 font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-center">
                      {roleChanged === u.email ? (
                        <span className="text-xs text-emerald-400 font-medium">Mis à jour !</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.email, e.target.value)}
                          className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-white/[0.12] appearance-none cursor-pointer"
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-zinc-600">Aucun utilisateur trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
