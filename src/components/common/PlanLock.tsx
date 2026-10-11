import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './Button';
import { useApp } from '../../data/context';

export interface PlanLockProps {
  featureName: string;
  minPlan?: 'Pro' | 'Agency';
  children?: React.ReactNode;
}

export const PlanLock: React.FC<PlanLockProps> = ({
  featureName,
  minPlan = 'Pro',
  children,
}) => {
  const { t, navigateTo } = useApp();

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border)] p-6 bg-[var(--surface)] text-center">
      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-[var(--text)] mb-1">
          {featureName}
        </h4>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          {t('plan.locked')} ({minPlan})
        </p>
        <Button size="sm" onClick={() => navigateTo('/app/settings')}>
          Upgrade to {minPlan}
        </Button>
      </div>
      {children && (
        <div className="opacity-20 pointer-events-none filter blur-xs mt-4">
          {children}
        </div>
      )}
    </div>
  );
};
