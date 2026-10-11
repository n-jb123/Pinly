import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/Toast';
import { QAPanel } from '../common/QAPanel';
import { VoiceConversationModal } from '../common/VoiceConversationModal';
import { useApp } from '../../data/context';

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { openVoiceAssistant, setOpenVoiceAssistant } = useApp();

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      <ToastContainer />
      <QAPanel />
      <VoiceConversationModal
        isOpen={openVoiceAssistant}
        onClose={() => setOpenVoiceAssistant(false)}
      />
    </div>
  );
};
