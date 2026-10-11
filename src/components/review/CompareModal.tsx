import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Version } from '../../data/types';
import { Button } from '../common/Button';
import { Columns2, Sliders, ArrowLeftRight } from 'lucide-react';

export interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: Version[];
  currentVersion: Version;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersion,
}) => {
  const [v1, setV1] = useState<Version>(versions[0] || currentVersion);
  const [v2, setV2] = useState<Version>(currentVersion);
  const [mode, setMode] = useState<'side-by-side' | 'slider'>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" title="Compare Versions">
      <div className="space-y-4">
        {/* Controls Bar: Pick versions & view mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--canvas)] rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--muted)]">Before:</span>
            <select
              value={v1.id}
              onChange={(e) => setV1(versions.find((v) => v.id === e.target.value) || v1)}
              className="text-xs px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-semibold"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  V{v.number} {v.state === 'draft' ? '(Draft)' : ''}
                </option>
              ))}
            </select>

            <ArrowLeftRight className="w-3.5 h-3.5 text-[var(--muted)] mx-1" />

            <span className="text-xs font-bold text-[var(--muted)]">After:</span>
            <select
              value={v2.id}
              onChange={(e) => setV2(versions.find((v) => v.id === e.target.value) || v2)}
              className="text-xs px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-semibold"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  V{v.number} {v.state === 'draft' ? '(Draft)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[var(--surface)] p-0.5 rounded-lg border border-[var(--border)]">
            <button
              onClick={() => setMode('slider')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer font-semibold ${
                mode === 'slider' ? 'bg-[#FF5A3C] text-[#0F1A2E]' : 'text-[var(--muted)]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Slider
            </button>
            <button
              onClick={() => setMode('side-by-side')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer font-semibold ${
                mode === 'side-by-side' ? 'bg-[#FF5A3C] text-[#0F1A2E]' : 'text-[var(--muted)]'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              Side by Side
            </button>
          </div>
        </div>

        {/* Visual Comparison Stage */}
        {mode === 'slider' ? (
          <div className="relative w-full h-[450px] overflow-hidden rounded-xl border border-[var(--border)] select-none bg-slate-900 flex items-center justify-center">
            {/* Background Image (After - V2) */}
            <img
              src={v2.displayUrl || v2.mediaUrl}
              alt="Version 2"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Foreground Image with Clip Path (Before - V1) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
              <img
                src={v1.displayUrl || v1.mediaUrl}
                alt="Version 1"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#FF5A3C] shadow-lg cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-[#FF5A3C] text-[#0F1A2E] text-xs font-black flex items-center justify-center shadow-md">
                ↔
              </div>
            </div>

            {/* Interactive Slider Input Overlay */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />

            {/* Badges */}
            <div className="absolute top-3 start-3 z-10 px-2 py-1 bg-black/70 text-white rounded text-[11px] font-bold">
              Before (V{v1.number})
            </div>
            <div className="absolute top-3 end-3 z-10 px-2 py-1 bg-[#FF5A3C] text-[#0F1A2E] rounded text-[11px] font-bold">
              After (V{v2.number})
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 h-[450px]">
            <div className="relative rounded-xl border border-[var(--border)] overflow-hidden bg-slate-900 flex flex-col">
              <div className="p-2 bg-black/60 text-white text-[11px] font-bold">
                V{v1.number} (Original)
              </div>
              <div className="flex-1 flex items-center justify-center p-2">
                <img
                  src={v1.displayUrl || v1.mediaUrl}
                  alt="V1"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="relative rounded-xl border border-[var(--border)] overflow-hidden bg-slate-900 flex flex-col">
              <div className="p-2 bg-[#FF5A3C] text-[#0F1A2E] text-[11px] font-bold">
                V{v2.number} (Revised)
              </div>
              <div className="flex-1 flex items-center justify-center p-2">
                <img
                  src={v2.displayUrl || v2.mediaUrl}
                  alt="V2"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Compare
          </Button>
        </div>
      </div>
    </Modal>
  );
};
