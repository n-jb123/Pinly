import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import { Button } from '../../components/common/Button';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const ClientReviewGatePage: React.FC<{ token?: string }> = ({
  token = 'spark-ui-8492',
}) => {
  const { navigateTo, showToast } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (password === 'spark-review' || password.length >= 4) {
        showToast('Password accepted. Loading deliverables...', 'success');
        navigateTo(`/r/${token}`);
      } else {
        setError(true);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-8 space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-black text-[var(--text)]">Protected Review Link</h1>
          <p className="text-xs text-[var(--muted)]">
            This deliverable review requires an access passcode configured by the creative agency.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-start">
          <div>
            <label className="block font-semibold mb-1 text-[var(--text)]">Passcode</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter review passcode..."
              className="w-full p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
            />
            {error && (
              <p className="text-rose-500 text-[11px] font-semibold mt-1">
                Incorrect passcode. Check with the sender. (Demo pass: spark-review)
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full text-xs font-bold"
            isLoading={isLoading}
            icon={<ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}
          >
            Unlock Review
          </Button>
        </form>

        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-center gap-2 text-[11px] text-[var(--muted)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Session • {brandConfig.name}</span>
        </div>
      </div>
    </div>
  );
};
