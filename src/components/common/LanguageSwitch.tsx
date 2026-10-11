import React from 'react';
import { useApp } from '../../data/context';
import { Globe } from 'lucide-react';

export const LanguageSwitch: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { locale, setLocale } = useApp();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/20 transition-colors cursor-pointer ${className}`}
      title={locale === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5 text-[#FF5A3C]" />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};
