import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { ArrowLeft, Search, HelpCircle, BookOpen, MessageSquare } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const HelpCenterPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      category: 'Getting Started',
      items: [
        'How to create your first project and upload deliverables',
        'How client review links work (no accounts needed)',
        'Understanding version drafts vs sent versions',
      ],
    },
    {
      category: 'Review & Annotations',
      items: [
        'Using pins, rectangle regions, and freehand drawing',
        'Multi-page PDF highlights and page switching',
        'Timestamp and range comments for video files',
        'Reviewing live websites and viewport switching',
      ],
    },
    {
      category: 'Approval & Certifications',
      items: [
        'How email verification protects client sign-off',
        'Generating and downloading PDF approval certificates',
        'Reopening an approved deliverable with audit logging',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          Back to Home
        </button>

        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text)]">Pinly Help Center</h1>
          <p className="text-xs text-[var(--muted)]">
            Everything you need to master client reviews, revision rounds, and verified approvals.
          </p>

          <div className="relative pt-2">
            <Search className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2 mt-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full text-xs ps-9 pe-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C] shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {articles.map((cat, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
              <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FF5A3C]" />
                {cat.category}
              </h3>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                {cat.items.map((art, j) => (
                  <li key={j} className="hover:text-[var(--text)] cursor-pointer hover:underline">
                    {art}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-2">
          <h4 className="text-sm font-bold text-[var(--text)]">Still need help?</h4>
          <p className="text-xs text-[var(--muted)]">Our support team is always available to help you configure your workflow.</p>
          <div className="pt-2">
            <Button size="sm" variant="primary" onClick={() => navigateTo('/contact')}>
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
