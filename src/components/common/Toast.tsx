import React from 'react';
import { useApp } from '../../data/context';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 end-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        let borderClass = 'border-emerald-500/30';

        if (toast.type === 'danger') {
          icon = <AlertCircle className="w-4 h-4 text-rose-500" />;
          borderClass = 'border-rose-500/30';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
          borderClass = 'border-amber-500/30';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-blue-500" />;
          borderClass = 'border-blue-500/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[var(--surface)] text-[var(--text)] border ${borderClass} rounded-xl shadow-lg animate-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="text-xs font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--muted)] hover:text-[var(--text)] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
