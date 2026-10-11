import React, { useState, useEffect } from 'react';
import { Mic, Square, Trash2, Check, Play, Pause } from 'lucide-react';
import { Button } from '../common/Button';

export interface VoiceRecorderProps {
  onRecordingComplete: (voiceUrl: string, durationSec: number) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onCancel,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 120) {
            // max 2 minutes limit
            setIsRecording(false);
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleConfirm = () => {
    onRecordingComplete('https://actions.google.com/sounds/v1/speech/greeting.ogg', seconds);
  };

  return (
    <div className="p-3 bg-[var(--canvas)] rounded-xl border border-[var(--border)] space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          )}
          <span className="text-[var(--text)]">
            {isRecording ? 'Recording Voice Note...' : 'Voice Note Ready'}
          </span>
        </div>
        <span className="font-mono text-[var(--muted)]">{formatSec(seconds)} / 02:00</span>
      </div>

      {/* Simulated Waveform */}
      <div className="h-8 flex items-center justify-center gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-100 ${
              isRecording ? 'bg-[#FF5A3C]' : 'bg-slate-400'
            }`}
            style={{
              height: isRecording
                ? `${Math.sin(i + seconds * 2) * 40 + 50}%`
                : '30%',
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
          title="Discard recording"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {isRecording ? (
            <Button size="sm" variant="danger" icon={<Square className="w-3 h-3" />} onClick={stopRecording}>
              Stop
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                icon={isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
              >
                Preview
              </Button>
              <Button
                size="sm"
                variant="primary"
                icon={<Check className="w-3.5 h-3.5" />}
                onClick={handleConfirm}
              >
                Attach Voice
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
