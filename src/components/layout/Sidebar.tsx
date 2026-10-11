import React from 'react';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquareDiff,
  BarChart3,
  Search,
  History,
  Trash2,
  HelpCircle,
  Settings,
  ShieldAlert,
  HardDrive,
  LogOut,
  Bell,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigateTo, workspace, user, role, t, canAccessAdmin } = useApp();

  const navItems = [
    { label: t('nav.dashboard'), icon: LayoutDashboard, path: '/app' },
    { label: t('nav.projects'), icon: FolderKanban, path: '/app/projects' },
    { label: t('nav.clients'), icon: Users, path: '/app/clients' },
    { label: t('nav.notifications'), icon: Bell, path: '/app/notifications' },
    { label: t('nav.feedback'), icon: MessageSquareDiff, path: '/app/feedback' },
    { label: t('nav.analytics'), icon: BarChart3, path: '/app/analytics' },
    { label: t('nav.search'), icon: Search, path: '/app/search' },
    { label: t('nav.activity'), icon: History, path: '/app/activity' },
    { label: t('nav.trash'), icon: Trash2, path: '/app/trash' },
    { label: t('nav.help'), icon: HelpCircle, path: '/app/help' },
    { label: t('nav.settings'), icon: Settings, path: '/app/settings' },
  ];

  return (
    <aside className="w-60 bg-[var(--surface)] border-e border-[var(--border)] flex flex-col shrink-0 h-screen sticky top-0 z-30 transition-colors">
      {/* Brand & Workspace Logo */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('/app')}>
          <div className="w-8 h-8 rounded-xl bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-base shadow-sm border border-white">
            P
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-[var(--text)]">{brandConfig.name}</h1>
            <p className="text-[10px] text-[var(--muted)] font-medium truncate max-w-[120px]">{workspace.name}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--canvas)] text-[var(--muted)] uppercase">
          {workspace.planId.replace('plan_', '')}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentRoute === item.path ||
            (item.path !== '/app' && currentRoute.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => navigateTo(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FF5A3C] text-[#0F1A2E] shadow-sm font-bold'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Platform Admin Link if user is admin */}
        {canAccessAdmin && (
          <div className="pt-2 mt-2 border-t border-[var(--border)]">
            <button
              onClick={() => navigateTo('/admin')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentRoute.startsWith('/admin')
                  ? 'bg-[#0F1A2E] text-white shadow-sm font-bold'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{t('nav.admin')}</span>
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Storage & Role Mini Bar */}
      <div className="p-3 border-t border-[var(--border)] space-y-2.5 bg-[var(--surface)]">
        <div className="p-2.5 rounded-xl bg-[var(--canvas)] space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-[var(--muted)] font-medium">
              <HardDrive className="w-3 h-3" />
              Storage
            </span>
            <span className="font-semibold text-[var(--text)]">14 / 250 GB</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF5A3C] w-[6%]" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[var(--muted)] px-1">
          <span>Role: <strong className="capitalize text-[var(--text)]">{role}</strong></span>
          <button
            onClick={() => navigateTo('/')}
            className="text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
};
