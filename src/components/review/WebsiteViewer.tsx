import React, { useState } from 'react';
import { Version, Thread, AnnotationType, Viewport } from '../../data/types';
import { Pin } from '../common/Pin';
import { Monitor, Tablet, Smartphone, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '../../data/context';

export interface WebsiteViewerProps {
  version: Version;
  websiteUrl?: string;
  threads: Thread[];
  selectedThreadId?: string;
  onSelectThread: (thread: Thread) => void;
  onPlaceAnnotation: (geometry: { x: number; y: number; viewport?: Viewport }, type: AnnotationType) => void;
  isLocked?: boolean;
}

export const WebsiteViewer: React.FC<WebsiteViewerProps> = ({
  version,
  websiteUrl = 'https://apexlogistics.example.com/pricing',
  threads,
  selectedThreadId,
  onSelectThread,
  onPlaceAnnotation,
  isLocked = false,
}) => {
  const { qaWebsiteBlocked, t } = useApp();
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(!qaWebsiteBlocked);

  const viewportWidths = {
    desktop: 'w-full max-w-5xl h-[650px]',
    tablet: 'w-[768px] max-w-full h-[650px]',
    mobile: 'w-[375px] max-w-full h-[650px]',
  };

  const viewportThreads = threads.filter((th) => !th.annotation?.viewport || th.annotation.viewport === viewport);

  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    onPlaceAnnotation({ x, y, viewport }, 'pin');
  };

  const currentScreenshotUrl =
    version.screenshots?.find((s) => s.viewport === viewport)?.url ||
    version.displayUrl ||
    version.mediaUrl;

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between p-4 overflow-auto select-none"
      style={{ backgroundColor: 'var(--canvas)' }}
    >
      {/* Viewport & Mode Switch Toolbar */}
      <div className="z-20 flex items-center gap-2 p-1.5 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-2xl shadow-md mb-3">
        {/* Viewport Buttons */}
        <div className="flex items-center bg-[var(--canvas)] p-0.5 rounded-xl border border-[var(--border)]">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              viewport === 'desktop' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--muted)]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              viewport === 'tablet' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--muted)]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              viewport === 'mobile' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--muted)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Live vs Screenshot toggle */}
        <div className="flex items-center gap-1 ps-2 border-s border-[var(--border)]">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
              isLiveMode && !qaWebsiteBlocked
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {isLiveMode && !qaWebsiteBlocked ? 'Live View' : 'Screenshot'}
          </span>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[var(--muted)] hover:text-[var(--text)]"
            title="Open URL in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Notice if Live is blocked or fallback screenshot is active */}
      {(qaWebsiteBlocked || !isLiveMode) && (
        <div className="mb-3 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
          <span>{t('review.screenshotNotice')} ({viewport})</span>
        </div>
      )}

      {/* Simulated Device Frame Container */}
      <div
        className={`relative bg-white shadow-2xl rounded-xl border border-[var(--border)] overflow-hidden transition-all duration-200 ${viewportWidths[viewport]}`}
      >
        {/* Browser Mock Navigation Bar */}
        <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 flex items-center gap-2 select-none">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[11px] px-3 py-0.5 rounded-md truncate font-mono">
            {websiteUrl}
          </div>
        </div>

        {/* Viewport Interactive Area with Pins */}
        <div
          onClick={handleFrameClick}
          className="relative w-full h-[calc(100%-2rem)] overflow-y-auto cursor-crosshair bg-slate-50"
        >
          {/* Webpage Content simulation / Screenshot */}
          <div className="relative">
            <img
              src={currentScreenshotUrl}
              alt="Website preview"
              className="w-full h-auto block select-none pointer-events-none"
            />

            {/* Pins on this website viewport */}
            {viewportThreads.map((thread) => {
              const ann = thread.annotation;
              if (!ann?.geometry) return null;
              return (
                <Pin
                  key={thread.id}
                  number={thread.number}
                  status={thread.status}
                  isSelected={thread.id === selectedThreadId}
                  style={{
                    left: `${ann.geometry.x * 100}%`,
                    top: `${ann.geometry.y * 100}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectThread(thread);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
};
