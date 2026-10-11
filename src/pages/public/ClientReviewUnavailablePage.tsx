import React from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { AlertOctagon, Mail, ArrowLeft } from 'lucide-react';
import { brandConfig } from '../../config/brand';

export const ClientReviewUnavailablePage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-8 space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-[var(--text)]">Review Link Unavailable</h1>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            This review link has expired, been disabled by the agency, or replaced with a newly generated token.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs text-[var(--muted)] leading-relaxed">
          Please contact the agency or freelancer who sent you this link to request an updated review invitation.
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            icon={<ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />}
            onClick={() => navigateTo('/')}
          >
            Visit {brandConfig.name}
          </Button>
        </div>
      </div>
    </div>
  );
};
