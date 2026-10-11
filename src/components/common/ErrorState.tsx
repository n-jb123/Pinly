import React from 'react';
import { Button } from './Button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useApp } from '../../data/context';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  className = '',
}) => {
  const { t } = useApp();

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-[var(--surface)] border border-rose-200 dark:border-rose-950/40 rounded-2xl ${className}`}>
      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/40 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[var(--text)] mb-1">{t('toast.error')}</h3>
      <p className="text-xs text-[var(--muted)] max-w-sm mb-4">
        {message || t('error.500')}
      </p>
      {onRetry && (
        <Button size="sm" variant="outline" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onRetry}>
          {t('action.tryAgain')}
        </Button>
      )}
    </div>
  );
};
