import { useState } from 'react';
import { getAlertSettings, saveAlertSettings, getAlertHistory, testNotification } from '../utils/alerts';

export default function AlertSettings() {
  const [settings, setSettings] = useState(getAlertSettings);
  const [testResult, setTestResult] = useState(null);
  const history = getAlertHistory().slice(-5).reverse();

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveAlertSettings(next);
  };

  const handleTest = async () => {
    const ok = await testNotification();
    setTestResult(ok ? 'ok' : 'blocked');
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#222238] animate-fadeInUp space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-400">Alertes</h3>
        <button
          onClick={() => update('enabled', !settings.enabled)}
          className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${
            settings.enabled ? 'bg-blue-600' : 'bg-zinc-700'
          }`}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
            settings.enabled ? 'left-[18px]' : 'left-0.5'
          }`} />
        </button>
      </div>

      {settings.enabled && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 font-medium uppercase block mb-1">Seuil achat</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={settings.buyThreshold}
                  onChange={(e) => update('buyThreshold', parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1"
                />
                <span className="text-xs font-mono text-emerald-400 w-6 text-right">{settings.buyThreshold}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 font-medium uppercase block mb-1">Seuil prudence</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={settings.sellThreshold}
                  onChange={(e) => update('sellThreshold', parseInt(e.target.value))}
                  className="flex-1 accent-red-500 h-1"
                />
                <span className="text-xs font-mono text-red-400 w-6 text-right">{settings.sellThreshold}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleTest}
            className="text-[11px] text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Tester les notifications
            {testResult === 'ok' && <span className="text-emerald-400 ml-1">OK</span>}
            {testResult === 'blocked' && <span className="text-red-400 ml-1">Bloquées</span>}
          </button>

          {history.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 font-medium uppercase mb-1.5">Dernières alertes</p>
              <div className="space-y-1">
                {history.map((a, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${a.type === 'buy' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-zinc-400">{a.type === 'buy' ? 'Achat' : 'Prudence'}</span>
                      <span className="font-mono text-zinc-300">{a.score}</span>
                    </div>
                    <span className="text-zinc-600 font-mono">
                      {new Date(a.ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
