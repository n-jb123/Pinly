import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WorkType } from '../../data/types';
import { useApp } from '../../data/context';
import { UploadCloud, Image, FileText, Video, Globe, Link2, Check } from 'lucide-react';

export interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWork: (data: { title: string; type: WorkType; websiteUrl?: string; videoSource?: 'upload' | 'youtube' | 'vimeo' }) => Promise<void>;
}

export const AddWorkModal: React.FC<AddWorkModalProps> = ({
  isOpen,
  onClose,
  onAddWork,
}) => {
  const { t } = useApp();
  const [tab, setTab] = useState<'upload' | 'link'>('upload');
  const [title, setTitle] = useState<string>('');
  const [selectedType, setSelectedType] = useState<WorkType>('image');
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    try {
      await onAddWork({
        title: title.trim(),
        type: selectedType,
        websiteUrl: selectedType === 'website' ? linkUrl : undefined,
        videoSource: selectedType === 'video' && tab === 'link' ? 'youtube' : 'upload',
      });
      setTitle('');
      setLinkUrl('');
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={t('action.addWork')}
      description="Upload visual design files, documents, video footage, or enter a live web URL."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Tab Switcher */}
        <div className="flex bg-[var(--canvas)] p-0.5 rounded-xl border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              tab === 'upload' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--muted)]'
            }`}
          >
            Upload File (Image, PDF, Video)
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('link');
              setSelectedType('website');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              tab === 'link' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--muted)]'
            }`}
          >
            Add Web URL or Video Link
          </button>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1">
            Deliverable Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mobile App Onboarding Flow V1"
            className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
          />
        </div>

        {/* File Dropzone or Link URL */}
        {tab === 'upload' ? (
          <div className="space-y-3">
            {/* Work Type Select */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                Deliverable Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'image' as WorkType, label: 'Image', icon: Image },
                  { type: 'pdf' as WorkType, label: 'PDF Book', icon: FileText },
                  { type: 'video' as WorkType, label: 'Video File', icon: Video },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedType(item.type)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF5A3C] bg-[#FF5A3C]/10 text-[#0F1A2E] dark:text-white font-bold'
                          : 'border-[var(--border)] text-[var(--muted)] hover:bg-[var(--canvas)]'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-[#FF5A3C]" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (!title) setTitle('Uploaded Creative Work');
              }}
              className={`p-8 border-2 border-dashed rounded-2xl text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-[#FF5A3C] bg-[#FF5A3C]/5'
                  : 'border-[var(--border)] hover:border-slate-400 bg-[var(--canvas)]/50'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-[var(--muted)] mb-2" />
              <p className="text-xs font-semibold text-[var(--text)]">
                Drag and drop your file here, or click to browse
              </p>
              <span className="text-[10px] text-[var(--muted)] mt-1">
                PNG, JPG, WebP, SVG, PDF, MP4, WebM (up to 2 GB)
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                Deliverable Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedType('website')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedType === 'website'
                      ? 'border-[#FF5A3C] bg-[#FF5A3C]/10 font-bold'
                      : 'border-[var(--border)] text-[var(--muted)]'
                  }`}
                >
                  <Globe className="w-5 h-5 text-[#FF5A3C]" />
                  <span className="text-xs">Live Website URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('video')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedType === 'video'
                      ? 'border-[#FF5A3C] bg-[#FF5A3C]/10 font-bold'
                      : 'border-[var(--border)] text-[var(--muted)]'
                  }`}
                >
                  <Video className="w-5 h-5 text-[#FF5A3C]" />
                  <span className="text-xs">YouTube / Vimeo</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                Target URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder={
                    selectedType === 'website'
                      ? 'https://example.com/checkout'
                      : 'https://youtube.com/watch?v=...'
                  }
                  className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            {t('action.cancel')}
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isUploading}>
            Add Work (as Draft)
          </Button>
        </div>
      </form>
    </Modal>
  );
};
