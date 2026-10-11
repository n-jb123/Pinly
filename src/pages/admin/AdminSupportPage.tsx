import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { SupportMessage } from '../../data/types';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { LifeBuoy, Send, CheckCircle2, User, Globe } from 'lucide-react';

export const AdminSupportPage: React.FC = () => {
  const { client, showToast, qaLoading, qaError } = useApp();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const msgs = await client.adminListSupport();
      setMessages(msgs);
      if (msgs.length > 0) setSelectedMessage(msgs[0]);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setIsSending(true);
    try {
      await client.adminReplySupport(selectedMessage.id, replyText.trim());
      showToast('Reply dispatched to customer email', 'success');
      setReplyText('');
      loadData();
    } finally {
      setIsSending(false);
    }
  };

  if (loading || qaLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-[var(--border)]/50 rounded-xl animate-pulse" />
        </div>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Customer Support Desk</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Inbound freelancer inquiries with automatically attached client, project, and browser diagnostic context.
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={<LifeBuoy className="w-8 h-8" />}
          title="No customer support inquiries"
          description="Inbound user questions and technical support issues will arrive here."
        />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbox list */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMessage(m)}
              className={`p-4 text-xs cursor-pointer transition-colors ${
                selectedMessage?.id === m.id ? 'bg-[#FF5A3C]/10 border-s-4 border-[#FF5A3C]' : 'hover:bg-[var(--canvas)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[var(--text)]">{m.from}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    m.status === 'new' ? 'bg-[#FF5A3C] text-[#0F1A2E]' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <h4 className="font-semibold text-[var(--text)] truncate">{m.subject}</h4>
              <p className="text-[11px] text-[var(--muted)] line-clamp-1 mt-0.5">{m.body}</p>
            </div>
          ))}
        </div>

        {/* Message Detail & Reply Box */}
        {selectedMessage && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] font-mono">
                {new Date(selectedMessage.at).toLocaleString()}
              </span>
              <h3 className="text-base font-bold text-[var(--text)] mt-1">{selectedMessage.subject}</h3>
              <p className="text-xs text-[var(--muted)]">From: {selectedMessage.from}</p>
            </div>

            {/* Auto-attached Diagnostic Context */}
            <div className="p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-[11px] text-[var(--muted)] font-mono space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
                <Globe className="w-3.5 h-3.5 text-[#FF5A3C]" />
                Auto-Attached Environment Context:
              </div>
              <p>{selectedMessage.context}</p>
            </div>

            <div className="text-xs leading-relaxed text-[var(--text)] bg-[var(--canvas)]/40 p-4 rounded-xl border border-[var(--border)]">
              {selectedMessage.body}
            </div>

            {selectedMessage.reply && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">Previous Answer from Support:</span>
                <p>{selectedMessage.reply}</p>
              </div>
            )}

            {/* Reply Input */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <label className="block text-xs font-semibold text-[var(--text)]">Send Reply</label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write resolution response..."
                className="w-full text-xs p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Send className="w-3.5 h-3.5" />}
                  isLoading={isSending}
                  onClick={handleSendReply}
                >
                  Dispatch Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
