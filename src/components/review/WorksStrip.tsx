import React from 'react';
import { Work } from '../../data/types';
import { Image, FileText, Video, Globe } from 'lucide-react';

export interface WorksStripProps {
  works: Work[];
  activeWorkId: string;
  onSelectWork: (work: Work) => void;
}

export const WorksStrip: React.FC<WorksStripProps> = ({
  works,
  activeWorkId,
  onSelectWork,
}) => {
  const getTypeIcon = (type: Work['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-3 h-3" />;
      case 'pdf':
        return <FileText className="w-3 h-3" />;
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'website':
        return <Globe className="w-3 h-3" />;
    }
  };

  const getStatusDot = (status: Work['status']) => {
    let color = 'bg-stone-400';
    if (status === 'in_review') color = 'bg-blue-500';
    if (status === 'changes_requested') color = 'bg-amber-500';
    if (status === 'awaiting_approval') color = 'bg-purple-500';
    if (status === 'approved') color = 'bg-emerald-500';

    return <span className={`w-2 h-2 rounded-full ${color}`} />;
  };

  return (
    <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2 flex items-center gap-2 overflow-x-auto select-none">
      <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider shrink-0 me-2">
        Works ({works.length})
      </span>

      <div className="flex items-center gap-2">
        {works.map((work) => {
          const isActive = work.id === activeWorkId;

          return (
            <button
              key={work.id}
              onClick={() => onSelectWork(work)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[var(--canvas)] text-[var(--text)] border-[#FF5A3C] shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--text)]/30'
              }`}
            >
              <span className="text-[var(--text)]">{getTypeIcon(work.type)}</span>
              <span className="truncate max-w-[140px]">{work.title}</span>
              {getStatusDot(work.status)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
