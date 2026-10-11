import React from 'react';
import { Project, Work, Version } from '../../data/types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitch } from '../common/LanguageSwitch';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import { CheckCircle2, SplitSquareVertical, ArrowLeft, Lock, Sparkles, Send } from 'lucide-react';

export interface ReviewHeaderProps {
  project: Project;
  activeWork: Work;
  versions: Version[];
  selectedVersion: Version;
  onSelectVersion: (v: Version) => void;
  onOpenCompare: () => void;
  onRequestApproval?: () => void;
  onApprove?: () => void;
  onRequestChanges?: () => void;
  onSendForReview?: () => void;
  isClientView?: boolean;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  project,
  activeWork,
  versions,
  selectedVersion,
  onSelectVersion,
  onOpenCompare,
  onRequestApproval,
  onApprove,
  onRequestChanges,
  onSendForReview,
  isClientView = false,
}) => {
  const { workspace, t, navigateTo, setOpenVoiceAssistant } = useApp();
  const isApproved = selectedVersion.state === 'approved';
  const isDraft = selectedVersion.state === 'draft';

  return (
    <div className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30 transition-colors">
      {/* Banner States */}
      {isApproved && (
        <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>{t('review.locked')}</span>
        </div>
      )}

      {activeWork.status === 'awaiting_approval' && !isApproved && (
        <div className="bg-purple-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t('review.finalRequested')}</span>
        </div>
      )}

      {isDraft && !isClientView && (
        <div className="bg-amber-500 text-[#0F1A2E] px-4 py-1.5 text-xs font-bold flex items-center justify-between">
          <span>This version is an unsubmitted draft and is currently HIDDEN from the client.</span>
          {onSendForReview && (
            <button
              onClick={onSendForReview}
              className="px-2.5 py-0.5 rounded bg-[#0F1A2E] text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('action.sendForReview')}
            </button>
          )}
        </div>
      )}

      {/* Main Header Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Back button / Brand & Project Title */}
        <div className="flex items-center gap-3 min-w-0">
          {!isClientView && (
            <button
              onClick={() => navigateTo(`/app/projects/${project.id}`)}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)] transition-colors cursor-pointer"
              title="Back to project"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-sm">
              P
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-[var(--muted)] truncate">
                  {workspace.name} / {project.name}
                </h2>
              </div>
              <h1 className="text-sm font-extrabold text-[var(--text)] truncate">
                {activeWork.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Version Selector & Compare */}
        <div className="flex items-center gap-2">
          {/* Version Picker */}
          <div className="flex items-center bg-[var(--canvas)] p-0.5 rounded-xl border border-[var(--border)]">
            {versions.map((ver) => (
              <button
                key={ver.id}
                onClick={() => onSelectVersion(ver)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedVersion.id === ver.id
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                V{ver.number}
                {ver.state === 'draft' && <span className="ms-1 text-[9px] text-amber-500">(Draft)</span>}
                {ver.state === 'approved' && <span className="ms-1 text-[9px] text-emerald-500">✓</span>}
              </button>
            ))}
          </div>

          {versions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              icon={<SplitSquareVertical className="w-3.5 h-3.5" />}
              onClick={onOpenCompare}
            >
              {t('action.compare')}
            </Button>
          )}

          <Badge status={activeWork.status}>
            {t(`status.${activeWork.status}`)}
          </Badge>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Live Voice Review Assistant */}
          <button
            onClick={() => setOpenVoiceAssistant(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5A3C]/10 text-[#FF5A3C] hover:bg-[#FF5A3C]/20 transition-colors cursor-pointer"
            title="Talk with Gemini 3.8 Live API Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A3C]" />
            <span className="hidden sm:inline">Voice Review</span>
          </button>

          <LanguageSwitch />
          <ThemeToggle />

          {/* Action buttons based on Role / View */}
          {isClientView ? (
            <>
              {!isApproved && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRequestChanges}
                  >
                    {t('action.requestChanges')}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onApprove}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    {t('action.approve')}
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              {!isApproved && activeWork.status !== 'awaiting_approval' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRequestApproval}
                >
                  {t('action.requestApproval')}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
