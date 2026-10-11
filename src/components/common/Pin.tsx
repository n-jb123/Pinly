import React from 'react';
import { ThreadStatus } from '../../data/types';

export interface PinProps {
  number: number;
  status?: ThreadStatus;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Pin: React.FC<PinProps> = ({
  number,
  status = 'open',
  isSelected = false,
  onClick,
  style,
  className = '',
}) => {
  let statusClass = 'bg-[#FF5A3C]'; // Open is coral
  if (status === 'resolved') {
    statusClass = 'bg-[#1F8F68]'; // Resolved is success green
  } else if (status === 'closed') {
    statusClass = 'bg-[#5B6475]'; // Closed is muted gray
  }

  return (
    <div
      onClick={onClick}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Feedback Pin #${number}`}
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2
        w-6 h-6 md:w-[22px] md:h-[22px] rounded-full
        border-2 border-white
        text-[#0F1A2E] font-bold text-[11px]
        flex items-center justify-center
        shadow-[0_4px_10px_rgba(15,26,46,0.35)]
        cursor-pointer select-none transition-transform duration-150
        hover:scale-125 z-20
        ${statusClass}
        ${isSelected ? 'scale-125 ring-3 ring-[#FF5A3C]/60 shadow-[0_0_0_4px_rgba(15,26,46,0.25)]' : ''}
        ${className}
      `}
    >
      {number}
    </div>
  );
};
