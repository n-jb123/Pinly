import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import { Button } from '../../components/common/Button';
import { LanguageSwitch } from '../../components/common/LanguageSwitch';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { ArrowLeft, Mail, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC<{ initialMode?: 'sign-in' | 'sign-up' }> = ({
  initialMode = 'sign-in',
}) => {
  const { client, t, showToast, navigateTo, locale } = useApp();
  const [mode, setMode] = useState<'sign-in' | 'sign-up' | 'forgot' | 'verify' | '2fa'>(initialMode);
  const [email, setEmail] = useState<string>('nazemjbaara@gmail.com');
  const [password, setPassword] = useState<string>('password123');
  const [name, setName] = useState<string>('Nazim Jbaara');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('123456');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      if (mode === 'sign-in') {
        await client.signIn(email, password);
        showToast(t('auth.signIn') + ' - OK', 'success');
        navigateTo('/app');
      } else if (mode === 'sign-up') {
        await client.signUp({ name, email, password });
        showToast(t('auth.verificationSent') + ' ' + email, 'info');
        setMode('verify');
      } else if (mode === 'forgot') {
        await client.requestPasswordReset(email);
        showToast(t('auth.verificationSent') + ' ' + email, 'info');
        setMode('sign-in');
      } else if (mode === 'verify') {
        await client.verifyEmail(verifyCode);
        showToast(t('toast.saved'), 'success');
        navigateTo('/app');
      } else if (mode === '2fa') {
        await client.verifyTwoFactor(twoFactorCode);
        showToast(t('toast.saved'), 'success');
        navigateTo('/app');
      }
    } catch (err: any) {
      const msg = err?.message || t('toast.error');
      setFormError(msg);
      showToast(msg, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setFormError(null);
    try {
      await client.signInWithGoogle();
      showToast(t('auth.google') + ' - OK', 'success');
      navigateTo('/app');
    } catch (err: any) {
      const msg = err?.message || t('toast.error');
      setFormError(msg);
      showToast(msg, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center p-4 transition-colors">
      <div className="absolute top-4 start-4 flex items-center gap-2">
        <button
          onClick={() => navigateTo('/')}
          className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('auth.home')}
        </button>
      </div>

      <div className="absolute top-4 end-4 flex items-center gap-2">
        <LanguageSwitch />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-xl mx-auto border-2 border-white shadow-sm">
            P
          </div>
          <h2 className="text-xl font-extrabold text-[var(--text)]">
            {mode === 'sign-in' && t('auth.signIn')}
            {mode === 'sign-up' && t('auth.signUp')}
            {mode === 'forgot' && t('auth.forgotPassword')}
            {mode === 'verify' && t('auth.verifyEmail')}
            {mode === '2fa' && t('auth.twoFactor')}
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {locale === 'ar' ? brandConfig.taglineAr : brandConfig.taglineEn}
          </p>
        </div>

        {/* Inline Error Message */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Google Single Sign-On */}
        {(mode === 'sign-in' || mode === 'sign-up') && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--canvas)] hover:bg-[var(--border)]/30 font-semibold text-xs text-[var(--text)] transition-colors cursor-pointer select-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t('auth.google')}</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-[var(--border)]" />
              <span className="text-[10px] text-[var(--muted)] uppercase font-bold">{t('auth.orEmail')}</span>
              <div className="flex-1 h-[1px] bg-[var(--border)]" />
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'sign-up' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">{t('auth.fullName')}</label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nazim Jbaara"
                  className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
                />
              </div>
            </div>
          )}

          {mode !== '2fa' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nazem@company.com"
                  className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
                />
              </div>
            </div>
          )}

          {(mode === 'sign-in' || mode === 'sign-up') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[var(--text)]">{t('auth.password')}</label>
                {mode === 'sign-in' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#FF5A3C] hover:underline cursor-pointer"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo: password123"
                  className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
                />
              </div>
            </div>
          )}

          {mode === '2fa' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">{t('auth.code')}</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-xs font-mono tracking-widest text-center ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
                />
              </div>
            </div>
          )}

          {mode === 'verify' && (
            <div className="p-3 rounded-xl bg-[var(--canvas)] text-xs text-[var(--muted)] text-center space-y-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
              <p>
                {t('auth.verificationSent')} <strong>{email}</strong>.
              </p>
              <p className="text-[11px]">{t('auth.verificationHint')}</p>
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="123456"
                  className="w-36 mx-auto text-center font-mono tracking-widest py-2 px-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] font-bold text-sm block focus:outline-none focus:border-[#FF5A3C]"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full text-xs font-bold pt-2"
            isLoading={isLoading}
          >
            {mode === 'sign-in' && t('auth.signIn')}
            {mode === 'sign-up' && t('auth.createWorkspace')}
            {mode === 'forgot' && t('auth.sendResetLink')}
            {mode === 'verify' && t('auth.confirmAndEnter')}
            {mode === '2fa' && t('auth.verify2FA')}
          </Button>
        </form>

        {/* Footer switch between Sign In and Sign Up */}
        <div className="text-center text-xs text-[var(--muted)] pt-2 border-t border-[var(--border)]">
          {mode === 'sign-in' ? (
            <p>
              {t('auth.dontHaveAccount')}{' '}
              <button
                onClick={() => setMode('sign-up')}
                className="font-bold text-[#FF5A3C] hover:underline cursor-pointer"
              >
                {t('auth.signUp')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.alreadyRegistered')}{' '}
              <button
                onClick={() => setMode('sign-in')}
                className="font-bold text-[#FF5A3C] hover:underline cursor-pointer"
              >
                {t('auth.signIn')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
