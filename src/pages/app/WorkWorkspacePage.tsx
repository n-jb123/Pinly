import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Project, Work, Version, Thread, AnnotationType, Viewport } from '../../data/types';
import { ReviewHeader } from '../../components/review/ReviewHeader';
import { WorksStrip } from '../../components/review/WorksStrip';
import { AnnotationToolbar } from '../../components/review/AnnotationToolbar';
import { ImageViewer } from '../../components/review/ImageViewer';
import { PdfViewer } from '../../components/review/PdfViewer';
import { VideoViewer } from '../../components/review/VideoViewer';
import { WebsiteViewer } from '../../components/review/WebsiteViewer';
import { ThreadList } from '../../components/review/ThreadList';
import { CompareModal } from '../../components/review/CompareModal';
import { CertificateModal } from '../../components/review/CertificateModal';
import { CommentComposer } from '../../components/review/CommentComposer';
import { Button } from '../../components/common/Button';
import { Skeleton, ReviewCanvasSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import {
  UploadCloud,
  Download,
  RotateCcw,
  Send,
  CheckCircle2,
  Lock,
  ExternalLink,
  SplitSquareVertical,
} from 'lucide-react';

export interface WorkWorkspacePageProps {
  projectId?: string;
  workId?: string;
}

export const WorkWorkspacePage: React.FC<WorkWorkspacePageProps> = ({
  projectId = 'proj_website_redesign',
  workId = 'work_landing_page',
}) => {
  const { client, t, showToast, qaLoading, qaError } = useApp();

  const [loading, setLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Project | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);

  // Tools & Navigation
  const [activeTool, setActiveTool] = useState<AnnotationType | 'select'>('pin');
  const [zoom, setZoom] = useState<number>(1);
  const [pendingAnnotation, setPendingAnnotation] = useState<any>(null);

  // Modals
  const [showCompare, setShowCompare] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await client.getProject(projectId);
      setProject(p || null);
      const wks = await client.listWorks(projectId);
      setWorks(wks);

      const targetWork = wks.find((w) => w.id === workId) || wks[0];
      setActiveWork(targetWork);

      const fullProject = await client.openReviewLink('apex-redesign-2026');
      const workVersions = fullProject.versions.filter((v) => v.workId === targetWork.id);
      setVersions(workVersions);

      const cur = workVersions.find((v) => v.id === targetWork.currentVersionId) || workVersions[workVersions.length - 1];
      setSelectedVersion(cur);

      const ths = await client.listThreads(cur.id);
      setThreads(ths);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, workId]);

  const handleSelectWork = (work: Work) => {
    setActiveWork(work);
    setPendingAnnotation(null);
    setSelectedThreadId(undefined);
    // update versions
    client.openReviewLink('apex-redesign-2026').then((full) => {
      const workVers = full.versions.filter((v) => v.workId === work.id);
      setVersions(workVers);
      const current = workVers.find((v) => v.id === work.currentVersionId) || workVers[0];
      setSelectedVersion(current);
      client.listThreads(current.id).then(setThreads);
    });
  };

  const handleUploadNewVersion = async () => {
    if (!activeWork) return;
    const newVer = await client.uploadVersion(
      activeWork.id,
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600'
    );
    showToast(`New Version V${newVer.number} uploaded as Draft (hidden from client)`, 'info');
    loadData();
  };

  const handleSendForReview = async () => {
    if (!activeWork) return;
    await client.sendForReview(activeWork.id);
    showToast(t('toast.sent'), 'success');
    loadData();
  };

  const handleExportFeedback = async (format: 'pdf' | 'csv') => {
    if (!activeWork) return;
    await client.exportFeedback(activeWork.id, format);
    showToast(`Feedback exported as ${format.toUpperCase()}`, 'success');
  };

  const handleReopen = async () => {
    if (!activeWork) return;
    if (confirm('Reopen this approved deliverable? This action is logged.')) {
      await client.reopenWork(activeWork.id);
      showToast('Work reopened for revision', 'warning');
      loadData();
    }
  };

  if (loading || !project || !activeWork || !selectedVersion) {
    return <div className="p-8 text-center text-xs text-[var(--muted)]">Loading workspace...</div>;
  }

  const isApproved = selectedVersion.state === 'approved';

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-hidden select-none">
      {/* Review Header */}
      <ReviewHeader
        project={project}
        activeWork={activeWork}
        versions={versions}
        selectedVersion={selectedVersion}
        onSelectVersion={(v) => {
          setSelectedVersion(v);
          client.listThreads(v.id).then(setThreads);
        }}
        onOpenCompare={() => setShowCompare(true)}
        onRequestApproval={() => client.requestApproval(activeWork.id).then(loadData)}
        onSendForReview={handleSendForReview}
        isClientView={false}
      />

      {/* Works Strip */}
      <WorksStrip
        works={works}
        activeWorkId={activeWork.id}
        onSelectWork={handleSelectWork}
      />

      {/* Team Control Subheader */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {selectedVersion.state === 'draft' ? (
            <Button
              variant="primary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={handleSendForReview}
            >
              {t('action.sendForReview')}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={<UploadCloud className="w-3.5 h-3.5" />}
              onClick={handleUploadNewVersion}
            >
              {t('action.uploadVersion')}
            </Button>
          )}

          {isApproved && (
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleReopen}
            >
              {t('action.reopen')}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => handleExportFeedback('pdf')}
          >
            Export Feedback (PDF)
          </Button>

          {isApproved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCertificate(true)}
            >
              {t('action.downloadCertificate')}
            </Button>
          )}
        </div>
      </div>

      {/* Main Review Canvas Area */}
      <div className="flex-1 flex min-h-0 relative">
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <AnnotationToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            workType={activeWork.type}
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            onZoomOut={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            onResetZoom={() => setZoom(1)}
            disabled={isApproved}
          />

          {/* Active Work Canvas */}
          {activeWork.type === 'image' && (
            <ImageViewer
              version={selectedVersion}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => setSelectedThreadId(t.id)}
              activeTool={activeTool}
              onPlaceAnnotation={(geometry, type) => setPendingAnnotation({ geometry, type })}
              zoom={zoom}
              isLocked={isApproved}
            />
          )}

          {activeWork.type === 'pdf' && (
            <PdfViewer
              version={selectedVersion}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => setSelectedThreadId(t.id)}
              activeTool={activeTool}
              onPlaceAnnotation={(geometry, type, page) => setPendingAnnotation({ geometry, type, page })}
              zoom={zoom}
              isLocked={isApproved}
            />
          )}

          {activeWork.type === 'video' && (
            <VideoViewer
              version={selectedVersion}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => setSelectedThreadId(t.id)}
              onPlaceAnnotation={(geometry, type) => setPendingAnnotation({ geometry, type })}
              isLocked={isApproved}
            />
          )}

          {activeWork.type === 'website' && (
            <WebsiteViewer
              version={selectedVersion}
              websiteUrl={activeWork.websiteUrl}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => setSelectedThreadId(t.id)}
              onPlaceAnnotation={(geometry, type) => setPendingAnnotation({ geometry, type })}
              isLocked={isApproved}
            />
          )}

          {/* Pending composer */}
          {pendingAnnotation && !isApproved && (
            <div className="absolute bottom-6 start-1/2 -translate-x-1/2 z-40 w-96 max-w-[90vw]">
              <CommentComposer
                placeholder="Write internal team or client note..."
                submitLabel="Post Pin"
                onSubmit={async (draft) => {
                  const thr = await client.createThread(
                    {
                      versionId: selectedVersion.id,
                      type: pendingAnnotation.type,
                      geometry: pendingAnnotation.geometry,
                      page: pendingAnnotation.page,
                    },
                    draft
                  );
                  setThreads([thr, ...threads]);
                  setPendingAnnotation(null);
                  showToast('Note pinned', 'success');
                }}
                onCancel={() => setPendingAnnotation(null)}
              />
            </div>
          )}
        </div>

        {/* Side Feedback Panel */}
        <div className="hidden md:block h-full">
          <ThreadList
            threads={threads}
            selectedThreadId={selectedThreadId}
            onSelectThread={(t) => setSelectedThreadId(t.id)}
            onReply={async (tId, data) => {
              const com = await client.replyToThread(tId, data);
              setThreads(threads.map((t) => (t.id === tId ? { ...t, comments: [...(t.comments || []), com] } : t)));
            }}
            onSetStatus={async (tId, status) => {
              const updated = await client.setThreadStatus(tId, status);
              setThreads(threads.map((t) => (t.id === tId ? updated : t)));
            }}
            isClientView={false}
            isLocked={isApproved}
          />
        </div>
      </div>

      {/* Modals */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        versions={versions}
        currentVersion={selectedVersion}
      />

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        projectName={project.name}
        workTitle={activeWork.title}
        versionNumber={selectedVersion.number}
      />
    </div>
  );
};
