import React from 'react';
import { WorkStatus, ThreadStatus } from '../../data/types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'outline' | 'neutral' | 'success' | 'warning' | 'danger' | 'primary';
  status?: WorkStatus | ThreadStatus | 'archived';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  status,
  className = '',
  size = 'md',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  let colorClass = 'bg-[var(--border)] text-[var(--text)]';

  if (status) {
    switch (status) {
      case 'draft':
        colorClass = 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300';
        break;
      case 'in_review':
        colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900';
        break;
      case 'changes_requested':
        colorClass = 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
        break;
      case 'awaiting_approval':
        colorClass = 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900';
        break;
      case 'approved':
        colorClass = 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';
        break;
      case 'archived':
        colorClass = 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        break;
      case 'open':
        colorClass = 'bg-[#FF5A3C]/15 text-[#FF5A3C] border border-[#FF5A3C]/30 font-semibold';
        break;
      case 'resolved':
        colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
        break;
      case 'closed':
        colorClass = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        break;
    }
  } else {
    switch (variant) {
      case 'primary':
        colorClass = 'bg-[#FF5A3C] text-[#0F1A2E] font-semibold';
        break;
      case 'success':
        colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
        break;
      case 'warning':
        colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
        break;
      case 'danger':
        colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        break;
      case 'outline':
        colorClass = 'border border-[var(--border)] text-[var(--muted)]';
        break;
      default:
        colorClass = 'bg-[var(--border)]/60 text-[var(--text)]';
    }
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClass} ${colorClass} ${className}`}>
      {children}
    </span>
  );
};
