import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Mic, MicOff, Volume2, Sparkles, Send, Loader2, Bot, User, Radio } from 'lucide-react';
import { useApp } from '../../data/context';

export interface VoiceConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceConversationModal: React.FC<VoiceConversationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, workspace } = useApp();
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: `Hello ${user.name}! I am your Pinly Live Voice Assistant powered by Gemini 3.8. I have full context of ${workspace.name}'s current project and client feedback. Ask me to summarize open pins, draft replies, or walk through revisions.`,
      time: 'Just now',
    },
  ]);
  const [audioWaves, setAudioWaves] = useState<number[]>([15, 30, 60, 45, 80, 55, 30, 20]);
  const animationRef = useRef<number | null>(null);

  // Audio wave animation when connected
  useEffect(() => {
    if (isLiveConnected && !isMicMuted) {
      const interval = setInterval(() => {
        setAudioWaves(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 70) + 15)
        );
      }, 120);
      return () => clearInterval(interval);
    } else {
      setAudioWaves([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
    }
  }, [isLiveConnected, isMicMuted]);

  const toggleConnection = () => {
    if (isLiveConnected) {
      setIsLiveConnected(false);
      setIsSpeaking(false);
    } else {
      setIsLiveConnected(true);
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    }
  };

  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: 'Just now',
    };
    setConversation((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSpeaking(true);

    setTimeout(() => {
      let reply = "I've reviewed the latest comments on Version 3. Tariq requested darker coral contrast on the primary button, and Lina already confirmed alignment of partner logos. You're ready to request final sign-off once the button color is published!";
      if (textToSend.toLowerCase().includes('cta') || textToSend.toLowerCase().includes('button')) {
        reply = "Pin #1: Client Tariq Al-Sabah noted that the CTA button feels soft on high-res retina displays and suggested bumping font size by 2px with darker contrast.";
      } else if (textToSend.toLowerCase().includes('draft') || textToSend.toLowerCase().includes('reply')) {
        reply = "Here is a drafted response: 'Hi Tariq, we have adjusted the button weight and bumped font size to 16px with crisp #0F1A2E typography over the coral signal. Please take a look at the revised preview!'";
      }

      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant' as const,
          text: reply,
          time: 'Just now',
        },
      ]);
      setIsSpeaking(false);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text)]">Live Voice Review Assistant</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-500" />
                  Gemini 3.8 Live API
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">Real-time voice conversation & client feedback intelligence</p>
            </div>
          </div>
        </div>

        {/* Live Audio Visualizer Stage */}
        <div className="p-5 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] flex flex-col items-center justify-center text-center">
          <div className="relative mb-3">
            <button
              onClick={toggleConnection}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                isLiveConnected
                  ? 'bg-[#FF5A3C] text-[#0F1A2E] ring-4 ring-[#FF5A3C]/30 animate-pulse'
                  : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--border)]'
              }`}
            >
              {isLiveConnected ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
            </button>
            {isSpeaking && (
              <span className="absolute -top-1 -end-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--surface)] animate-ping" />
            )}
          </div>

          <div className="h-10 flex items-center gap-1 mb-2">
            {audioWaves.map((height, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-full bg-[#FF5A3C] transition-all duration-100"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <p className="text-xs font-semibold text-[var(--text)]">
            {isLiveConnected
              ? isSpeaking
                ? 'Gemini Live is speaking...'
                : 'Listening to your voice... Speak naturally.'
              : 'Tap microphone to start real-time Live voice session'}
          </p>
          <span className="text-[11px] text-[var(--muted)] mt-0.5">
            Model: models/gemini-3.8-live & gemini-3.8-flash
          </span>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant={isLiveConnected ? 'secondary' : 'primary'}
              onClick={toggleConnection}
            >
              {isLiveConnected ? 'Disconnect Voice' : 'Connect Live Voice'}
            </Button>
            {isLiveConnected && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMicMuted(!isMicMuted)}
              >
                {isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Voice Triggers */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Suggested Voice Queries</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Summarize all open feedback on Version 3',
              'What did Tariq ask for regarding the CTA button?',
              'Draft a polite reply to Thread #1',
              'Check if any blockers prevent approval',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(prompt)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[#FF5A3C] transition-colors cursor-pointer text-start"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Logs */}
        <div className="h-44 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse text-end' : ''
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0F1A2E] text-white'
                    : 'bg-[#FF5A3C] text-[#0F1A2E] font-bold'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0F1A2E] text-white'
                    : 'bg-[var(--canvas)] text-[var(--text)]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Text Input Fallback */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Type or speak a question about this work..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[#FF5A3C]"
          />
          <Button size="sm" onClick={() => handleSendPrompt()} icon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};
