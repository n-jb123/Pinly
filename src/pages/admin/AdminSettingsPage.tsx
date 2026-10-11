import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { Sliders, CheckCircle2, Shield, CreditCard, Camera } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast, qaLoading, qaError } = useApp();
  const [platformName, setPlatformName] = useState('Pinly');
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'lemon_squeezy' | 'paddle'>('stripe');
  const [screenshotProvider, setScreenshotProvider] = useState('ScreenshotOne');

  const handleTestConnection = (service: string) => {
    showToast(`Test ping to ${service} returned 200 OK`, 'success');
  };

  const handleSave = () => {
    showToast('Platform environment configuration saved', 'success');
  };

  if (qaLoading) {
    return <PageSkeleton />;
  }

  if (qaError) {
    return <ErrorState onRetry={() => showToast('Refreshed settings', 'info')} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Platform System Settings</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Configure swappable payment adapters, screenshot API keys, and turnkey buyer whitelabel parameters.
          </p>
        </div>
        <Button size="sm" variant="primary" onClick={handleSave}>
          Save Platform Settings
        </Button>
      </div>

      <div className="space-y-6">
        {/* Whitelabel Global Parameters */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[var(--text)]">Turnkey Brand Settings</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Primary Coral Accent</label>
              <input
                type="text"
                defaultValue="#FF5A3C"
                className="w-full text-xs p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Swappable Payment Provider Adapter */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#FF5A3C]" />
              Swappable Payment Gateway Adapter
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
              Adapter Pattern
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'stripe', label: 'Stripe (Default)' },
              { id: 'lemon_squeezy', label: 'Lemon Squeezy' },
              { id: 'paddle', label: 'Paddle' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaymentProvider(p.id as any)}
                className={`p-3.5 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                  paymentProvider === p.id
                    ? 'border-[#FF5A3C] bg-[#FF5A3C]/10 text-[#0F1A2E] dark:text-white'
                    : 'border-[var(--border)] text-[var(--muted)] hover:bg-[var(--canvas)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
                {paymentProvider.toUpperCase()} Secret Key (Masked)
              </label>
              <input
                type="password"
                defaultValue="sk_live_51M0000000000000000000000000"
                className="w-full text-xs p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-mono"
              />
            </div>
            <Button size="sm" variant="outline" onClick={() => handleTestConnection(paymentProvider)}>
              Test Payment Adapter Connection
            </Button>
          </div>
        </div>

        {/* Website Screenshot Capture Adapter */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#FF5A3C]" />
              Website Screenshot Capture Service Adapter
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
              External API
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1">API Key / Secret</label>
              <input
                type="password"
                defaultValue="scr_live_key_99482019482"
                className="w-full text-xs p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-mono"
              />
            </div>
            <Button size="sm" variant="outline" onClick={() => handleTestConnection('Screenshot Engine')}>
              Test Capture Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
