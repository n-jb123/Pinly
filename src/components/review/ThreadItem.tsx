import React, { useState } from 'react';
import { Thread, Comment, ThreadStatus } from '../../data/types';
import { Button } from '../common/Button';
import { CommentComposer } from './CommentComposer';
import { useApp } from '../../data/context';
import { Check, RotateCcw, Volume2, Edit2, Trash2, Smile, FileText } from 'lucide-react';

export interface ThreadItemProps {
  thread: Thread;
  isSelected?: boolean;
  onSelect: () => void;
  onReply: (comment: { body: string; voiceUrl?: string; attachments?: any[] }) => void;
  onSetStatus: (status: ThreadStatus) => void;
  onEditComment?: (commentId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReact?: (commentId: string, emoji: string) => void;
  isClientView?: boolean;
  isLocked?: boolean;
}

export const ThreadItem: React.FC<ThreadItemProps> = ({
  thread,
  isSelected = false,
  onSelect,
  onReply,
  onSetStatus,
  onEditComment,
  onDeleteComment,
  onReact,
  isClientView = false,
  isLocked = false,
}) => {
  const { t } = useApp();
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const comments = thread.comments || [];
  const firstComment = comments[0];

  const handleStartEdit = (c: Comment) => {
    setEditingCommentId(c.id);
    setEditText(c.body);
  };

  const handleSaveEdit = (cId: string) => {
    if (onEditComment && editText.trim()) {
      onEditComment(cId, editText.trim());
    }
    setEditingCommentId(null);
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition-all cursor-pointer p-4 space-y-3 ${
        isSelected
          ? 'bg-[var(--surface)] border-[#FF5A3C] shadow-md ring-1 ring-[#FF5A3C]'
          : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text)]/20'
      }`}
    >
      {/* Thread Header: Pin Number, Status, Meta */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-[#0F1A2E] border-2 border-white shadow-xs ${
              thread.status === 'resolved'
                ? 'bg-emerald-500'
                : thread.status === 'closed'
                ? 'bg-slate-500'
                : 'bg-[#FF5A3C]'
            }`}
          >
            {thread.number}
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text)] block leading-tight">
              {firstComment?.authorName || 'Reviewer'}
            </span>
            <span className="text-[10px] text-[var(--muted)] leading-tight">
              {thread.annotation?.page ? `Page ${thread.annotation.page} • ` : ''}
              {thread.annotation?.timeStart !== undefined ? `At 00:${thread.annotation.timeStart.toString().padStart(2, '0')} • ` : ''}
              {thread.status}
            </span>
          </div>
        </div>

        {/* Status Actions */}
        {!isLocked && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {thread.status === 'open' && !isClientView && (
              <Button
                size="sm"
                variant="outline"
                icon={<Check className="w-3 h-3 text-emerald-500" />}
                onClick={() => onSetStatus('resolved')}
                className="text-[11px] py-1 px-2"
              >
                {t('action.resolve')}
              </Button>
            )}

            {thread.status === 'resolved' && isClientView && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Check className="w-3 h-3" />}
                  onClick={() => onSetStatus('closed')}
                  className="text-[11px] py-1 px-2"
                >
                  {t('action.confirm')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<RotateCcw className="w-3 h-3" />}
                  onClick={() => onSetStatus('open')}
                  className="text-[11px] py-1 px-2"
                >
                  {t('action.reopen')}
                </Button>
              </div>
            )}

            {thread.status === 'closed' && (
              <Button
                size="sm"
                variant="outline"
                icon={<RotateCcw className="w-3 h-3" />}
                onClick={() => onSetStatus('open')}
                className="text-[11px] py-1 px-2"
              >
                {t('action.reopen')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Comments List in Thread */}
      <div className="space-y-3 pt-1">
        {comments.map((comment) => {
          const isDeleted = Boolean(comment.deletedAt);
          const isEdited = Boolean(comment.editedAt);

          return (
            <div key={comment.id} className="text-xs space-y-1.5 p-2 rounded-xl bg-[var(--canvas)]/60">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
                  <span>{comment.authorName}</span>
                  <span className="text-[10px] text-[var(--muted)] font-normal">
                    ({comment.authorKind === 'member' ? 'Team' : 'Client'})
                  </span>
                </div>

                {!isDeleted && !isLocked && (
                  <div className="flex items-center gap-1 text-[var(--muted)]" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="p-1 hover:text-[var(--text)] cursor-pointer"
                      title="Edit comment"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteComment && onDeleteComment(comment.id)}
                      className="p-1 hover:text-rose-500 cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content / Edit State */}
              {editingCommentId === comment.id ? (
                <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] focus:outline-none"
                    rows={2}
                  />
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setEditingCommentId(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleSaveEdit(comment.id)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className={`leading-relaxed ${isDeleted ? 'italic text-[var(--muted)]' : 'text-[var(--text)]'}`}>
                  {isDeleted ? t('comment.deleted') : comment.body}
                  {isEdited && !isDeleted && (
                    <span className="ms-1.5 text-[10px] text-[var(--muted)]">{t('comment.edited')}</span>
                  )}
                </p>
              )}

              {/* Voice Note Player if attached */}
              {comment.voiceUrl && !isDeleted && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] mt-1.5">
                  <Volume2 className="w-4 h-4 text-[#FF5A3C]" />
                  <audio controls src={comment.voiceUrl} className="h-6 w-full" />
                </div>
              )}

              {/* Attachment Preview */}
              {comment.attachments && comment.attachments.length > 0 && !isDeleted && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {comment.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px] font-medium text-[var(--text)] hover:text-[#FF5A3C]"
                    >
                      <FileText className="w-3 h-3 text-[#FF5A3C]" />
                      <span className="truncate max-w-[140px]">{att.name}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Reactions Bar */}
              {!isDeleted && (
                <div className="flex items-center gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
                  {comment.reactions.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => onReact && onReact(comment.id, r.emoji)}
                      className={`px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 border transition-colors cursor-pointer ${
                        r.mine
                          ? 'bg-[#FF5A3C]/10 border-[#FF5A3C]/40 text-[#0F1A2E] dark:text-white font-bold'
                          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]'
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span>{r.count}</span>
                    </button>
                  ))}
                  {onReact && !isLocked && (
                    <button
                      onClick={() => onReact(comment.id, '👍')}
                      className="text-[var(--muted)] hover:text-[var(--text)] p-0.5 rounded cursor-pointer"
                      title="Add reaction"
                    >
                      <Smile className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reply Section */}
      {!isLocked && (
        <div className="pt-1" onClick={(e) => e.stopPropagation()}>
          {showReplyBox ? (
            <CommentComposer
              placeholder={t('action.reply') + '...'}
              submitLabel={t('action.reply')}
              onSubmit={(data) => {
                onReply(data);
                setShowReplyBox(false);
              }}
              onCancel={() => setShowReplyBox(false)}
            />
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={() => setShowReplyBox(true)}
            >
              {t('action.reply')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
