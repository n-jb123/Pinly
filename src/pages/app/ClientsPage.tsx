import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Client } from '../../data/types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Users, Plus, Mail, Building, Send, ExternalLink, ArrowRight } from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const { client, showToast, navigateTo, qaLoading, qaError } = useApp();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const cls = await client.listClients();
      setClients(cls);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    await client.createClient({ name: name.trim(), company: company.trim(), email: email.trim() });
    showToast('Client added successfully', 'success');
    setName('');
    setCompany('');
    setEmail('');
    setShowAddModal(false);
    loadData();
  };

  const handleSendPortalLink = async (clientId: string) => {
    await client.sendPortalLink(clientId);
    showToast('Magic portal link emailed to client', 'success');
  };

  if (loading || qaLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-44 bg-[var(--border)]/50 rounded-xl animate-pulse" />
          <div className="h-8 w-28 bg-[var(--border)]/50 rounded-xl animate-pulse" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">Clients Record</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Manage your client contacts, company records, and client portal magic links.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No clients yet"
          description="Add your first client to tie reviews and portal access."
          actionLabel="Add Client"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
          <div className="divide-y divide-[var(--border)]">
            {clients.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--canvas)]/30 transition-colors"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigateTo(`/app/clients/${c.id}`)}
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--canvas)] text-[#FF5A3C] font-black text-sm flex items-center justify-center border border-[var(--border)] group-hover:scale-105 transition-transform">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[#FF5A3C] transition-colors flex items-center gap-1.5">
                      <span>{c.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
                    </h3>
                    <p className="text-xs text-[var(--muted)] flex items-center gap-2 mt-0.5">
                      <span>{c.company || 'Private Customer'}</span>
                      <span>•</span>
                      <span>{c.email}</span>
                      <span>•</span>
                      <span>{c.projectCount || 1} Projects</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Send className="w-3.5 h-3.5" />}
                    onClick={() => handleSendPortalLink(c.id)}
                  >
                    Send Portal Link
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />}
                    onClick={() => navigateTo(`/portal/${c.id}`)}
                  >
                    Portal View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="sm" title="Add Client Record">
        <form onSubmit={handleCreate} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Client Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariq Al-Sabah"
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Company / Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apex Logistics"
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tariq@apexlogistics.com"
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
