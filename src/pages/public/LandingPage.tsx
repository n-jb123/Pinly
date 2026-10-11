import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { brandConfig } from '../../config/brand';
import { Button } from '../../components/common/Button';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { LanguageSwitch } from '../../components/common/LanguageSwitch';
import { Plan } from '../../data/types';
import {
  MapPin,
  CheckCircle2,
  UploadCloud,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { client, locale, t, navigateTo, setOpenVoiceAssistant } = useApp();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(true);

  useEffect(() => {
    client.listPlans().then(setPlans);
  }, [client]);

  const faqs = [
    {
      q: 'Do my clients need to create an account or install anything?',
      a: 'Never. Clients open your review link, see the design or document immediately, and place comments in seconds with name and email only.',
    },
    {
      q: 'What types of deliverables can I review in Pinly?',
      a: 'Pinly supports images (JPG, PNG, WebP, GIF, SVG), multi-page PDF documents, video footage (MP4, WebM, MOV, and YouTube/Vimeo links), and live website URLs.',
    },
    {
      q: 'How does verified approval work?',
      a: 'When you request final sign-off, the client confirms approval with a verified email code. This locks the version permanently and generates a tamper-evident PDF approval certificate.',
    },
    {
      q: 'Can I rebrand Pinly for my agency?',
      a: 'Yes! On the Agency plan, your review pages, client emails, and portal display your agency logo, primary color, and brand identity.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('/')}>
          <div className="w-8 h-8 rounded-xl bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-lg border-2 border-white shadow-xs">
            P
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[var(--text)]">
            {brandConfig.name}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setOpenVoiceAssistant(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5A3C]/10 text-[#FF5A3C] hover:bg-[#FF5A3C]/20 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#FF5A3C]" />
            <span>Voice Assistant</span>
          </button>

          <LanguageSwitch />
          <ThemeToggle />

          <button
            onClick={() => navigateTo('/auth')}
            className="text-xs font-semibold text-[var(--text)] hover:text-[#FF5A3C] px-3 py-1.5 cursor-pointer"
          >
            {t('auth.signIn')}
          </button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => navigateTo('/auth')}
          >
            {t('auth.signUp')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A3C]/15 text-[#0F1A2E] dark:text-[#FF5A3C] text-xs font-bold border border-[#FF5A3C]/30 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A3C]" />
          <span>Contextual Review & Verified Sign-Off for Freelancers & Agencies</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[var(--text)] tracking-tight leading-[1.1] max-w-4xl mx-auto">
          {locale === 'ar'
            ? 'احصل على ملاحظات العميل بالضبط في المكان المطلوب.'
            : 'Get client feedback exactly where it matters.'}
        </h1>

        <p className="text-base sm:text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          {locale === 'ar'
            ? 'منصة مراجعة واعتماد عبر رابط واحد بدون حساب للعميل، تأشير دقيق، مقارنة بين النسخ، وموافقة موثقة بشهادة رسمية.'
            : 'Send your creative work through one frictionless link. Clients comment on exact pixels without an account, and verified sign-off locks final delivery.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigateTo('/auth')}
            icon={<ArrowRight className="w-4 h-4 rtl:rotate-180" />}
          >
            {locale === 'ar' ? 'ابدأ مجاناً' : 'Start free'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigateTo('/r/apex-redesign-2026')}
          >
            View Live Client Review Demo
          </Button>
        </div>

        {/* Visual Hero Feature Mockup */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-4 md:p-6 overflow-hidden">
            <div className="relative rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80"
                alt="App preview"
                className="w-full h-auto object-cover max-h-[460px]"
              />

              {/* Pin 1 on hero preview */}
              <div className="absolute top-[28%] left-[32%] z-20">
                <div className="pinly-pin selected">1</div>
                <div className="absolute top-7 start-0 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl p-2.5 shadow-xl text-start text-xs w-56 animate-in fade-in">
                  <p className="font-bold">Tariq Al-Sabah</p>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    "Make the primary CTA button darker and increase font by 2px."
                  </p>
                </div>
              </div>

              {/* Pin 2 on hero preview */}
              <div className="absolute top-[52%] left-[64%] z-20">
                <div className="pinly-pin status-resolved">2</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps: Upload / Comment / Approve */}
      <section className="px-4 py-16 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text)]">
              {locale === 'ar' ? 'ثلاث خطوات بسيطة للتسليم' : 'Three Simple Steps to Approval'}
            </h2>
            <p className="text-xs md:text-sm text-[var(--muted)]">
              {locale === 'ar' ? 'ارفع • علّق • وافق' : 'Upload • Comment • Approve'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center mx-auto font-black text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">
                {locale === 'ar' ? 'ارفع العمل' : '1. Upload & Share'}
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Add images, PDFs, videos, or web links. Version drafts stay private until you choose to send for review.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center mx-auto font-black text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">
                {locale === 'ar' ? 'علّق بدقة' : '2. Pin & Discuss'}
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Clients mark pins, rectangles, or voice notes right on the deliverable. No scattered WhatsApp voice notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center mx-auto font-black text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">
                {locale === 'ar' ? 'وافق واقفل' : '3. Verified Sign-Off'}
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Clients approve via email confirmation. The version locks permanently and generates a tamper-evident certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Section */}
      <section className="px-4 py-16 md:py-24 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text)]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs md:text-sm text-[var(--muted)]">
            Start free, scale with team collaboration and agency white-labeling.
          </p>

          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] mt-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-[#FF5A3C] text-[#0F1A2E]' : 'text-[var(--muted)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                billingCycle === 'yearly' ? 'bg-[#FF5A3C] text-[#0F1A2E]' : 'text-[var(--muted)]'
              }`}
            >
              Yearly (Save ~20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isAgency = p.name === 'Agency';
            const price = billingCycle === 'yearly' ? Math.round(p.priceYearly / 12) : p.priceMonthly;

            return (
              <div
                key={p.id}
                className={`p-6 rounded-2xl bg-[var(--surface)] border transition-all flex flex-col justify-between ${
                  isAgency
                    ? 'border-[#FF5A3C] shadow-xl ring-2 ring-[#FF5A3C]/40 relative'
                    : 'border-[var(--border)] shadow-xs'
                }`}
              >
                {isAgency && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF5A3C] text-[#0F1A2E] text-[10px] font-black uppercase tracking-wider">
                    Most Popular for Teams
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text)]">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-[var(--text)]">${price}</span>
                      <span className="text-xs text-[var(--muted)]">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[var(--muted)] pt-3 border-t border-[var(--border)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{p.limits.activeProjects ? `${p.limits.activeProjects} Active Projects` : 'Unlimited Projects'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{Math.round(p.limits.storageBytes / (1024 * 1024 * 1024))} GB Storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{p.limits.members} Team Member(s)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{p.limits.screenshotsPerMonth} Website Screenshots/mo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${p.limits.branding ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span>{p.limits.branding ? 'Custom Agency Branding' : 'Pinly Default Branding'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${p.limits.certificate ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span>PDF Approval Certificates</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Button
                    variant={isAgency ? 'primary' : 'outline'}
                    className="w-full text-xs font-bold"
                    onClick={() => navigateTo('/auth')}
                  >
                    {p.priceMonthly === 0 ? 'Start Free' : `Upgrade to ${p.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-extrabold text-[var(--text)]">Frequently Asked Questions</h2>
            <p className="text-xs text-[var(--muted)]">Everything you need to know about Pinly.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border)] bg-[var(--canvas)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-start font-bold text-xs flex justify-between items-center text-[var(--text)] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--border)]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[var(--surface)] border-t border-[var(--border)] px-4 md:px-8 py-10 text-xs text-[var(--muted)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-xs">
              P
            </div>
            <span className="font-bold text-[var(--text)]">{brandConfig.name}</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button onClick={() => navigateTo('/legal/terms')} className="hover:text-[var(--text)] cursor-pointer">
              Terms of Use
            </button>
            <button onClick={() => navigateTo('/legal/privacy')} className="hover:text-[var(--text)] cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => navigateTo('/legal/dpa')} className="hover:text-[var(--text)] cursor-pointer">
              DPA Template
            </button>
            <button onClick={() => navigateTo('/help')} className="hover:text-[var(--text)] cursor-pointer">
              Help Center
            </button>
            <button onClick={() => navigateTo('/contact')} className="hover:text-[var(--text)] cursor-pointer">
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-50 p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
          <div className="text-xs">
            <p className="font-bold">Cookie & Privacy Preferences</p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              We use necessary cookies for session security and reviewer verification.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => setShowCookieBanner(false)}>
              Reject Non-essential
            </Button>
            <Button size="sm" variant="primary" onClick={() => setShowCookieBanner(false)}>
              Accept All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
