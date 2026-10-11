import React, { ReactNode } from 'react';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import {
  ShieldAlert,
  Users,
  Building,
  CreditCard,
  LifeBuoy,
  History,
  Megaphone,
  FileText,
  Sliders,
  ArrowLeft,
  Lock,
  LogOut,
} from 'lucide-react';
import { ToastContainer } from '../common/Toast';
import { QAPanel } from '../common/QAPanel';
import { VoiceConversationModal } from '../common/VoiceConversationModal';

export const AdminShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentRoute, navigateTo, openVoiceAssistant, setOpenVoiceAssistant } = useApp();

  const adminNav = [
    { label: 'Overview', icon: ShieldAlert, path: '/admin' },
    { label: 'Workspaces', icon: Building, path: '/admin/workspaces' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Plans & Limits', icon: Sliders, path: '/admin/plans' },
    { label: 'Revenue & Billing', icon: CreditCard, path: '/admin/billing' },
    { label: 'Support Inbox', icon: LifeBuoy, path: '/admin/support' },
    { label: 'Audit Log (Originals)', icon: History, path: '/admin/audit' },
    { label: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
    { label: 'Content & Legal', icon: FileText, path: '/admin/content' },
    { label: 'Platform Settings', icon: Sliders, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0F1A2E] text-white flex flex-col shrink-0 h-screen sticky top-0 z-30 border-e border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">{brandConfig.name} Admin</h2>
              <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                <Lock className="w-2.5 h-2.5" /> 2FA Enforced
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => navigateTo('/app')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Freelancer App
          </button>
        </div>
      </aside>

      {/* Admin Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Platform Admin Console
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            <span>Root SuperAdmin</span>
            <button
              onClick={() => navigateTo('/app')}
              className="text-xs text-[#FF5A3C] font-semibold hover:underline cursor-pointer"
            >
              Exit Console
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      <ToastContainer />
      <QAPanel />
      <VoiceConversationModal
        isOpen={openVoiceAssistant}
        onClose={() => setOpenVoiceAssistant(false)}
      />
    </div>
  );
};
