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
import { IdentityModal } from '../../components/review/IdentityModal';
import { ApprovalModal } from '../../components/review/ApprovalModal';
import { CertificateModal } from '../../components/review/CertificateModal';
import { CommentComposer } from '../../components/review/CommentComposer';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { MessageSquare, Plus, ChevronUp, ChevronDown } from 'lucide-react';

export interface ClientReviewPageProps {
  token?: string;
  isClientView?: boolean;
}

export const ClientReviewPage: React.FC<ClientReviewPageProps> = ({
  token = 'apex-redesign-2026',
  isClientView = true,
}) => {
  const { client, t, showToast, qaLoading, qaError } = useApp();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);

  // Annotation tool & zoom
  const [activeTool, setActiveTool] = useState<AnnotationType | 'select'>('pin');
  const [zoom, setZoom] = useState<number>(1);

  // New annotation composer overlay
  const [pendingAnnotation, setPendingAnnotation] = useState<{
    geometry: any;
    type: AnnotationType;
    page?: number;
    viewport?: Viewport;
  } | null>(null);

  // Modals
  const [showCompare, setShowCompare] = useState<boolean>(false);
  const [showIdentity, setShowIdentity] = useState<boolean>(false);
  const [showApproval, setShowApproval] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Mobile bottom sheet state
  const [mobileSheetOpen, setMobileSheetOpen] = useState<boolean>(false);
  const [mobileCommentMode, setMobileCommentMode] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await client.openReviewLink(token);
      setProject(data.project);
      setWorks(data.works);
      const initialWork = data.activeWork || data.works[0];
      setActiveWork(initialWork);
      setVersions(data.versions);
      const curVer = data.versions.find((v) => v.id === initialWork.currentVersionId) || data.versions[data.versions.length - 1];
      setSelectedVersion(curVer);
      const ths = await client.listThreads(curVer.id);
      setThreads(ths);
    } catch (err: any) {
      setError(err.message || 'Failed to open review link.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // When work changes
  const handleSelectWork = async (work: Work) => {
    setActiveWork(work);
    setPendingAnnotation(null);
    setSelectedThreadId(undefined);
    try {
      // retrieve versions for this work from client
      const allVers = await client.compareVersions(work.currentVersionId, work.currentVersionId);
      // For mock simplicity, filter from client
      const fullProject = await client.openReviewLink(token);
      const workVersions = fullProject.versions.filter((v) => v.workId === work.id);
      setVersions(workVersions.length > 0 ? workVersions : [allVers.v1]);
      const current = workVersions.find((v) => v.id === work.currentVersionId) || workVersions[0] || allVers.v1;
      setSelectedVersion(current);
      const ths = await client.listThreads(current.id);
      setThreads(ths);
    } catch (err) {
      // fallback
    }
  };

  // When version changes
  const handleSelectVersion = async (ver: Version) => {
    setSelectedVersion(ver);
    setPendingAnnotation(null);
    setSelectedThreadId(undefined);
    const ths = await client.listThreads(ver.id);
    setThreads(ths);
  };

  const handlePlaceAnnotation = (geometry: any, type: AnnotationType, page?: number, viewport?: Viewport) => {
    // Check if client identified
    const storedIdentity = localStorage.getItem('pinly_client_name');
    if (isClientView && !storedIdentity) {
      setShowIdentity(true);
    }
    setPendingAnnotation({ geometry, type, page, viewport });
    setMobileCommentMode(false);
  };

  const handleCreateThread = async (draft: { body: string; voiceUrl?: string; voiceSec?: number; attachments?: any[] }) => {
    if (!pendingAnnotation || !selectedVersion) return;

    try {
      const newThread = await client.createThread(
        {
          versionId: selectedVersion.id,
          type: pendingAnnotation.type,
          geometry: pendingAnnotation.geometry,
          page: pendingAnnotation.page,
          viewport: pendingAnnotation.viewport,
          timeStart: pendingAnnotation.geometry?.timeStart,
          timeEnd: pendingAnnotation.geometry?.timeEnd,
        },
        draft
      );
      setThreads((prev) => [newThread, ...prev]);
      setSelectedThreadId(newThread.id);
      setPendingAnnotation(null);
      showToast('Comment pinned successfully', 'success');
    } catch (err: any) {
      showToast('Error saving comment', 'danger');
    }
  };

  const handleReplyThread = async (threadId: string, commentDraft: any) => {
    try {
      const comment = await client.replyToThread(threadId, commentDraft);
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, comments: [...(t.comments || []), comment] } : t))
      );
      showToast('Reply added', 'success');
    } catch (err: any) {
      showToast('Error adding reply', 'danger');
    }
  };

  const handleSetStatus = async (threadId: string, status: any) => {
    try {
      const updated = await client.setThreadStatus(threadId, status);
      setThreads((prev) => prev.map((t) => (t.id === threadId ? updated : t)));
      showToast(`Thread marked as ${status}`, 'success');
    } catch (err: any) {
      showToast('Error updating status', 'danger');
    }
  };

  const handleEditComment = async (commentId: string, text: string) => {
    await client.editComment(commentId, text);
    // reload threads
    if (selectedVersion) {
      const ths = await client.listThreads(selectedVersion.id);
      setThreads(ths);
    }
    showToast('Comment updated', 'success');
  };

  const handleDeleteComment = async (commentId: string) => {
    await client.deleteComment(commentId);
    if (selectedVersion) {
      const ths = await client.listThreads(selectedVersion.id);
      setThreads(ths);
    }
    showToast('Comment deleted', 'info');
  };

  const handleReact = async (commentId: string, emoji: string) => {
    await client.react(commentId, emoji);
    if (selectedVersion) {
      const ths = await client.listThreads(selectedVersion.id);
      setThreads(ths);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!activeWork) return;
    await client.submitFeedback(activeWork.id);
    showToast(t('toast.sent'), 'success');
  };

  if (loading || qaLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col p-4 space-y-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <div className="flex-1 flex gap-4">
          <Skeleton className="flex-1 rounded-2xl" />
          <Skeleton className="w-80 rounded-2xl hidden md:block" />
        </div>
      </div>
    );
  }

  if (error || qaError || !project || !activeWork || !selectedVersion) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <ErrorState message={error || undefined} onRetry={loadData} />
      </div>
    );
  }

  const isLocked = selectedVersion.state === 'approved';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col select-none overflow-hidden h-screen">
      {/* 1. Review Header Bar */}
      <ReviewHeader
        project={project}
        activeWork={activeWork}
        versions={versions}
        selectedVersion={selectedVersion}
        onSelectVersion={handleSelectVersion}
        onOpenCompare={() => setShowCompare(true)}
        onRequestApproval={() => client.requestApproval(activeWork.id).then(loadData)}
        onApprove={() => setShowApproval(true)}
        onRequestChanges={handleSubmitFeedback}
        isClientView={isClientView}
      />

      {/* 2. Works Thumbnail Strip Across the Top */}
      <WorksStrip
        works={works}
        activeWorkId={activeWork.id}
        onSelectWork={handleSelectWork}
      />

      {/* Mobile "Comment Mode" Floating Banner */}
      {mobileCommentMode && (
        <div className="bg-[#FF5A3C] text-[#0F1A2E] px-4 py-2 text-xs font-bold flex items-center justify-between z-30">
          <span>{t('review.tapToComment')}</span>
          <button
            onClick={() => setMobileCommentMode(false)}
            className="px-2 py-0.5 rounded bg-[#0F1A2E] text-white text-[11px]"
          >
            Done
          </button>
        </div>
      )}

      {/* 3. Main Review Body (Viewing Area + Feedback Panel) */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Central Media Canvas Viewing Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          {/* Floating Annotation Toolbar */}
          <AnnotationToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            workType={activeWork.type}
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            onZoomOut={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            onResetZoom={() => setZoom(1)}
            disabled={isLocked}
          />

          {/* Render Active Work Type Viewer */}
          {activeWork.type === 'image' && (
            <ImageViewer
              version={selectedVersion}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => {
                setSelectedThreadId(t.id);
                setMobileSheetOpen(true);
              }}
              activeTool={activeTool}
              onPlaceAnnotation={handlePlaceAnnotation}
              zoom={zoom}
              isLocked={isLocked}
            />
          )}

          {activeWork.type === 'pdf' && (
            <PdfViewer
              version={selectedVersion}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => {
                setSelectedThreadId(t.id);
                setMobileSheetOpen(true);
              }}
              activeTool={activeTool}
              onPlaceAnnotation={handlePlaceAnnotation}
              zoom={zoom}
              isLocked={isLocked}
            />
          )}

          {activeWork.type === 'video' && (
            <VideoViewer
              version={selectedVersion}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => {
                setSelectedThreadId(t.id);
                setMobileSheetOpen(true);
              }}
              onPlaceAnnotation={handlePlaceAnnotation}
              isLocked={isLocked}
            />
          )}

          {activeWork.type === 'website' && (
            <WebsiteViewer
              version={selectedVersion}
              websiteUrl={activeWork.websiteUrl}
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => {
                setSelectedThreadId(t.id);
                setMobileSheetOpen(true);
              }}
              onPlaceAnnotation={handlePlaceAnnotation}
              isLocked={isLocked}
            />
          )}

          {/* Floating Composer when user clicked a spot */}
          {pendingAnnotation && !isLocked && (
            <div className="absolute bottom-6 start-1/2 -translate-x-1/2 z-40 w-96 max-w-[90vw] animate-in zoom-in-95 duration-150">
              <CommentComposer
                placeholder="Write your note for this pin..."
                submitLabel="Save Pin"
                onSubmit={handleCreateThread}
                onCancel={() => setPendingAnnotation(null)}
              />
            </div>
          )}

          {/* Floating Mobile "Comment" button */}
          <div className="md:hidden absolute bottom-4 end-4 z-30 flex items-center gap-2">
            {!isLocked && (
              <button
                onClick={() => setMobileCommentMode(!mobileCommentMode)}
                className="px-4 py-2.5 rounded-full bg-[#FF5A3C] text-[#0F1A2E] font-bold text-xs flex items-center gap-1.5 shadow-xl border-2 border-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{mobileCommentMode ? 'Cancel' : t('action.comment')}</span>
              </button>
            )}

            <button
              onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
              className="p-2.5 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-xl cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Side Feedback Panel (360px) */}
        <div className="hidden md:block h-full">
          <ThreadList
            threads={threads}
            previousVersionThreads={[]}
            selectedThreadId={selectedThreadId}
            onSelectThread={(t) => setSelectedThreadId(t.id)}
            onReply={handleReplyThread}
            onSetStatus={handleSetStatus}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onReact={handleReact}
            onSubmitFeedback={handleSubmitFeedback}
            isClientView={isClientView}
            isLocked={isLocked}
          />
        </div>
      </div>

      {/* Mobile Bottom Sheet for Feedback Panel */}
      {mobileSheetOpen && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[var(--surface)] border-t border-[var(--border)] rounded-t-2xl shadow-2xl h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
            <span className="font-bold text-xs">Feedback ({threads.length})</span>
            <button
              onClick={() => setMobileSheetOpen(false)}
              className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)]"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ThreadList
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={(t) => setSelectedThreadId(t.id)}
              onReply={handleReplyThread}
              onSetStatus={handleSetStatus}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              onReact={handleReact}
              onSubmitFeedback={handleSubmitFeedback}
              isClientView={isClientView}
              isLocked={isLocked}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        versions={versions}
        currentVersion={selectedVersion}
      />

      <IdentityModal
        isOpen={showIdentity}
        onClose={() => setShowIdentity(false)}
        onSubmit={(identity) => {
          client.identifyReviewer(identity);
          showToast(`Welcome ${identity.name}! You can now comment directly.`, 'success');
        }}
      />

      <ApprovalModal
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        work={activeWork}
        version={selectedVersion}
        openThreadsCount={threads.filter((t) => t.status === 'open').length}
        onApproved={() => {
          loadData();
        }}
        onOpenCertificate={() => setShowCertificate(true)}
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
