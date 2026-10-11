import React, { ReactNode } from 'react';
import { Button } from './Button';
import { Layers } from 'lucide-react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl ${className}`}>
      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--canvas)] text-[var(--muted)] mb-3">
        {icon || <Layers className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-[var(--text)] mb-1">{title}</h3>
      {description && <p className="text-xs text-[var(--muted)] max-w-sm mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
