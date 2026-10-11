import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../data/context';
import { ShieldCheck, User, Mail } from 'lucide-react';

export interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (identity: { name: string; email: string }) => void;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useApp();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (rememberMe) {
      localStorage.setItem('pinly_client_name', name.trim());
      localStorage.setItem('pinly_client_email', email.trim());
    }

    onSubmit({ name: name.trim(), email: email.trim() });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" title={t('identity.title')}>
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          No password or account required. We link your feedback to your name so the team knows who to address.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              {t('identity.name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Al-Sabah"
                className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              {t('identity.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tariq@company.com"
                className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-[#FF5A3C] focus:ring-[#FF5A3C]"
            />
            <span>{t('identity.remember')} (90 days)</span>
          </label>
        </div>

        {/* Cloudflare Turnstile CAPTCHA representation */}
        <div className="p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified human session (Cloudflare Turnstile)</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Pass</span>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            {t('action.cancel')}
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={!name.trim() || !email.trim()}>
            {t('identity.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
