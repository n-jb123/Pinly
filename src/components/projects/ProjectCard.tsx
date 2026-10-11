import React from 'react';
import { Project, Client } from '../../data/types';
import { Badge } from '../common/Badge';
import { useApp } from '../../data/context';
import { Layers, MessageSquare, Calendar, ChevronRight } from 'lucide-react';

export interface ProjectCardProps {
  project: Project;
  client?: Client;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  client,
  onClick,
}) => {
  const { t } = useApp();

  return (
    <div
      onClick={onClick}
      className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs hover:shadow-md hover:border-[#FF5A3C]/40 transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Badge status={project.status}>
            {t(`status.${project.status}`)}
          </Badge>
          <span className="text-[11px] text-[var(--muted)]">
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--text)] group-hover:text-[#FF5A3C] transition-colors leading-snug">
            {project.name}
          </h3>
          {client && (
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {client.name} {client.company ? `• ${client.company}` : ''}
            </p>
          )}
        </div>

        {project.description && (
          <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      <div className="pt-4 mt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-[var(--text)]">{project.workCount}</strong> works
          </span>
          {project.openThreads > 0 && (
            <span className="flex items-center gap-1 text-[#FF5A3C] font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              {project.openThreads} open
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-[var(--text)] transition-colors">
          <span className="text-[11px] font-medium">View</span>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </div>
      </div>
    </div>
  );
};
