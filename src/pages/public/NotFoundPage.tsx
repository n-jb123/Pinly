import React from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { HelpCircle, ArrowLeft, Home, FolderKanban } from 'lucide-react';
import { brandConfig } from '../../config/brand';

export const NotFoundPage: React.FC = () => {
  const { navigateTo, t } = useApp();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center mx-auto text-xl font-black">
          404
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-[var(--text)]">{t('error.404')}</h1>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            The page or deliverable link you requested does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Button
            size="sm"
            variant="primary"
            icon={<FolderKanban className="w-3.5 h-3.5" />}
            onClick={() => navigateTo('/app')}
          >
            {t('error.backToApp')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<Home className="w-3.5 h-3.5" />}
            onClick={() => navigateTo('/')}
          >
            {t('error.backHome')}
          </Button>
        </div>
      </div>
    </div>
  );
};
