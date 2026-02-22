import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const SECTIONS = [
  {
    id: 'fng',
    title: 'Fear & Greed Index',
    subtitle: 'Le thermomètre émotionnel du marché',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: '#f59e0b',
    blocks: [
      {
        type: 'text',
        content: "Cet indice mesure le sentiment global du marché crypto sur une échelle de 0 à 100. Il capte l'état émotionnel des investisseurs : peur ou avidité.",
      },
      {
        type: 'scale',
        items: [
          { range: '0 - 25', label: 'Peur extrême', color: '#ef4444', desc: 'Le marché panique. Historiquement, souvent un bon moment pour accumuler.' },
          { range: '25 - 45', label: 'Peur', color: '#f97316', desc: 'Incertitude dominante, les investisseurs hésitent.' },
          { range: '45 - 55', label: 'Neutre', color: '#eab308', desc: "Pas de sentiment fort dans un sens ou l'autre." },
          { range: '55 - 75', label: 'Avidité', color: '#84cc16', desc: "L'optimisme revient, attention à l'excès." },
          { range: '75 - 100', label: 'Avidité extrême', color: '#22c55e', desc: 'Euphorie. Les corrections suivent souvent ces niveaux.' },
        ],
      },
      {
        type: 'tip',
        content: 'La courbe historique superpose le prix du BTC pour visualiser la corrélation. Changez la période (30j, 1 an, Tout) pour prendre du recul.',
      },
    ],
  },
  {
    id: 'opp',
    title: "Indice d'Opportunité",
    subtitle: 'Notre score propriétaire',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: '#3b82f6',
    blocks: [
      {
        type: 'text',
        content: "Un score composite (0-100) calculé par notre algorithme propriétaire. Il synthétise 8 facteurs d'analyse en un seul chiffre pour vous aider à lire le marché en un coup d'oeil.",
      },
      {
        type: 'zones',
        items: [
          { min: 70, max: 100, label: 'Zone favorable', color: '#22c55e', icon: '↗', desc: 'Les conditions de marché sont réunies. Signal positif.' },
          { min: 40, max: 70, label: 'Zone neutre', color: '#eab308', icon: '→', desc: "Pas de signal clair. Patience et observation." },
          { min: 0, max: 40, label: 'Zone prudence', color: '#ef4444', icon: '↘', desc: 'Conditions défavorables. Prudence recommandée.' },
        ],
      },
      {
        type: 'highlight',
        content: "L'algorithme est calibré automatiquement sur 2 ans de données historiques. Chaque facteur est pondéré pour maximiser la pertinence du signal.",
      },
      {
        type: 'tip',
        content: "Ce score ne prédit pas le futur. C'est un outil de lecture rapide qui vous fait gagner du temps d'analyse. Vos décisions restent les vôtres.",
      },
    ],
  },
  {
    id: 'cards',
    title: 'Cartes Crypto',
    subtitle: 'Analyse individuelle',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    color: '#8b5cf6',
    blocks: [
      {
        type: 'text',
        content: "Chaque crypto a son score de sentiment calculé par notre algo. La barre de progression et la couleur indiquent la phase actuelle.",
      },
      {
        type: 'phases',
        items: [
          { label: 'Bullish', range: '> 60', color: '#22c55e', desc: 'Phase haussière confirmée par plusieurs signaux.' },
          { label: 'Neutre', range: '40 - 60', color: '#eab308', desc: "Phase d'attente. Le marché hésite." },
          { label: 'Bearish', range: '< 40', color: '#ef4444', desc: 'Phase baissière. Pression vendeuse dominante.' },
        ],
      },
      {
        type: 'tip',
        content: "Cliquez sur une carte pour voir les variations détaillées (24h, 7j, 30j), le market cap et le volume.",
      },
    ],
  },
  {
    id: 'scanner',
    title: 'Scanner Bitunix',
    subtitle: 'Tableau de signaux en temps réel',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    color: '#06b6d4',
    blocks: [
      {
        type: 'text',
        content: "Le scanner analyse les 210+ paires disponibles sur Bitunix Perpetual Futures et attribue un verdict à chacune en combinant nos indicateurs propriétaires.",
      },
      {
        type: 'signals',
        items: [
          { label: 'ACHAT FORT', color: '#34d399', desc: 'Convergence de signaux positifs.' },
          { label: 'BULLISH', color: '#4ade80', desc: 'Tendance haussière identifiée.' },
          { label: 'NEUTRE', color: '#fbbf24', desc: 'Pas de signal directionnel.' },
          { label: 'PRUDENCE', color: '#f87171', desc: 'Conditions de surachat détectées.' },
        ],
      },
      {
        type: 'tip',
        content: "Utilisez les filtres et le tri pour identifier rapidement les opportunités qui correspondent à votre stratégie.",
      },
    ],
  },
  {
    id: 'alerts',
    title: 'Alertes & Notifications',
    subtitle: 'Ne manquez aucun signal',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    color: '#ec4899',
    blocks: [
      {
        type: 'text',
        content: "Recevez des alertes quand le score franchit vos seuils. Configurez les seuils d'achat et de prudence selon votre tolérance au risque.",
      },
      {
        type: 'features',
        items: [
          { icon: '🔔', title: 'Notifications browser', desc: 'Alertes instantanées même quand l\'onglet est en arrière-plan.' },
          { icon: '📱', title: 'Telegram Bot', desc: 'Recevez les alertes directement sur votre téléphone via Telegram.' },
          { icon: '📊', title: 'Historique', desc: 'Retrouvez toutes vos alertes passées dans l\'onglet Indicateur.' },
        ],
      },
    ],
  },
  {
    id: 'limits',
    title: 'Limites & Avertissement',
    subtitle: 'A lire impérativement',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: '#f59e0b',
    blocks: [
      {
        type: 'warning',
        content: "Cet outil est informatif uniquement. Les scores et indicateurs sont des estimations algorithmiques, pas des conseils financiers.",
      },
      {
        type: 'text',
        content: "Les données sont rafraîchies automatiquement toutes les 2 minutes. Un cache local conserve les dernières données en cas de coupure réseau.",
      },
      {
        type: 'warning',
        content: "Le marché des cryptomonnaies est extrêmement volatil. Vous pouvez perdre la totalité de votre investissement. N'investissez que ce que vous pouvez vous permettre de perdre.",
      },
    ],
  },
];

function ScaleBlock({ items }) {
  return (
    <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-white/[0.04]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.03] last:border-0" style={{ background: item.color + '08' }}>
          <div className="shrink-0 w-16 text-center">
            <span className="text-[11px] font-mono font-bold" style={{ color: item.color }}>{item.range}</span>
          </div>
          <div className="shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-zinc-200">{item.label}</span>
            <span className="text-sm text-zinc-500 ml-2">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ZonesBlock({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((z, i) => (
        <div key={i} className="rounded-xl border p-4 text-center" style={{ borderColor: z.color + '20', background: z.color + '08' }}>
          <div className="text-2xl mb-1">{z.icon}</div>
          <div className="text-sm font-bold mb-0.5" style={{ color: z.color }}>{z.label}</div>
          <div className="text-[11px] font-mono text-zinc-500 mb-2">{z.min} - {z.max}</div>
          <p className="text-xs text-zinc-500 leading-relaxed">{z.desc}</p>
        </div>
      ))}
    </div>
  );
}

function PhasesBlock({ items }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((p, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.04] px-4 py-3" style={{ background: p.color + '06' }}>
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <div className="flex items-center gap-2 min-w-[100px]">
            <span className="text-sm font-semibold" style={{ color: p.color }}>{p.label}</span>
            <span className="text-[10px] font-mono text-zinc-600">{p.range}</span>
          </div>
          <span className="text-sm text-zinc-500">{p.desc}</span>
        </div>
      ))}
    </div>
  );
}

function SignalsBlock({ items }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map((s, i) => (
        <div key={i} className="rounded-xl border p-3 text-center" style={{ borderColor: s.color + '15', background: s.color + '08' }}>
          <div className="text-xs font-bold mb-1" style={{ color: s.color }}>{s.label}</div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

function FeaturesBlock({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-xl border border-white/[0.04] p-4 bg-white/[0.015]">
          <div className="text-xl mb-2">{f.icon}</div>
          <div className="text-sm font-semibold text-zinc-200 mb-1">{f.title}</div>
          <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'text') {
    return <p className="text-sm text-zinc-400 leading-relaxed">{block.content}</p>;
  }
  if (block.type === 'tip') {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/10 px-4 py-3">
        <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-300/80 leading-relaxed">{block.content}</p>
      </div>
    );
  }
  if (block.type === 'warning') {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/10 px-4 py-3">
        <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-amber-300/80 leading-relaxed">{block.content}</p>
      </div>
    );
  }
  if (block.type === 'highlight') {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/10 px-4 py-3">
        <svg className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <p className="text-sm text-violet-300/80 leading-relaxed">{block.content}</p>
      </div>
    );
  }
  if (block.type === 'scale') return <ScaleBlock items={block.items} />;
  if (block.type === 'zones') return <ZonesBlock items={block.items} />;
  if (block.type === 'phases') return <PhasesBlock items={block.items} />;
  if (block.type === 'signals') return <SignalsBlock items={block.items} />;
  if (block.type === 'features') return <FeaturesBlock items={block.items} />;
  return null;
}

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="animate-fadeInUp max-w-4xl mx-auto">
      <div className="text-center pt-6 pb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Guide d'utilisation</h2>
        <p className="text-base text-zinc-500 max-w-xl mx-auto leading-relaxed">
          Tout ce qu'il faut savoir pour utiliser Crypto Sentinel Pro efficacement.
        </p>
      </div>

      {/* Navigation rapide */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSection(activeSection === s.id ? null : s.id);
              document.getElementById(`guide-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all border"
            style={{
              borderColor: activeSection === s.id ? s.color + '40' : 'rgba(255,255,255,0.05)',
              backgroundColor: activeSection === s.id ? s.color + '10' : 'rgba(255,255,255,0.02)',
              color: activeSection === s.id ? s.color : '#a1a1aa',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {SECTIONS.map((section, i) => (
          <ScrollReveal key={section.id} delay={i * 60}>
            <div
              id={`guide-${section.id}`}
              className="card-hover rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: 'linear-gradient(180deg, rgba(22,22,42,0.6) 0%, rgba(16,16,30,0.8) 100%)' }}
            >
              {/* Header */}
              <button
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: section.color + '12', color: section.color }}
                >
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">{section.title}</h3>
                  <p className="text-xs text-zinc-500">{section.subtitle}</p>
                </div>
                <svg
                  className="w-4 h-4 text-zinc-500 transition-transform duration-300 shrink-0"
                  style={{ transform: activeSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Content */}
              {activeSection === section.id && (
                <div className="px-5 pb-5 space-y-4 animate-scaleIn">
                  <div className="border-t border-white/[0.04] pt-4 space-y-4">
                    {section.blocks.map((block, j) => (
                      <ContentBlock key={j} block={block} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
