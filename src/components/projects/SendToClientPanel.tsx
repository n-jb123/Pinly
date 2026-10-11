import React, { useState } from 'react';
import { Project, ReviewLink, Work } from '../../data/types';
import { Button } from '../common/Button';
import { useApp } from '../../data/context';
import { Copy, Mail, Share2, Send, Check, AlertCircle } from 'lucide-react';

export interface SendToClientPanelProps {
  project: Project;
  reviewLink: ReviewLink;
  works: Work[];
  onSendForReview: () => void;
  onOpenSettings: () => void;
}

export const SendToClientPanel: React.FC<SendToClientPanelProps> = ({
  project,
  reviewLink,
  works,
  onSendForReview,
  onOpenSettings,
}) => {
  const { t, showToast, workspace } = useApp();
  const [copied, setCopied] = useState<boolean>(false);
  const [showEmailComposer, setShowEmailComposer] = useState<boolean>(false);
  const [emailText, setEmailText] = useState<string>(
    `Hello! We have prepared the review for ${project.name}. Please open the review link below to inspect the designs and leave your feedback directly in context:\n\n${reviewLink.url}`
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(reviewLink.url);
    setCopied(true);
    showToast(t('toast.linkCopied'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello! Here is your review link for ${project.name}: ${reviewLink.url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSendEmail = () => {
    showToast('Review invitation email sent to client', 'success');
    setShowEmailComposer(false);
  };

  const hasDrafts = works.some((w) => w.status === 'draft');

  return (
    <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--text)]">Send Project for Review</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Share this link with your client. They can review and leave pinned feedback without creating an account.
          </p>
        </div>

        {hasDrafts && (
          <Button
            variant="primary"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
            onClick={onSendForReview}
          >
            {t('action.sendForReview')}
          </Button>
        )}
      </div>

      {hasDrafts && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>You have unpublished drafts. Click <strong>"Send for review"</strong> when you are ready to make them visible to the client.</span>
        </div>
      )}

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        {/* Copy Link Input */}
        <div className="flex-1 w-full flex items-center bg-[var(--canvas)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs">
          <input
            type="text"
            readOnly
            value={reviewLink.url}
            className="w-full bg-transparent text-[var(--text)] font-mono text-[11px] focus:outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className="ms-2 p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            title="Copy link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            icon={<Mail className="w-3.5 h-3.5" />}
            onClick={() => setShowEmailComposer(!showEmailComposer)}
            className="flex-1 sm:flex-none"
          >
            {t('action.sendEmail')}
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={<Share2 className="w-3.5 h-3.5 text-emerald-500" />}
            onClick={handleWhatsApp}
            className="flex-1 sm:flex-none"
          >
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Email Composer Drawer */}
      {showEmailComposer && (
        <div className="p-4 bg-[var(--canvas)] border border-[var(--border)] rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[var(--text)]">Email Invitation Preview ({workspace.name})</span>
            <button onClick={() => setShowEmailComposer(false)} className="text-[var(--muted)] text-xs">
              Close
            </button>
          </div>
          <textarea
            rows={4}
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            className="w-full text-xs p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="primary" icon={<Send className="w-3 h-3" />} onClick={handleSendEmail}>
              Send via Pinly Mailer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
