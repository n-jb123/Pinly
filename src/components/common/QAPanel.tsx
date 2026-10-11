import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { Settings, X, Globe, Moon, Sun, Shield, Lock, AlertTriangle, Layers, RefreshCw, Radio } from 'lucide-react';
import { Role } from '../../data/types';

export const QAPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    role,
    setRole,
    qaEmpty,
    setQaEmpty,
    qaError,
    setQaError,
    qaLoading,
    setQaLoading,
    qaWebsiteBlocked,
    setQaWebsiteBlocked,
    qaFrozenAccount,
    setQaFrozenAccount,
    currentRoute,
    navigateTo,
    workspace,
    setOpenVoiceAssistant,
  } = useApp();

  return (
    <>
      {/* Floating QA trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open QA Simulation Panel"
        className="fixed bottom-4 start-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0F1A2E] text-white shadow-xl hover:bg-slate-800 transition-all cursor-pointer border border-white/20 text-xs font-semibold"
      >
        <Settings className="w-3.5 h-3.5 text-[#FF5A3C]" />
        <span>QA Inspector</span>
      </button>

      {/* Floating Drawer / Card */}
      {isOpen && (
        <div className="fixed bottom-16 start-4 z-50 w-80 max-h-[85vh] overflow-y-auto bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200 text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="font-bold text-sm">QA Simulation Console</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Quick Voice Assistant Trigger */}
            <div className="p-2.5 rounded-xl bg-[#FF5A3C]/10 border border-[#FF5A3C]/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#FF5A3C] flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  Live Voice Assistant
                </p>
                <p className="text-[10px] text-[var(--muted)]">Gemini 3.8 Live API dialog</p>
              </div>
              <button
                onClick={() => setOpenVoiceAssistant(true)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FF5A3C] text-[#0F1A2E] cursor-pointer"
              >
                Launch
              </button>
            </div>

            {/* Quick Page Jump */}
            <div>
              <label className="font-semibold block mb-1 text-[var(--muted)]">Jump to Screen</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Freelancer Dashboard', path: '/app' },
                  { label: 'Work Review Workspace', path: '/app/projects/proj_website_redesign/works/work_landing_page' },
                  { label: 'Client Review (/r/)', path: '/r/apex-redesign-2026' },
                  { label: 'Review Password Gate', path: '/r/spark-ui-8492/gate' },
                  { label: 'Approval Verification', path: '/r/apex-redesign-2026/verify' },
                  { label: 'Link Unavailable Page', path: '/r/expired/unavailable' },
                  { label: 'Client Portal', path: '/portal' },
                  { label: 'Landing Page', path: '/' },
                  { label: 'Admin Workspaces', path: '/admin/workspaces' },
                  { label: 'Admin Users & Impersonate', path: '/admin/users' },
                  { label: 'Admin Billing & Ledger', path: '/admin/billing' },
                  { label: 'Admin Announcements', path: '/admin/announcements' },
                  { label: 'Admin Plans & Limits', path: '/admin/plans' },
                  { label: 'Admin Audit Log (Originals)', path: '/admin/audit' },
                  { label: 'Settings: Profile', path: '/app/settings/profile' },
                  { label: 'Settings: Billing', path: '/app/settings/billing' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigateTo(item.path);
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1.5 text-[11px] rounded-lg border text-start truncate transition-colors cursor-pointer ${
                      currentRoute === item.path
                        ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold border-[#FF5A3C]'
                        : 'border-[var(--border)] hover:bg-[var(--canvas)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Theme */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1 text-[var(--muted)]">Language</label>
                <button
                  onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                  className="w-full py-1.5 px-2 rounded-lg border border-[var(--border)] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[var(--canvas)]"
                >
                  <Globe className="w-3.5 h-3.5 text-[#FF5A3C]" />
                  <span>{locale === 'en' ? 'English (LTR)' : 'العربية (RTL)'}</span>
                </button>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-[var(--muted)]">Theme</label>
                <button
                  onClick={toggleTheme}
                  className="w-full py-1.5 px-2 rounded-lg border border-[var(--border)] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[var(--canvas)]"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span className="capitalize">{theme}</span>
                </button>
              </div>
            </div>

            {/* Role Simulation */}
            <div>
              <label className="font-semibold block mb-1 text-[var(--muted)]">Simulate User Role</label>
              <div className="grid grid-cols-4 gap-1">
                {(['owner', 'member', 'client', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-1 rounded-lg text-center font-medium capitalize border transition-colors cursor-pointer text-[11px] ${
                      role === r
                        ? 'bg-[#0F1A2E] text-white border-[#0F1A2E]'
                        : 'border-[var(--border)] hover:bg-[var(--canvas)]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* State Toggles (Standard States) */}
            <div className="space-y-1.5 pt-1">
              <label className="font-semibold block text-[var(--muted)]">State Overrides</label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--canvas)] cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Simulate Empty State
                </span>
                <input
                  type="checkbox"
                  checked={qaEmpty}
                  onChange={(e) => setQaEmpty(e.target.checked)}
                  className="rounded text-[#FF5A3C] focus:ring-[#FF5A3C]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--canvas)] cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  Simulate Network Error
                </span>
                <input
                  type="checkbox"
                  checked={qaError}
                  onChange={(e) => setQaError(e.target.checked)}
                  className="rounded text-[#FF5A3C] focus:ring-[#FF5A3C]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--canvas)] cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  Simulate Frozen Account
                </span>
                <input
                  type="checkbox"
                  checked={qaFrozenAccount}
                  onChange={(e) => setQaFrozenAccount(e.target.checked)}
                  className="rounded text-[#FF5A3C] focus:ring-[#FF5A3C]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--canvas)] cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-500" />
                  Website Live Blocked (Fallback)
                </span>
                <input
                  type="checkbox"
                  checked={qaWebsiteBlocked}
                  onChange={(e) => setQaWebsiteBlocked(e.target.checked)}
                  className="rounded text-[#FF5A3C] focus:ring-[#FF5A3C]"
                />
              </label>
            </div>

            {/* Current Workspace Info */}
            <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--muted)] flex justify-between">
              <span>{workspace.name}</span>
              <span className="font-semibold uppercase">{workspace.planId.replace('plan_', '')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
