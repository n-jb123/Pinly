import React, { useState } from 'react';
import { Thread, ThreadStatus } from '../../data/types';
import { ThreadItem } from './ThreadItem';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { useApp } from '../../data/context';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export interface ThreadListProps {
  threads: Thread[];
  previousVersionThreads?: Thread[];
  selectedThreadId?: string;
  onSelectThread: (thread: Thread) => void;
  onReply: (threadId: string, data: any) => void;
  onSetStatus: (threadId: string, status: ThreadStatus) => void;
  onEditComment?: (commentId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReact?: (commentId: string, emoji: string) => void;
  onSubmitFeedback?: () => void;
  isClientView?: boolean;
  isLocked?: boolean;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  previousVersionThreads = [],
  selectedThreadId,
  onSelectThread,
  onReply,
  onSetStatus,
  onEditComment,
  onDeleteComment,
  onReact,
  onSubmitFeedback,
  isClientView = false,
  isLocked = false,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current');
  const [filterStatus, setFilterStatus] = useState<ThreadStatus | 'all'>('all');

  const activeThreadsPool = activeTab === 'current' ? threads : previousVersionThreads;

  const filteredThreads = activeThreadsPool.filter((thread) => {
    if (filterStatus === 'all') return true;
    return thread.status === filterStatus;
  });

  return (
    <div className="w-full md:w-[360px] h-full bg-[var(--surface)] border-s border-[var(--border)] flex flex-col shrink-0 select-none">
      {/* Top Tabs */}
      <div className="p-3 border-b border-[var(--border)] space-y-2.5">
        <div className="flex bg-[var(--canvas)] p-0.5 rounded-xl border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'current'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            This Version ({threads.length})
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'previous'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {t('review.previousFeedback')} ({previousVersionThreads.length})
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {(['all', 'open', 'resolved', 'closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border transition-all cursor-pointer shrink-0 ${
                filterStatus === st
                  ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold border-[#FF5A3C]'
                  : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--text)]/20'
              }`}
            >
              {st === 'all' ? 'All' : t(`thread.${st}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Threads Scroll Area */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-5 h-5" />}
            title={t('review.noFeedback')}
            description="Tap anywhere on the work canvas to place a pin and begin a discussion thread."
          />
        ) : (
          filteredThreads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              isSelected={thread.id === selectedThreadId}
              onSelect={() => onSelectThread(thread)}
              onReply={(data) => onReply(thread.id, data)}
              onSetStatus={(status) => onSetStatus(thread.id, status)}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onReact={onReact}
              isClientView={isClientView}
              isLocked={isLocked}
            />
          ))
        )}
      </div>

      {/* Footer: "I sent my feedback" button */}
      {isClientView && !isLocked && threads.length > 0 && onSubmitFeedback && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
          <Button
            variant="primary"
            className="w-full text-xs font-bold"
            icon={<Send className="w-3.5 h-3.5" />}
            onClick={onSubmitFeedback}
          >
            {t('action.sentFeedback')}
          </Button>
        </div>
      )}
    </div>
  );
};
