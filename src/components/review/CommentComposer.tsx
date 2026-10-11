import React, { useState } from 'react';
import { Button } from '../common/Button';
import { VoiceRecorder } from './VoiceRecorder';
import { Paperclip, Mic, Send, Smile, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Attachment } from '../../data/types';

export interface CommentComposerProps {
  onSubmit: (data: { body: string; voiceUrl?: string; voiceSec?: number; attachments?: Attachment[] }) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  disabled?: boolean;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({
  onSubmit,
  onCancel,
  placeholder = 'Write a comment... (use @ to mention)',
  submitLabel = 'Post comment',
  disabled = false,
}) => {
  const [text, setText] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceData, setVoiceData] = useState<{ url: string; sec: number } | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && !voiceData && attachments.length === 0) return;

    onSubmit({
      body: text.trim(),
      voiceUrl: voiceData?.url,
      voiceSec: voiceData?.sec,
      attachments,
    });

    setText('');
    setVoiceData(null);
    setAttachments([]);
    setShowEmojiPicker(false);
  };

  const addMockAttachment = () => {
    if (attachments.length >= 3) return;
    const newAtt: Attachment = {
      id: `att_${Date.now()}`,
      name: `reference_proof_${attachments.length + 1}.png`,
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      mime: 'image/png',
      sizeBytes: 1024 * 380,
    };
    setAttachments((prev) => [...prev, newAtt]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  if (isRecordingVoice) {
    return (
      <VoiceRecorder
        onRecordingComplete={(url, sec) => {
          setVoiceData({ url, sec });
          setIsRecordingVoice(false);
        }}
        onCancel={() => setIsRecordingVoice(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm space-y-2.5">
      {/* Attached Voice Tag */}
      {voiceData && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FF5A3C]/10 border border-[#FF5A3C]/30 text-xs">
          <div className="flex items-center gap-2 text-[#0F1A2E] dark:text-[#FF5A3C] font-semibold">
            <Mic className="w-3.5 h-3.5 text-[#FF5A3C]" />
            <span>Voice Note attached ({voiceData.sec}s)</span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceData(null)}
            className="text-[var(--muted)] hover:text-rose-500 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Attachments list */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--canvas)] border border-[var(--border)] text-xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#FF5A3C]" />
              <span className="truncate max-w-[120px] font-medium">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="text-[var(--muted)] hover:text-rose-500 ms-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-xs p-2.5 rounded-xl bg-transparent border border-transparent focus:border-[var(--border)] focus:outline-none resize-none leading-relaxed text-[var(--text)]"
        />
        <span className="absolute bottom-1.5 end-2 text-[10px] text-[var(--muted)] font-mono">
          {text.length}/2000
        </span>
      </div>

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)]">
          {['👍', '❤️', '🚀', '🔥', '👀', '✅', '👏', '🎯'].map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => addEmoji(em)}
              className="text-sm p-1 rounded hover:bg-[var(--surface)] transition-transform hover:scale-125 cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* Lower toolbar */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsRecordingVoice(true)}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)] cursor-pointer"
            title="Record voice note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={addMockAttachment}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)] cursor-pointer"
            title="Attach images / PDF (up to 3)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)] cursor-pointer"
            title="Add emoji reaction"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button size="sm" variant="ghost" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            type="submit"
            icon={<Send className="w-3.5 h-3.5" />}
            disabled={disabled || (!text.trim() && !voiceData && attachments.length === 0)}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
