import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Client } from '../../data/types';
import { useApp } from '../../data/context';

export interface QuickCreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onCreate: (name: string, clientId?: string) => Promise<void>;
}

export const QuickCreateProjectModal: React.FC<QuickCreateProjectModalProps> = ({
  isOpen,
  onClose,
  clients,
  onCreate,
}) => {
  const { t } = useApp();
  const [name, setName] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onCreate(name.trim(), clientId || undefined);
      setName('');
      setClientId('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      title={t('action.newProject')}
      description="Create a project container to upload works and send to your client."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apex Website Redesign"
            className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-1">
            Client (Optional)
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
          >
            <option value="">No client assigned yet</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isLoading}>
            {t('action.cancel')}
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading} disabled={!name.trim()}>
            Create & Add Works
          </Button>
        </div>
      </form>
    </Modal>
  );
};
