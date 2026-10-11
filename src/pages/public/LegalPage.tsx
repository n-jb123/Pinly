import React from 'react';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

export const LegalPage: React.FC<{ slug?: string }> = ({ slug = 'terms' }) => {
  const { navigateTo } = useApp();

  const legalTitles: Record<string, string> = {
    terms: 'Terms of Use',
    privacy: 'Privacy & Data Protection Policy',
    cookies: 'Cookies Policy',
    'acceptable-use': 'Acceptable Use Policy',
    refunds: 'Refund & Cancellation Policy',
    dpa: 'Data Processing Addendum (DPA Template)',
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          Back to Pinly
        </button>

        <div className="border-b border-[var(--border)] pb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF5A3C] uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--text)]">
            {legalTitles[slug] || 'Terms of Use'}
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Last Updated: October 10, 2026 • Version 1.0 (Turnkey Legal Template)
          </p>
        </div>

        <article className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed space-y-4 text-[var(--text)]">
          <section className="space-y-2">
            <h2 className="text-sm font-bold">1. Overview and Acceptance</h2>
            <p className="text-[var(--muted)]">
              Welcome to {brandConfig.name}. By accessing our services, creating workspaces, submitting creative deliverables for review, or posting pinned annotations as an invited reviewer, you agree to these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold">2. Client Reviewer Identification & Consent</h2>
            <p className="text-[var(--muted)]">
              Clients and external reviewers access project review links without mandatory account passwords. By providing a display name and email address when commenting or approving, reviewers consent to identification on thread audit trails.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold">3. Integrity of Approval Records & Sign-Off</h2>
            <p className="text-[var(--muted)]">
              When a client verifies an approval via email code, the associated version is locked permanently. In accordance with data integrity principles, approval audit logs (including approver identity, UTC timestamp, IP address, and browser metadata) are retained as verified business records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold">4. Content Sandbox & File Security</h2>
            <p className="text-[var(--muted)]">
              Uploaded files are validated against malicious MIME definitions. SVG assets are sanitized of executable scripts, and HTML website reviews are isolated within cross-origin sandboxed containers.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};
