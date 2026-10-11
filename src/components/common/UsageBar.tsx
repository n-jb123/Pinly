import React from 'react';

export interface UsageBarProps {
  label: string;
  used: number;
  total: number;
  unit?: string;
  showDetails?: boolean;
}

export const UsageBar: React.FC<UsageBarProps> = ({
  label,
  used,
  total,
  unit = '',
  showDetails = true,
}) => {
  const percentage = Math.min(100, Math.round((used / total) * 100));
  const isHigh = percentage > 85;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-[var(--text)]">{label}</span>
        {showDetails && (
          <span className="text-[var(--muted)]">
            {used} / {total} {unit} ({percentage}%)
          </span>
        )}
      </div>
      <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isHigh ? 'bg-rose-500' : 'bg-[#FF5A3C]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
