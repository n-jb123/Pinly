import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { FileText, Save } from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const { client, showToast, qaLoading, qaError } = useApp();
  const [content, setContent] = useState<any>({
    landingHeadline: 'Get client feedback exactly where it matters.',
    termsMd: 'Full terms of service content...',
    privacyMd: 'Full privacy policy content...',
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const c = await client.adminGetContent();
      setContent(c);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await client.adminSaveContent(content);
      showToast('Platform landing & legal copy updated', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Content & Legal Copy Management</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Update landing page headlines, FAQ texts, and legal terms templates without engineering commits.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Content
        </Button>
      </div>

      <div className="space-y-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1">Landing Page Hero Headline</label>
          <input
            type="text"
            value={content.landingHeadline}
            onChange={(e) => setContent({ ...content, landingHeadline: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1">Terms of Service (Markdown)</label>
          <textarea
            rows={6}
            value={content.termsMd}
            onChange={(e) => setContent({ ...content, termsMd: e.target.value })}
            className="w-full text-xs p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-mono resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1">Privacy Policy & DPA (Markdown)</label>
          <textarea
            rows={6}
            value={content.privacyMd}
            onChange={(e) => setContent({ ...content, privacyMd: e.target.value })}
            className="w-full text-xs p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-mono resize-none"
          />
        </div>
      </div>
    </div>
  );
};
