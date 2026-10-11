import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../data/context';
import { CheckCircle2, ShieldCheck, Mail, KeyRound, Award, Lock } from 'lucide-react';
import { Work, Version } from '../../data/types';

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: Work;
  version: Version;
  openThreadsCount: number;
  onApproved: () => void;
  onOpenCertificate: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  work,
  version,
  openThreadsCount,
  onApproved,
  onOpenCertificate,
}) => {
  const { t, showToast } = useApp();
  const [step, setStep] = useState<'confirm' | 'verify' | 'success'>('confirm');
  const [approverName, setApproverName] = useState<string>('Tariq Al-Sabah');
  const [approverEmail, setApproverEmail] = useState<string>('tariq@apexlogistics.com');
  const [verificationCode, setVerificationCode] = useState<string>('849201');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleProceedToVerify = () => {
    setStep('verify');
    showToast('Verification code sent to ' + approverEmail, 'info');
  };

  const handleFinalConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      onApproved();
      showToast(t('toast.approved'), 'success');
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      {step === 'confirm' && (
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="text-center">
            <h3 className="text-base font-extrabold text-[var(--text)]">
              {t('action.approve')} — {work.title} (V{version.number})
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1">
              {t('review.confirmApprove')}
            </p>
          </div>

          {openThreadsCount > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Notice:</span> Approving this work will automatically resolve and close all {openThreadsCount} open feedback threads.
            </div>
          )}

          <div className="space-y-2.5 p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                Your Full Legal Name
              </label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                Verified Work Email Address
              </label>
              <input
                type="email"
                value={approverEmail}
                onChange={(e) => setApproverEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              {t('action.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<ShieldCheck className="w-4 h-4" />}
              onClick={handleProceedToVerify}
              disabled={!approverName || !approverEmail}
            >
              Verify & Approve
            </Button>
          </div>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="text-center">
            <h3 className="text-base font-extrabold text-[var(--text)]">Email Verification Required</h3>
            <p className="text-xs text-[var(--muted)] mt-1">
              {t('review.verifyEmail')} <strong>{approverEmail}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[var(--text)] text-center">
              Enter 6-digit confirmation code
            </label>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-48 mx-auto text-center font-mono text-lg tracking-widest px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-bold block"
            />
            <p className="text-[11px] text-[var(--muted)] text-center">
              (Code valid for 15 minutes. For demo: code is prefilled)
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setStep('confirm')}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleFinalConfirm}
            >
              Sign & Lock Version
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-[var(--text)]">Work Officially Approved!</h3>
            <p className="text-xs text-[var(--muted)] mt-1 max-w-sm mx-auto">
              Version {version.number} has been verified and permanently locked with an immutable audit record.
            </p>
          </div>

          <div className="p-3 bg-[var(--canvas)] rounded-xl border border-[var(--border)] text-xs text-start space-y-1">
            <p><strong>Approver:</strong> {approverName} ({approverEmail})</p>
            <p><strong>Timestamp:</strong> Just now ({new Date().toLocaleDateString()})</p>
            <p><strong>Status:</strong> <span className="text-emerald-600 font-bold">Locked & Completed</span></p>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Award className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onOpenCertificate();
              }}
            >
              {t('action.downloadCertificate')}
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
