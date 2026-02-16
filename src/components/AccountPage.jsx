import { useState } from 'react';
import { updateBitunixUid } from '../utils/auth';

const ROLE_LABELS = {
  admin: { label: 'Administrateur', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  premium: { label: 'Pro', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  free: { label: 'Gratuit', color: '#a1a1aa', bg: 'rgba(161,161,170,0.08)' },
};

export default function AccountPage({ user, onUpdateUser, onLogout, onGoAdmin }) {
  const [uid, setUid] = useState(user?.bitunixUid || '');
  const [saved, setSaved] = useState(false);

  const role = ROLE_LABELS[user?.role] || ROLE_LABELS.free;

  const handleSaveUid = () => {
    if (!user) return;
    updateBitunixUid(user.email, uid);
    onUpdateUser({ ...user, bitunixUid: uid.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fadeInUp max-w-3xl mx-auto space-y-8">

      <div className="text-center pt-6 pb-2">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Mon compte</h2>
        <p className="text-base text-zinc-500">Gerez votre profil et vos preferences.</p>
      </div>

      {/* Profil */}
      <div className="rounded-3xl border border-white/[0.06] p-8" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <h3 className="text-lg font-semibold text-white mb-6">Profil</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">Email</p>
              <p className="text-base text-white font-mono">{user?.email}</p>
            </div>
            <span className="px-4 py-1.5 rounded-xl text-sm font-semibold" style={{ color: role.color, backgroundColor: role.bg }}>
              {role.label}
            </span>
          </div>

          <div className="border-t border-white/[0.04] pt-6">
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">Membre depuis</p>
            <p className="text-sm text-zinc-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non disponible'}
            </p>
          </div>
        </div>
      </div>

      {/* Bitunix UID */}
      <div className="rounded-3xl border border-white/[0.06] p-8" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <h3 className="text-lg font-semibold text-white mb-2">Bitunix UID</h3>
        <p className="text-sm text-zinc-500 mb-6">Associez votre compte Bitunix pour un suivi personnalise.</p>

        <div className="flex gap-3">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Votre UID Bitunix"
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white/[0.12] transition-colors font-mono"
          />
          <button
            onClick={handleSaveUid}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-300"
          >
            {saved ? 'Enregistre !' : 'Enregistrer'}
          </button>
        </div>

        {user?.bitunixUid && (
          <p className="text-xs text-zinc-600 mt-3">
            UID actuel : <span className="text-zinc-400 font-mono">{user.bitunixUid}</span>
          </p>
        )}
      </div>

      {/* Abonnement */}
      <div className="rounded-3xl border border-white/[0.06] p-8" style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}>
        <h3 className="text-lg font-semibold text-white mb-2">Abonnement</h3>
        <p className="text-sm text-zinc-500 mb-6">Votre plan actuel et ses avantages.</p>

        <div className="rounded-2xl border border-white/[0.04] p-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xl font-bold text-white">Plan {role.label}</p>
              <p className="text-sm text-zinc-500 mt-1">
                {user?.role === 'admin' ? 'Acces complet + administration' : user?.role === 'premium' ? 'Acces a toutes les fonctionnalites' : 'Fonctionnalites de base'}
              </p>
            </div>
            <span className="text-2xl font-bold font-mono" style={{ color: role.color }}>
              {user?.role === 'free' ? '0€' : user?.role === 'admin' ? '∞' : '9.99€'}
            </span>
          </div>

          <div className="space-y-2">
            {[
              { text: 'Fear & Greed Index', ok: true },
              { text: 'Graphique historique', ok: true },
              { text: 'Indice d\'Opportunite', ok: user?.role !== 'free' },
              { text: 'Scanner Radar (210+ paires)', ok: user?.role !== 'free' },
              { text: 'Alertes configurables', ok: user?.role !== 'free' },
              { text: '200+ cryptos detaillees', ok: user?.role !== 'free' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <svg className={`w-4 h-4 shrink-0 ${f.ok ? 'text-emerald-400' : 'text-zinc-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {f.ok
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  }
                </svg>
                <span className={`text-sm ${f.ok ? 'text-zinc-300' : 'text-zinc-700'}`}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin access */}
      {user?.role === 'admin' && (
        <div className="rounded-3xl border border-red-500/15 p-8" style={{ background: 'linear-gradient(180deg, rgba(248,113,113,0.03) 0%, rgba(16,16,30,0.8) 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Administration</h3>
              <p className="text-sm text-zinc-500">Gerez les utilisateurs et leurs roles.</p>
            </div>
            <button
              onClick={onGoAdmin}
              className="px-6 py-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl transition-all duration-300"
            >
              Dashboard Admin
            </button>
          </div>
        </div>
      )}

      {/* Deconnexion */}
      <div className="text-center pb-8">
        <button
          onClick={onLogout}
          className="px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-white text-sm font-medium rounded-xl transition-all duration-300"
        >
          Se deconnecter
        </button>
      </div>
    </div>
  );
}
