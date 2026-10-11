import React, { useState } from 'react';
import { Version, Thread, AnnotationType } from '../../data/types';
import { Pin } from '../common/Pin';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PdfViewerProps {
  version: Version;
  threads: Thread[];
  selectedThreadId?: string;
  onSelectThread: (thread: Thread) => void;
  activeTool: AnnotationType | 'select';
  onPlaceAnnotation: (geometry: { x: number; y: number; w?: number; h?: number }, type: AnnotationType, page: number) => void;
  zoom: number;
  isLocked?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  version,
  threads,
  selectedThreadId,
  onSelectThread,
  activeTool,
  onPlaceAnnotation,
  zoom,
  isLocked = false,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = version.pageCount || 6;

  const pageThreads = threads.filter((t) => (t.annotation?.page || 1) === currentPage);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (activeTool === 'pin') {
      onPlaceAnnotation({ x, y }, 'pin', currentPage);
    } else if (activeTool === 'highlight') {
      onPlaceAnnotation({ x: Math.max(0.1, x - 0.2), y, w: 0.4, h: 0.04 }, 'highlight', currentPage);
    } else if (activeTool === 'rect') {
      onPlaceAnnotation({ x, y, w: 0.3, h: 0.2 }, 'rect', currentPage);
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between p-4 overflow-auto select-none"
      style={{ backgroundColor: 'var(--canvas)' }}
    >
      {/* Top Floating Page Navigation */}
      <div className="z-10 flex items-center gap-2 p-1.5 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-xl shadow-md mb-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-[var(--text)] px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rendered Document Page Canvas */}
      <div
        onClick={handlePageClick}
        className="relative bg-white text-slate-900 shadow-2xl rounded-sm p-12 transition-transform duration-150 cursor-crosshair min-h-[700px] w-[550px] max-w-full flex flex-col justify-between"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div className="space-y-6">
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Corporate Brand Book</span>
              <h1 className="text-2xl font-black text-slate-900">Apex Brand Guidelines</h1>
            </div>
            <span className="text-xs font-bold text-slate-400">Section 0{currentPage}</span>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-900 text-sm">
              {currentPage === 1 && '1. Primary Brand Identity & Color Swatches'}
              {currentPage === 2 && '2. Official Typography Hierarchy & Web Spacing'}
              {currentPage === 3 && '3. Logo Clear-space and Prohibited Treatments'}
              {currentPage >= 4 && `4.${currentPage} Component Specifications & Stationery Proofing`}
            </p>
            <p>
              The primary palette represents precision, authority, and trust across all enterprise logistics solutions. Ensure high contrast levels and ISO-certified coated offset printing guidelines.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="p-3 bg-[#0F1A2E] text-white rounded font-mono text-[10px]">
                <p className="font-bold">Ink Navy</p>
                <p>#0F1A2E</p>
              </div>
              <div className="p-3 bg-[#FF5A3C] text-[#0F1A2E] rounded font-mono text-[10px]">
                <p className="font-bold">Coral Signal</p>
                <p>#FF5A3C</p>
              </div>
              <div className="p-3 bg-[#F7F5F0] text-slate-900 border border-slate-300 rounded font-mono text-[10px]">
                <p className="font-bold">Paper Light</p>
                <p>#F7F5F0</p>
              </div>
            </div>
            <p className="pt-2">
              For print mediums, always refer to CMYK swatch tables. Never scale the logomark disproportionately or alter the relationship between emblem and wordmark.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Apex Logistics & Retail Ltd.</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {/* Existing Annotations for this Page */}
        {pageThreads.map((thread) => {
          const ann = thread.annotation;
          if (!ann || !ann.geometry) return null;
          const isSelected = thread.id === selectedThreadId;

          if (ann.type === 'highlight' && ann.geometry.w && ann.geometry.h) {
            return (
              <div
                key={thread.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectThread(thread);
                }}
                className={`absolute bg-amber-300/60 rounded-xs transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-[#FF5A3C] bg-amber-400/80' : ''
                }`}
                style={{
                  left: `${ann.geometry.x * 100}%`,
                  top: `${ann.geometry.y * 100}%`,
                  width: `${ann.geometry.w * 100}%`,
                  height: `${ann.geometry.h * 100}%`,
                }}
              >
                <div className="absolute -top-3 -start-3">
                  <Pin number={thread.number} status={thread.status} isSelected={isSelected} />
                </div>
              </div>
            );
          }

          return (
            <Pin
              key={thread.id}
              number={thread.number}
              status={thread.status}
              isSelected={isSelected}
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

      <div className="h-6" />
    </div>
  );
};
