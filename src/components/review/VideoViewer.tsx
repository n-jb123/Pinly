import React, { useState, useRef } from 'react';
import { Version, Thread, AnnotationType } from '../../data/types';
import { Pin } from '../common/Pin';
import { Play, Pause, Volume2, FastForward, Clock } from 'lucide-react';
import { Button } from '../common/Button';

export interface VideoViewerProps {
  version: Version;
  threads: Thread[];
  selectedThreadId?: string;
  onSelectThread: (thread: Thread) => void;
  onPlaceAnnotation: (geometry: { x: number; y: number; timeStart?: number; timeEnd?: number }, type: AnnotationType) => void;
  isLocked?: boolean;
}

export const VideoViewer: React.FC<VideoViewerProps> = ({
  version,
  threads,
  selectedThreadId,
  onSelectThread,
  onPlaceAnnotation,
  isLocked = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(version.durationSec || 30);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<number>(5);
  const [rangeEnd, setRangeEnd] = useState<number>(12);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 30);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleCommentAtCurrentTime = () => {
    if (isLocked) return;
    if (isRangeMode) {
      onPlaceAnnotation({ x: 0.5, y: 0.5, timeStart: rangeStart, timeEnd: rangeEnd }, 'rect');
    } else {
      onPlaceAnnotation({ x: 0.5, y: 0.5, timeStart: Math.floor(currentTime) }, 'pin');
    }
  };

  // Frame click for pinned marker at timestamp
  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    onPlaceAnnotation({ x, y, timeStart: Math.floor(currentTime) }, 'pin');
  };

  // Threads visible around current time
  const visibleFrameThreads = threads.filter((t) => {
    const ann = t.annotation;
    if (!ann || ann.timeStart === undefined) return false;
    return Math.abs(ann.timeStart - currentTime) <= 2;
  });

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-hidden"
      style={{ backgroundColor: 'var(--canvas)' }}
    >
      {/* Video Display Container */}
      <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
        <div onClick={handleFrameClick} className="relative cursor-crosshair">
          <video
            ref={videoRef}
            src={version.mediaUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full max-h-[60vh] object-contain block mx-auto"
          />

          {/* Markers overlay on frame if close to current time */}
          {visibleFrameThreads.map((thread) => {
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

        {/* Custom Video Controls Bar */}
        <div className="bg-[#0F1A2E] text-white p-3 space-y-2">
          {/* Timeline Bar with Thread Markers */}
          <div className="relative w-full h-4 flex items-center group cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const newT = parseFloat(e.target.value);
                setCurrentTime(newT);
                if (videoRef.current) videoRef.current.currentTime = newT;
              }}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF5A3C]"
            />

            {/* Timeline thread pins */}
            {threads.map((thread) => {
              const tStart = thread.annotation?.timeStart;
              if (tStart === undefined) return null;
              const posPercent = (tStart / duration) * 100;

              return (
                <div
                  key={thread.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRef.current) videoRef.current.currentTime = tStart;
                    onSelectThread(thread);
                  }}
                  title={`Thread #${thread.number} at ${formatTime(tStart)}`}
                  style={{ left: `${posPercent}%` }}
                  className="absolute -top-1 transform -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FF5A3C] border border-white text-[9px] font-bold text-[#0F1A2E] flex items-center justify-center cursor-pointer hover:scale-125 z-10"
                >
                  {thread.number}
                </div>
              );
            })}
          </div>

          {/* Lower controls: Play/pause, time, speed, comment buttons */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <span className="font-mono text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Speed menu */}
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg text-[11px]">
                <FastForward className="w-3 h-3 text-slate-400" />
                {[0.5, 1, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => changeSpeed(sp)}
                    className={`px-1 py-0.5 rounded cursor-pointer ${
                      playbackSpeed === sp ? 'font-bold text-[#FF5A3C]' : 'text-slate-400'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>

            {/* Comment at time / range actions */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-white border-slate-700 hover:bg-slate-800"
                onClick={() => setIsRangeMode(!isRangeMode)}
              >
                {isRangeMode ? 'Single Frame' : 'Time Range'}
              </Button>

              <Button
                size="sm"
                variant="primary"
                icon={<Clock className="w-3.5 h-3.5" />}
                onClick={handleCommentAtCurrentTime}
                disabled={isLocked}
              >
                {isRangeMode
                  ? `Comment (${formatTime(rangeStart)} - ${formatTime(rangeEnd)})`
                  : `Comment at ${formatTime(currentTime)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
