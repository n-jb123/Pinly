import React, { useState, useRef, useEffect } from 'react';
import { Version, Thread, AnnotationType } from '../../data/types';
import { Pin } from '../common/Pin';

export interface ImageViewerProps {
  version: Version;
  threads: Thread[];
  selectedThreadId?: string;
  onSelectThread: (thread: Thread) => void;
  activeTool: AnnotationType | 'select';
  onPlaceAnnotation: (geometry: { x: number; y: number; w?: number; h?: number; points?: [number, number][] }, type: AnnotationType) => void;
  zoom: number;
  isLocked?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  version,
  threads,
  selectedThreadId,
  onSelectThread,
  activeTool,
  onPlaceAnnotation,
  zoom,
  isLocked = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Dragging rectangle state
  const [isDrawingRect, setIsDrawingRect] = useState(false);
  const [rectStart, setRectStart] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Keyboard Pin Placement (WCAG 2.1 AA requirement)
  const [keyboardMarker, setKeyboardMarker] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;

      if (e.key === 'p' || e.key === 'P') {
        if (!keyboardMarker) {
          setKeyboardMarker({ x: 0.5, y: 0.5 });
        }
      }

      if (keyboardMarker) {
        const step = e.shiftKey ? 0.05 : 0.01;
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setKeyboardMarker((prev) => prev ? { ...prev, y: Math.max(0.05, prev.y - step) } : null);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setKeyboardMarker((prev) => prev ? { ...prev, y: Math.min(0.95, prev.y + step) } : null);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setKeyboardMarker((prev) => prev ? { ...prev, x: Math.max(0.05, prev.x - step) } : null);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setKeyboardMarker((prev) => prev ? { ...prev, x: Math.min(0.95, prev.x + step) } : null);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          onPlaceAnnotation({ x: keyboardMarker.x, y: keyboardMarker.y }, 'pin');
          setKeyboardMarker(null);
        } else if (e.key === 'Escape') {
          setKeyboardMarker(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardMarker, isLocked, onPlaceAnnotation]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return;
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (activeTool === 'pin') {
      onPlaceAnnotation({ x, y }, 'pin');
    } else if (activeTool === 'rect') {
      setIsDrawingRect(true);
      setRectStart({ x, y });
      setCurrentRect({ x, y, w: 0, h: 0 });
    } else if (activeTool === 'freehand') {
      onPlaceAnnotation(
        {
          x,
          y,
          points: [
            [x, y],
            [x + 0.03, y + 0.02],
            [x + 0.06, y - 0.01],
            [x + 0.09, y + 0.03],
          ],
        },
        'freehand'
      );
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawingRect || !rectStart || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const currentY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const x = Math.min(rectStart.x, currentX);
    const y = Math.min(rectStart.y, currentY);
    const w = Math.abs(currentX - rectStart.x);
    const h = Math.abs(currentY - rectStart.y);

    setCurrentRect({ x, y, w, h });
  };

  const handlePointerUp = () => {
    if (isDrawingRect && currentRect && currentRect.w > 0.02 && currentRect.h > 0.02) {
      onPlaceAnnotation(currentRect, 'rect');
    }
    setIsDrawingRect(false);
    setRectStart(null);
    setCurrentRect(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-auto p-4 md:p-8 select-none"
      style={{ backgroundColor: 'var(--canvas)' }}
    >
      <div
        className="relative shadow-2xl transition-transform duration-150 inline-block"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img
          ref={imageRef}
          src={version.displayUrl || version.mediaUrl}
          alt={`Version ${version.number}`}
          className="max-h-[75vh] w-auto object-contain block rounded-sm pointer-events-auto"
          draggable={false}
        />

        {/* Existing Threads Pins and Overlays */}
        {threads.map((thread) => {
          const ann = thread.annotation;
          if (!ann || !ann.geometry) return null;

          const isSelected = thread.id === selectedThreadId;

          if (ann.type === 'pin') {
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
          }

          if (ann.type === 'rect' && ann.geometry.w && ann.geometry.h) {
            return (
              <div
                key={thread.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectThread(thread);
                }}
                className={`absolute border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#FF5A3C] bg-[#FF5A3C]/20 ring-2 ring-[#FF5A3C]'
                    : thread.status === 'resolved'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-[#FF5A3C] bg-[#FF5A3C]/10'
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

          if (ann.type === 'freehand' && ann.geometry.points) {
            return (
              <div
                key={thread.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectThread(thread);
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <svg className="w-full h-full absolute inset-0">
                  <polyline
                    points={ann.geometry.points
                      .map(([px, py]) => `${px * 100}%,${py * 100}%`)
                      .join(' ')}
                    fill="none"
                    stroke="#FF5A3C"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Pin
                  number={thread.number}
                  status={thread.status}
                  isSelected={isSelected}
                  style={{
                    left: `${ann.geometry.x * 100}%`,
                    top: `${ann.geometry.y * 100}%`,
                  }}
                  className="pointer-events-auto"
                />
              </div>
            );
          }

          return null;
        })}

        {/* Temporary Drawing Rectangle */}
        {currentRect && (
          <div
            className="absolute border-2 border-dashed border-[#FF5A3C] bg-[#FF5A3C]/20 pointer-events-none"
            style={{
              left: `${currentRect.x * 100}%`,
              top: `${currentRect.y * 100}%`,
              width: `${currentRect.w * 100}%`,
              height: `${currentRect.h * 100}%`,
            }}
          />
        )}

        {/* Accessible Keyboard Pin Marker */}
        {keyboardMarker && (
          <div
            className="absolute z-30"
            style={{
              left: `${keyboardMarker.x * 100}%`,
              top: `${keyboardMarker.y * 100}%`,
            }}
          >
            <div className="w-7 h-7 rounded-full bg-[#FF5A3C] border-2 border-white text-[#0F1A2E] font-bold text-xs flex items-center justify-center animate-bounce shadow-lg">
              +
            </div>
            <div className="absolute top-8 start-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0F1A2E] text-white text-[10px] px-2 py-0.5 rounded shadow">
              Arrow keys to move, Enter to place, Esc to cancel
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
