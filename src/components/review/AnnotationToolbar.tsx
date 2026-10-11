import React from 'react';
import { AnnotationType } from '../../data/types';
import { MapPin, Square, PenTool, Highlighter, ZoomIn, ZoomOut, Maximize2, MousePointer } from 'lucide-react';

export interface AnnotationToolbarProps {
  activeTool: AnnotationType | 'select';
  onSelectTool: (tool: AnnotationType | 'select') => void;
  workType: 'image' | 'pdf' | 'video' | 'website';
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  disabled?: boolean;
}

export const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  activeTool,
  onSelectTool,
  workType,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  disabled = false,
}) => {
  return (
    <div className="absolute top-4 start-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-2xl shadow-xl select-none">
      {/* Selection Mode */}
      <button
        onClick={() => onSelectTool('select')}
        disabled={disabled}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          activeTool === 'select'
            ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
            : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
        }`}
        title="Browse Mode (Pan & View)"
      >
        <MousePointer className="w-4 h-4" />
      </button>

      {/* Pin Tool (Keyboard shortcut P) */}
      <button
        onClick={() => onSelectTool('pin')}
        disabled={disabled}
        className={`p-2 rounded-xl transition-all cursor-pointer relative ${
          activeTool === 'pin'
            ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
            : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
        }`}
        title="Pin Point (Press P or click anywhere)"
      >
        <MapPin className="w-4 h-4" />
      </button>

      {/* Rectangle Tool */}
      <button
        onClick={() => onSelectTool('rect')}
        disabled={disabled}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          activeTool === 'rect'
            ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
            : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
        }`}
        title="Rectangle Area"
      >
        <Square className="w-4 h-4" />
      </button>

      {/* Freehand Tool */}
      <button
        onClick={() => onSelectTool('freehand')}
        disabled={disabled}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          activeTool === 'freehand'
            ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
            : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
        }`}
        title="Freehand Draw"
      >
        <PenTool className="w-4 h-4" />
      </button>

      {/* PDF Highlight Tool (Only shown for PDF) */}
      {workType === 'pdf' && (
        <button
          onClick={() => onSelectTool('highlight')}
          disabled={disabled}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'highlight'
              ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
              : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
          }`}
          title="Highlight Text"
        >
          <Highlighter className="w-4 h-4" />
        </button>
      )}

      <div className="w-[1px] h-5 bg-[var(--border)] mx-1" />

      {/* Zoom Controls */}
      <button
        onClick={onZoomOut}
        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)] cursor-pointer"
        title="Zoom Out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <span className="text-[11px] font-semibold text-[var(--muted)] px-1 w-10 text-center">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)] cursor-pointer"
        title="Zoom In"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onResetZoom}
        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)] cursor-pointer"
        title="Fit to Screen"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
