import React from 'react';
import { useApp } from '../../data/context';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitch } from '../common/LanguageSwitch';
import { brandConfig } from '../../config/brand';
import { Search, AlertOctagon, Sparkles, Radio } from 'lucide-react';

export const Header: React.FC<{ onMenuToggle?: () => void }> = () => {
  const { user, workspace, qaFrozenAccount, navigateTo, setOpenVoiceAssistant } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] transition-colors">
      {/* Frozen Account Warning Banner */}
      {qaFrozenAccount && (
        <div className="bg-amber-500 text-[#0F1A2E] px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>Your workspace account is currently frozen (read-only). Export your data or upgrade to continue revisions.</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        {/* Left: Search input */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full hidden sm:block">
            <Search className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              onClick={() => navigateTo('/app/search')}
              placeholder="Search projects, clients, annotations, files..."
              className="w-full ps-9 pe-4 py-1.5 text-xs rounded-xl bg-[var(--canvas)] border border-transparent focus:border-[var(--border)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right tools: Voice Assistant, Language, Theme, Notifications, User */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Live Voice Assistant Trigger */}
          <button
            onClick={() => setOpenVoiceAssistant(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5A3C]/10 text-[#FF5A3C] hover:bg-[#FF5A3C]/20 transition-colors cursor-pointer"
            title="Open Live Voice Review Assistant (Gemini 3.8 Live API)"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#FF5A3C]" />
            <span className="hidden md:inline">Voice Assistant</span>
          </button>

          <LanguageSwitch />
          <ThemeToggle />
          <NotificationBell />

          {/* User profile dropdown trigger */}
          <div
            onClick={() => navigateTo('/app/settings')}
            className="flex items-center gap-2 ps-2 border-s border-[var(--border)] cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#FF5A3C] text-[#0F1A2E] font-bold text-xs flex items-center justify-center overflow-hidden border border-white">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="hidden lg:block text-start">
              <p className="text-xs font-bold leading-tight text-[var(--text)]">{user.name}</p>
              <p className="text-[10px] text-[var(--muted)] leading-tight">{workspace.name}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
