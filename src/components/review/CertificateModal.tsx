import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Award, Download, CheckCircle2, Shield, Calendar, Globe } from 'lucide-react';
import { useApp } from '../../data/context';

export interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  workTitle?: string;
  versionNumber?: number;
  approverName?: string;
  approverEmail?: string;
  approvedAt?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  projectName = 'Apex Brand & Website Redesign',
  workTitle = 'Landing Page Hero & Features',
  versionNumber = 3,
  approverName = 'Tariq Al-Sabah',
  approverEmail = 'tariq@apexlogistics.com',
  approvedAt = new Date().toISOString(),
}) => {
  const { workspace, showToast } = useApp();

  const handleDownloadPdf = () => {
    showToast('Approval certificate PDF generated and downloaded', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Verified Approval Certificate">
      <div className="space-y-4">
        {/* Certificate Sheet Preview */}
        <div className="p-6 md:p-8 rounded-2xl bg-white text-slate-900 border-4 border-slate-900 shadow-xl space-y-6 select-none">
          {/* Certificate Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black">
                  P
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">Pinly Verification Registry</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 uppercase font-semibold">Official Sign-off & Audit Record</p>
            </div>
            <div className="text-end">
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Certified Final
              </span>
              <p className="text-[10px] font-mono text-slate-400 mt-1">ID: CERT-2026-APX-{Math.floor(Math.random() * 8999 + 1000)}</p>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              Certificate of Client Approval
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              This document certifies that the creative deliverable detailed below has undergone full contextual revision cycles and received final verified sign-off through the Pinly platform.
            </p>
          </div>

          {/* Deliverable Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Workspace / Agency</span>
              <span className="font-bold text-slate-900">{workspace.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Project Title</span>
              <span className="font-bold text-slate-900">{projectName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Approved Work & Version</span>
              <span className="font-bold text-slate-900">{workTitle} (Version {versionNumber})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Signee</span>
              <span className="font-bold text-slate-900">{approverName}</span>
            </div>
          </div>

          {/* Cryptographic & Audit Details */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
            <p className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-emerald-600" />
              Verified Email: {approverEmail} (Token confirmed)
            </p>
            <p className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              Approval UTC Timestamp: {new Date(approvedAt).toUTCString()}
            </p>
            <p className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-slate-500" />
              Recorded IP & Platform: 197.35.120.44 • Safari Mac OS X 10_15_7
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownloadPdf}
          >
            Download PDF Certificate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
