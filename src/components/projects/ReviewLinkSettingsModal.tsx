import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ReviewLink } from '../../data/types';
import { useApp } from '../../data/context';
import { Shield, KeyRound, Calendar, RefreshCw, Plus, X } from 'lucide-react';

export interface ReviewLinkSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewLink: ReviewLink;
  onSave: (patch: Partial<ReviewLink>) => Promise<void>;
  onRegenerate: () => Promise<void>;
}

export const ReviewLinkSettingsModal: React.FC<ReviewLinkSettingsModalProps> = ({
  isOpen,
  onClose,
  reviewLink,
  onSave,
  onRegenerate,
}) => {
  const { t, showToast } = useApp();
  const [enabled, setEnabled] = useState<boolean>(reviewLink.enabled);
  const [hasPassword, setHasPassword] = useState<boolean>(reviewLink.hasPassword);
  const [password, setPassword] = useState<string>(reviewLink.password || '');
  const [expiresAt, setExpiresAt] = useState<string>(reviewLink.expiresAt || '');
  const [approvers, setApprovers] = useState<string[]>(reviewLink.approverEmails || []);
  const [newApproverEmail, setNewApproverEmail] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleAddApprover = () => {
    if (newApproverEmail.trim() && !approvers.includes(newApproverEmail.trim())) {
      setApprovers([...approvers, newApproverEmail.trim()]);
      setNewApproverEmail('');
    }
  };

  const handleRemoveApprover = (email: string) => {
    setApprovers(approvers.filter((a) => a !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        enabled,
        hasPassword,
        password: hasPassword ? password : '',
        expiresAt: expiresAt || undefined,
        approverEmails: approvers,
      });
      showToast('Review link settings saved successfully', 'success');
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Review Link Security & Approvers"
      description="Configure access permissions, optional passcodes, and sign-off restrictions."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Enable / Disable Switch */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)]">
          <div>
            <span className="text-xs font-bold text-[var(--text)] block">Review Link Status</span>
            <span className="text-[11px] text-[var(--muted)]">
              {enabled ? 'Active and accessible to reviewers' : 'Link disabled (shows unavailable)'}
            </span>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-[#FF5A3C] focus:ring-[#FF5A3C]"
          />
        </div>

        {/* Regenerate Link */}
        <div className="p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--text)] block">Regenerate Link Token</span>
            <span className="text-[11px] text-[var(--muted)]">Invalidates existing review URL immediately</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={async () => {
              if (confirm('Regenerating will break existing shared links. Proceed?')) {
                await onRegenerate();
                showToast('Review link regenerated with new token', 'success');
              }
            }}
          >
            Regenerate
          </Button>
        </div>

        {/* Optional Password */}
        <div className="p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text)]">Password Gate</span>
            <input
              type="checkbox"
              checked={hasPassword}
              onChange={(e) => setHasPassword(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF5A3C] focus:ring-[#FF5A3C]"
            />
          </div>
          {hasPassword && (
            <div className="relative pt-1">
              <KeyRound className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode required to view..."
                className="w-full text-xs ps-9 pe-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1">
            Optional Expiration Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={expiresAt ? expiresAt.split('T')[0] : ''}
              onChange={(e) => setExpiresAt(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
          </div>
        </div>

        {/* Restrict Approvers List */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[var(--text)]">
            Designated Approvers (Optional)
          </label>
          <p className="text-[11px] text-[var(--muted)]">
            If specified, only these emails can verify and sign final approvals. Other viewers can only comment.
          </p>

          <div className="flex gap-2">
            <input
              type="email"
              value={newApproverEmail}
              onChange={(e) => setNewApproverEmail(e.target.value)}
              placeholder="e.g. client.ceo@company.com"
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddApprover}
            >
              Add
            </Button>
          </div>

          {approvers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {approvers.map((em) => (
                <span
                  key={em}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium"
                >
                  {em}
                  <button
                    type="button"
                    onClick={() => handleRemoveApprover(em)}
                    className="text-[var(--muted)] hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            {t('action.cancel')}
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
            Save Settings
          </Button>
        </div>
      </form>
    </Modal>
  );
};
