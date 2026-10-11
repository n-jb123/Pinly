import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import { Button } from '../../components/common/Button';
import { LanguageSwitch } from '../../components/common/LanguageSwitch';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Server,
  Radio,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const StatusPage: React.FC = () => {
  const { navigateTo, t } = useApp();
  const [lastChecked, setLastChecked] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastChecked(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 400);
  };

  const systems = [
    {
      name: 'Deliverables & Media Canvas',
      desc: 'High-res image, PDF, and video review viewer',
      status: 'operational',
      uptime: '99.99%',
    },
    {
      name: 'Pinned Annotations & Thread Store',
      desc: 'Normalized coordinates, pins, and comments',
      status: 'operational',
      uptime: '99.98%',
    },
    {
      name: 'Live Voice & AI Assistant (Gemini 3.8)',
      desc: 'Real-time conversational review and transcription',
      status: 'operational',
      uptime: '100%',
    },
    {
      name: 'Client Review Link Gateways',
      desc: 'Password gating, email authorization, and portal links',
      status: 'operational',
      uptime: '100%',
    },
    {
      name: 'Approval Certificates & Audit Logs',
      desc: 'Cryptographic sign-offs, timestamps, and export PDFs',
      status: 'operational',
      uptime: '99.99%',
    },
    {
      name: 'Webhooks & Third-Party Notifications',
      desc: 'Slack, Discord, Microsoft Teams, and email delivery',
      status: 'operational',
      uptime: '99.95%',
    },
  ];

  const pastIncidents = [
    {
      date: 'October 8, 2026',
      title: 'Scheduled Maintenance: Canvas rendering pipeline upgrade',
      status: 'Completed',
      desc: 'Successfully performed scheduled database maintenance with zero customer deliverable downtime.',
    },
    {
      date: 'September 24, 2026',
      title: 'Transient latency on PDF page preview generation',
      status: 'Resolved',
      desc: 'Mitigated downstream worker queue congestion. Total recovery within 6 minutes.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            Back to {brandConfig.name}
          </button>

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-xl mx-auto border-2 border-white shadow-sm">
            P
          </div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            {brandConfig.name} Platform Status
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Live uptime, performance metrics, and service availability for Pinly workspaces.
          </p>
        </div>

        {/* Global Operational Banner */}
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                {t('status.allOperational')}
              </h2>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                All cloud clusters and review gateways are operating within normal latencies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] text-[var(--muted)]">Updated: {lastChecked}</span>
            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all cursor-pointer ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Service Components List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            System Components & Services
          </h2>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs divide-y divide-[var(--border)] overflow-hidden">
            {systems.map((item, i) => (
              <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text)]">{item.name}</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)]">{item.desc}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-end">
                  <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">
                    {item.uptime}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Operational
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident History */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Past Incident & Maintenance Log
          </h2>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs divide-y divide-[var(--border)] overflow-hidden">
            {pastIncidents.map((inc, i) => (
              <div key={i} className="p-4 sm:p-5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[var(--text)]">{inc.title}</h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {inc.status}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">{inc.desc}</p>
                <span className="text-[10px] text-[var(--muted)] block pt-1 font-mono">{inc.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigateTo('/app')}
          >
            {t('error.backToApp')}
          </Button>
        </div>
      </div>
    </div>
  );
};
