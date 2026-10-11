import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { KeyRound, ShieldCheck, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { CertificateModal } from '../../components/review/CertificateModal';

export interface ClientReviewVerifyPageProps {
  token?: string;
}

export const ClientReviewVerifyPage: React.FC<ClientReviewVerifyPageProps> = ({
  token = 'apex-redesign-2026',
}) => {
  const { navigateTo, showToast } = useApp();
  const [code, setCode] = useState('849201');
  const [isVerified, setIsVerified] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      showToast('Work deliverable successfully approved & certified!', 'success');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-8 space-y-6 text-center">
        {!isVerified ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-black text-[var(--text)]">Verify Official Sign-Off</h1>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                We sent a 6-digit authorization token to your email to verify your identity and legally bind final approval.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-2">
                  Confirmation Code (Valid 15m)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-48 mx-auto text-center font-mono text-xl tracking-widest px-3 py-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-black block text-[var(--text)] focus:outline-none focus:border-[#FF5A3C]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full text-xs font-bold"
                isLoading={isLoading}
              >
                Confirm Sign-Off & Lock Version
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-[var(--text)]">Approval Verified & Locked!</h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                The deliverable is certified final. An immutable audit record has been timestamped.
              </p>
            </div>

            <div className="p-3 bg-[var(--canvas)] rounded-xl border border-[var(--border)] text-xs text-start space-y-1">
              <p><strong>Deliverable:</strong> Landing Page Hero & Features (V3)</p>
              <p><strong>Approver:</strong> Tariq Al-Sabah</p>
              <p><strong>Status:</strong> <span className="text-emerald-600 font-bold">Approved & Locked</span></p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={<Award className="w-4 h-4" />}
                onClick={() => setShowCertificate(true)}
              >
                Download PDF Certificate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo(`/r/${token}`)}
              >
                Return to Review Canvas
              </Button>
            </div>
          </div>
        )}
      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />
    </div>
  );
};
